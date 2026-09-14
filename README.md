# CFinsights

CFInsights is open source under the [MIT License](LICENSE), released by its creator Abhay (Git-of-abhay). Stars, bug reports, and contributions are welcome—see [CONTRIBUTING.md](CONTRIBUTING.md).

Bundled libraries retain their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). The repository currently includes the deployed application bundle and readable enhancement modules. Restoring the original source/build pipeline and resolving the reviewed security findings remain outstanding; this licensing announcement is not security approval.

Live site: https://git-of-abhay.github.io/cfinsights/

The custom `assets/theme.css` adds a solid slate and teal palette, with light and dark modes, restrained shadows, and no CSS gradients. Edit this file to adjust the theme independently of the compiled application.

## Experience enhancements

- Animated chart entrances with accessible chart labels
- An interactive 365-day heatmap with 30-day, 90-day, and one-year focus controls
- Example handles for faster onboarding
- A contextual Tutor that guides users through the landing page and every dashboard tab
- A responsive browser-based product guide at `/documentation.html`
- Keyboard support: press `?` to open Tutor and `Escape` to close it
- A dedicated seven-step Tutor path for Compare Mode
- Balanced two-column panels with contained scrolling for long content
- The supplied CFInsights logo across the dashboard, guide, and browser tab

A standalone static copy of https://cfinsights.netlify.app, captured on 2026-09-14, prepared for GitHub Pages. No login, passwords, API keys, or backend setup required.

## Run locally

```sh
python3 -m http.server 4175
```

Open http://localhost:4175.

## Deployment

The GitHub Actions workflow publishes the website on every push to `main`. GitHub Pages must use **GitHub Actions** as its source in repository Settings → Pages.

## What is included

- The original public browser JavaScript and CSS, preserving the interface, profile analysis, comparisons, charts, upcoming contests, light/dark mode, and responsive layout.
- Relative asset URLs so the site works under a GitHub Pages repository path.
- A clean HTML entrypoint without the original Google Analytics scripts or Netlify hosting metadata.

This is a copy of the deployed browser distribution, not the original React/TypeScript source repository. `assets/app.js` and `assets/app.css` are the original compiled assets. Third-party notices embedded in the bundle are retained. Original author attribution and outbound links are preserved. The Alpha dialog is the original informational announcement; it does not provide authentication or implement the announced future features.

Data is fetched directly from the public Codeforces API. Its availability and rate limits still apply. The original browser bundle stores the theme preference in local storage and loads profile avatars from Codeforces or ui-avatars.com.
