# Zio Icon Library

A complete Next.js website for the Zio icon family, with searchable categories, Figma source links, SVG/transparent PNG export, multi-select ZIP downloads, a local variant composer and an optional protected AI generator.

## Run locally

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build` followed by `npm start`.

## Deploy this repository to Vercel

1. Sign in to the intended Vercel account and select `harshilsolanki-5885s-projects`.
2. Choose **Add New → Project**, then import `harshilsolanki-netizen/Smart-Project-Icons-`.
3. Select the **Next.js** framework. Use the repository root, `npm run build`, and default output settings. Choose Node.js 22 or 24.
4. Deploy. The library and browser-based composer need no environment variables or database.

Vercel Hobby is intended for personal, non-commercial use. Choose an eligible plan for business use; this project does not purchase or upgrade a plan.

## Optional AI generation

AI generation is disabled until all three server environment variables are configured in Vercel:

- `AI_GATEWAY_API_KEY`: the administrator’s AI Gateway key, entered directly in Vercel.
- `ICON_GENERATOR_MODEL`: a currently available `provider/model` ID from the account’s AI Gateway model list.
- `ICON_STUDIO_ACCESS_CODE`: a randomly generated access code of at least 16 characters, shared only with people permitted to use paid generation.

Redeploy after configuring variables. Never put API credentials in `NEXT_PUBLIC_` variables or commit them. The browser sends the studio access code only when a person explicitly requests a generation; it is not stored in localStorage. The endpoint authenticates before calling a model, validates prompt length, limits output and time, and builds SVG only from a strict geometry schema. It accepts no scripts, arbitrary attributes, external image URLs or raw model-supplied SVG. Configure a provider spending limit and a Vercel WAF rate limit before broader rollout; the shared access code is suitable for a small trusted team, not a replacement for per-user authentication.

Every AI result or composition is a draft. It can be downloaded but is not automatically published to Figma, GitHub or the shared catalogue. Model quality and semantic correctness still need human review.

## Source and coverage

The SVGs were exported directly from the current Figma masters on 2 November 2026:

https://www.figma.com/design/AJqT5iFTCBAsqPRtj0zmL2/Creative-ADS?node-id=3798-23362

- 529 source catalogue rows across five categories.
- 493 published labels mapped to 217 shared SVG assets.
- 36 fully red cards excluded, following the design review instruction.
- 44 meaning-specific corrected masters included, covering all 46 requested meanings.
- Two source artworks contain embedded raster images; their original colors and aspect ratios are preserved. Their SVG containers do not make their pixels vector artwork.

All aliases and category memberships remain searchable. Deduplication is based on Figma master identity, not visual approximation. `data/figma-snapshot.json` keeps the source row/master mapping; `data/catalogue.json` records file hashes and all labels. `public/catalogue.json` is the downloadable manifest. No original source SVG geometry is modified on import. Color changes and variant composition happen only on requested download/preview copies.

Figma does not sync automatically. To update the library, export the changed approved masters, update the catalogue, snapshot and public SVG together, then commit and push. `npm test` verifies source hashes and alias coverage. Never replace specific semantic symbols with generic glyphs just to match labels.

## Validation

```sh
npm run typecheck
npm test
npm run build
```

Browser checks in `tests/browser.spec.ts` cover search, filtering, downloads, ZIP contents, local composition, disabled AI, keyboard access and mobile overflow. With a production server running on port 3000:

```sh
npx playwright test
```

## Rights and attribution

Lucide-derived artwork retains the licence in `public/LICENSE-LUCIDE.txt`; ZIP exports include it. Company and third-party brand artwork retain their respective ownership. No blanket open-source licence is applied to those assets.
