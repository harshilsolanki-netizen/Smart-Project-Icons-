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

The generator calls **OpenAI or Google Gemini directly**. Vercel AI Gateway is not required. You can enable either provider, or both to let people choose in the studio.

In Vercel → this project → Settings → Environment Variables, configure:

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Enable direct OpenAI generation. Enter a key from https://platform.openai.com/api-keys directly in Vercel. |
| `GEMINI_API_KEY` | Enable direct Gemini generation. Enter a key from https://aistudio.google.com/apikey directly in Vercel. `GOOGLE_GENERATIVE_AI_API_KEY` is also accepted. |
| `ICON_STUDIO_ACCESS_CODE` | Required private team password of at least 16 characters. Choose a random password; this is separate from Vercel email verification. |

Only **one provider key and the studio password** are required. If both keys are configured, both choices become available. The public status endpoint exposes readiness and model names, never keys or the password. Configure keys/password as server-side Secrets for Production and then redeploy. For a local website, put the same values in a gitignored `.env.local`, then restart the development server.

Optional settings:

- `OPENAI_ICON_MODEL`: defaults to `gpt-6-sol` through the OpenAI Responses API.
- `GEMINI_ICON_MODEL`: defaults to `gemini-3.8-flash` through the Google API.
- `ICON_AI_PROVIDER`: preferred initial provider, `openai` or `gemini`. If unavailable, the initial choice uses whichever provider is configured. A failed generation is never retried against the other provider.

The defaults were checked against the official model documentation on 2 November 2026. Model access depends on your provider account and may change; use provider-native model IDs without a `provider/` prefix when overriding. The old `AI_GATEWAY_API_KEY` and `ICON_GENERATOR_MODEL` settings are no longer used by the app.

Official references: [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [OpenAI model](https://developers.openai.com/api/docs/models/gpt-6-sol), [Gemini structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [Gemini model](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash).

Redeploy after configuring variables. Never put API credentials in `NEXT_PUBLIC_` variables or commit them. The browser sends the studio access code only when a person explicitly requests a generation; it is not stored in localStorage. The endpoint authenticates before calling a model, validates prompt length, limits output and time, and builds SVG only from a strict geometry schema. It accepts no scripts, arbitrary attributes, external image URLs or raw model-supplied SVG. Configure a provider spending limit and a Vercel WAF rate limit before broader rollout; the shared access code is suitable for a small trusted team, not a replacement for per-user authentication.

Every AI result or composition is a draft. It can be downloaded but is not automatically published to Figma, GitHub or the shared catalogue. Model quality and semantic correctness still need human review. Codex or Antigravity can be used separately to review SVGs and maintain the library; neither desktop app is used as the website’s runtime model. Provider calls have a 45-second timeout, a 4096-token output cap and no automatic retries. Provider billing, model-access, quota and timeout failures have actionable messages without exposing raw upstream responses.

## Source and coverage

The SVGs were exported directly from the current Figma masters on 2 November 2026:

https://www.figma.com/design/AJqT5iFTCBAsqPRtj0zmL2/Creative-ADS?node-id=3798-23362

- 529 source catalogue rows across five categories.
- 493 published labels mapped to 217 shared SVG assets.
- 36 fully red cards excluded, following the design review instruction.
- 44 meaning-specific corrected masters included, covering all 46 requested meanings.
- Two source artworks contain embedded raster images; their original colors and aspect ratios are preserved. Their SVG containers do not make their pixels vector artwork.

All aliases and category memberships remain searchable. Deduplication is based on Figma master identity, not visual approximation. `data/figma-snapshot.json` keeps the source row/master mapping; `data/catalogue.json` records file hashes and all labels. `public/catalogue.json` is the downloadable manifest. No original source SVG geometry is modified on import. Color changes and variant composition happen only on requested download/preview copies.

Figma does not sync automatically. To update the library, export the changed approved masters, update the catalogue, snapshot and public SVG together, then commit and push. `npm test` verifies asset hashes and alias coverage. Never replace specific semantic symbols with generic glyphs just to match labels.

### Approved website corrections

On 3 November 2026, Chart settings was replaced with the user-approved corrected SVG, using a balanced gear and clear chart bars in the same 24px/1.8px rounded outline family. On 4 November 2026, Support was replaced with a headset surrounding a three-dot chat bubble and a microphone, following the user's supplied reference in the same outline family. Labels, categories and original Figma links remain unchanged. Both SVGs have versioned asset URLs so existing browser caches do not retain the old icons. `data/icon-corrections.json` records these overrides and is used by generation references. The original Figma snapshot is preserved; these website corrections have not been applied in Figma. All other assets remain exact source exports.

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
