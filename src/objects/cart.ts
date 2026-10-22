export type CartItem = {
  productId: string;
  variantId: string;
  unitPriceCents: number;
  quantity: number;
};

export function addItem(
  cart: readonly CartItem[],
  item: Omit<CartItem, 'quantity'>,
  quantity = 1,
): CartItem[] {
  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new RangeError('Added quantity must be a positive integer.');
  }
  if (!Number.isInteger(item.unitPriceCents) || item.unitPriceCents < 0) {
    throw new RangeError('Price must be nonnegative integer cents.');
  }

  const index = cart.findIndex(
    (line) => line.productId === item.productId && line.variantId === item.variantId,
  );

  if (index === -1) {
    return [...cart, { ...item, quantity }];
  }

  return cart.map((line, lineIndex) =>
    lineIndex === index ? { ...line, quantity: line.quantity + quantity } : line,
  );
}

export function setQuantity(
  cart: readonly CartItem[],
  productId: string,
  variantId: string,
  quantity: number,
): CartItem[] {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new RangeError('Quantity must be a nonnegative integer.');
  }

  const matches = (line: CartItem) =>
    line.productId === productId && line.variantId === variantId;

  if (quantity === 0) {
    return cart.filter((line) => !matches(line));
  }

  return cart.map((line) => (matches(line) ? { ...line, quantity } : line));
}

export function subtotal(cart: readonly CartItem[]): number {
  return cart.reduce((total, line) => total + line.unitPriceCents * line.quantity, 0);
}
