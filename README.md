# Boost Painting redesign

A single-page redesign of boostpainting.ca, built as a pitch concept. It uses Boost Painting's own copy (condensed), photos, logo and Google rating.

Run it locally:

    python3 -m http.server 8010 --bind 127.0.0.1

Then open http://localhost:8010.

- `index.html`: home page (residential).
- `interior.html`: interior services, built for conversions: a 3-step quote card in the hero that also opens as a sheet from every button, with the service preselected.
- `exterior.html`: exterior services page (real Boost photos; larger copies in `assets/hd/`).
- `commercial.html`: commercial services page (Unsplash stand-in photos, labelled in the footer).
- `about.html`, `contact.html`: short pages; `contact.html?service=Exterior%20painting` preselects a service.
- `page.js`: shared behaviour for about/contact (scroll, reveals, menu, call bar).
- `site.css`: shared styles (link is versioned `?v=2`; bump it when the CSS changes). Each page has its own inline JS; GSAP, ScrollTrigger and Lenis load from CDN.
- `assets/`: the logo and 40 project photos, downloaded from their Squarespace site and converted from WebP to JPEG/PNG.

Check before going live:
- The "Book by December 12" offer is copied from their current site. Confirm the date and terms with Phil.
- The interior page mentions a "1 Year Warranty" in one paragraph. Everywhere else says 5-Year. This build uses 5-Year.
- The form opens a pre-filled email to phil@boostpainting.ca. It is not a backend.
- The exterior page uses the 5-Year Warranty (as the site banner does). Their exterior page body text says "1 Year"; confirm.
- The "20% off" offer is left off the exterior page: their footer ties it to interior painting, and it runs Dec–Jan.
- Quote timing: the interior page says "within 2–5 hours" (from their interior page); the about page says "within 24 hours". Confirm which to use.
- The 20% offer band and chip hide themselves after December 12.
- Primary nav on every page: Interior · Exterior · Commercial · Portfolio · About. Portfolio stays a section of index.html by choice.
