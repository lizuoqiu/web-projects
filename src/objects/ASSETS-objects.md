# Objects image provenance

The nine displayed assets were generated on 21 October 2026 with the built-in OpenAI image generation tool. They adapt the lighting, photographic grain and material rendering of real reference photographs while replacing the subjects with the original Objects collection. They are generated product imagery, not photographs of existing commercial goods or evidence of real manufacture.

## Licensed photographic references

- Annie Spratt, [A desk with a lamp, books, and papers on it](https://unsplash.com/photos/a-desk-with-a-lamp-books-and-papers-on-it-1Tp_uIGDiDk), 19 April 2022. Primary reference for natural window light, timber texture, photographic grain and believable materials across all nine images.
- sehoon ye, [A desk with a lamp and a book on it](https://unsplash.com/photos/a-desk-with-a-lamp-and-a-book-on-it-y1InbfybVeA), 29 January 2023. Additional reference for authentic lamp surface response and warm glow in the two lamp product images; the primary reference's brighter daylight remains the main style.

Both official photo pages state that the images are free to use under the [Unsplash License](https://unsplash.com/license). Reference files were downloaded and visually inspected outside this public project. The original reference photographs are not served by the Objects website.

## Displayed generated assets

All paths below are relative to `public/images/objects/`. Each product asset contains two equal portrait photographs, with variants cropped in CSS by the declared side. The image pixels are not recolored for the variant switch.

| Asset | Left half | Right half |
| --- | --- | --- |
| `arc-tray-photo.png` | Maple wood | Walnut wood |
| `field-notebook-photo.png` | Oat cloth | Ink cloth |
| `column-rest-photo.png` | Chalk mineral composite | Graphite mineral composite |
| `loop-cup-photo.png` | Sand glazed stoneware | Forest glazed stoneware |
| `weekly-pad-photo.png` | Cream paper | Clay paper |
| `index-cards-photo.png` | Ivory card stock | Slate card stock |
| `focus-lamp-photo.png` | Chalk powder-coated metal | Ink powder-coated metal |
| `halo-light-photo.png` | Parchment powder-coated metal | Olive powder-coated metal, unavailable variant |

`desk-scene-photo.png` is the separate hero photograph, with a maple tray, oatmeal cloth notebook, sand pencil cup and parchment reading lamp on a sunlit wooden desk.

The former SVG studies are retained as original source assets but are no longer displayed. All generated originals and full prompts are preserved outside the public project in `outputs/objects-photo-generation-2026-10-21.json`; this local record also identifies the exact input and generated file paths.
