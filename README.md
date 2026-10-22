# Boost Painting redesign

A single-page redesign of boostpainting.ca, built as a pitch concept. It uses Boost Painting's own copy (condensed), photos, logo and Google rating.

Run it locally:

    python3 -m http.server 8010 --bind 127.0.0.1

Then open http://localhost:8010.

- `index.html`: everything (CSS + JS inline; GSAP, ScrollTrigger and Lenis load from CDN).
- `assets/`: the logo and 40 project photos, downloaded from their Squarespace site and converted from WebP to JPEG/PNG.

Check before going live:
- The "Book by December 12" offer is copied from their current site. Confirm the date and terms with Phil.
- The interior page mentions a "1 Year Warranty" in one paragraph. Everywhere else says 5-Year. This build uses 5-Year.
- The form opens a pre-filled email to phil@boostpainting.ca. It is not a backend.
