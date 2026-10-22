import assert from 'node:assert/strict';
import test from 'node:test';
import { addItem, setQuantity, subtotal } from '../src/objects/cart.ts';
import type { CartItem } from '../src/objects/cart.ts';

const tray = {
  productId: 'tray',
  variantId: 'oak',
  unitPriceCents: 2400,
};

test('adding the same product and variant merges quantities', () => {
  const cart = addItem([], tray);

  assert.deepEqual(addItem(cart, tray, 2), [{ ...tray, quantity: 3 }]);
});

test('different variants and products remain separate cart lines', () => {
  let cart = addItem([], tray);
  cart = addItem(cart, { ...tray, variantId: 'walnut' });
  cart = addItem(cart, { ...tray, productId: 'stand' });

  assert.deepEqual(cart, [
    { ...tray, quantity: 1 },
    { ...tray, variantId: 'walnut', quantity: 1 },
    { ...tray, productId: 'stand', quantity: 1 },
  ]);
});

test('subtotal uses integer cents and returns zero for an empty cart', () => {
  const cart = addItem(addItem([], tray, 2), {
    productId: 'cup',
    variantId: 'chalk',
    unitPriceCents: 1800,
  });

  assert.equal(subtotal(cart), 6600);
  assert.equal(subtotal([]), 0);
});

test('setting quantity updates only the matching product and variant', () => {
  const cart = [
    { ...tray, quantity: 1 },
    { ...tray, variantId: 'walnut', quantity: 2 },
    { ...tray, productId: 'stand', quantity: 3 },
  ];

  assert.deepEqual(setQuantity(cart, 'tray', 'oak', 4), [
    { ...tray, quantity: 4 },
    cart[1],
    cart[2],
  ]);
  assert.deepEqual(setQuantity(cart, 'missing', 'oak', 4), cart);
});

test('setting quantity to zero removes only the matching line', () => {
  const cart = [
    { ...tray, quantity: 2 },
    { ...tray, variantId: 'walnut', quantity: 1 },
  ];

  assert.deepEqual(setQuantity(cart, 'tray', 'oak', 0), [cart[1]]);
});

test('addItem rejects zero, negative, fractional and non-finite quantities', () => {
  for (const quantity of [0, -1, 1.5, NaN, Infinity]) {
    assert.throws(() => addItem([], tray, quantity), RangeError);
  }
});

test('setQuantity rejects negative, fractional and non-finite quantities', () => {
  for (const quantity of [-1, 1.5, NaN, Infinity]) {
    assert.throws(() => setQuantity([], 'tray', 'oak', quantity), RangeError);
  }
});

test('prices must be nonnegative integer cents', () => {
  for (const unitPriceCents of [-1, 24.5, NaN, Infinity]) {
    assert.throws(() => addItem([], { ...tray, unitPriceCents }), RangeError);
  }

  assert.equal(subtotal(addItem([], { ...tray, unitPriceCents: 0 })), 0);
});

test('operations preserve the source array, its lines and the input item', () => {
  const line = Object.freeze({ ...tray, quantity: 2 });
  const cart: readonly CartItem[] = Object.freeze([line]);
  const item = Object.freeze({ ...tray, variantId: 'walnut' });

  const merged = addItem(cart, tray);
  const appended = addItem(cart, item);
  const changed = setQuantity(cart, 'tray', 'oak', 3);
  const removed = setQuantity(cart, 'tray', 'oak', 0);

  assert.deepEqual(cart, [{ ...tray, quantity: 2 }]);
  assert.deepEqual(item, { ...tray, variantId: 'walnut' });
  assert.equal(subtotal(cart), 4800);
  for (const result of [merged, appended, changed, removed]) {
    assert.notEqual(result, cart);
  }
  assert.notEqual(merged[0], line);
  assert.notEqual(changed[0], line);
});
