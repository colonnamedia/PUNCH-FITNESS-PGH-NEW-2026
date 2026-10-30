# Equipment image sourcing

The catalog currently contains 50 shopping paths: 10 exact product links with existing local site images and 40 tagged Amazon search links without photos. `equipment-image-manifest.csv` maps every card to its Amazon link and a proposed image path.

## Local image batch

1. Select an exact product for each search-category card where possible, then record its ASIN in the manifest.
2. Obtain an original PUNCH photo or a manufacturer image with permission for local hosting. Record the source and permission in `approved_source_or_license`.
3. Name the photo according to `proposed_image_path`, ideally WebP around 800–1200 px wide. Keep the subject centered with padding so it fits the card's image area.
4. Send the named files as one zip or upload them to the repository. The catalog can then match them to the manifest, while keeping the existing two-column mobile layout.
5. Verify each photo depicts the linked item and its relevant size or variant before publishing.

Do not download Amazon listing photos into this batch. Amazon's Associates license prohibits storing or caching Product Advertising Content images.

## Amazon image path

If the Associates account has Creators API access, use its Images resource for exact ASINs. Store ASINs, fetch the current image URLs server-side, and refresh the URL cache within 24 hours. Link the image/card to the matching Amazon item. This does not produce locally hosted assets. It also requires credentials and deployment code; do not put private credentials in the repository.

## Preview

`equipment-image-preview.html` shows six illustrative photo cards using current site images. It is marked noindex. These photos are for layout feedback and should not be treated as verified photos of the tagged search results.
