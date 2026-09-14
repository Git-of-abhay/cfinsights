# Help improve CFInsights

Thank you for helping! Star the repository if the dashboard is useful, report a bug, suggest a feature, or propose a focused pull request.

## Release status

The repository is public, but the original application's redistribution permission and project license have not yet been established. The core application is a copied browser distribution, not its original source tree. Do not assume that a public repository grants an open-source license. Licensing is a release blocker; please discuss substantial code contributions in an issue first.

## Get help or report an issue

Use https://github.com/Git-of-abhay/cfinsights/issues. Include your browser, the affected tab, what you expected, what happened, and steps to reproduce it. Screenshots help. Avoid posting credentials, private data, or unredacted account information.

For suspected security issues, avoid posting an exploit publicly. Check the repository Security tab for a private reporting option; if unavailable, ask the maintainer to arrange a private channel without publishing sensitive details.

## Run locally

```sh
python3 -m http.server 4175 --bind 127.0.0.1
```

Open http://localhost:4175. No credentials or package installation are needed for the static site.

## Propose a change

1. Open an issue describing the problem and proposed scope.
2. Fork the repository and use a dedicated branch.
3. Keep the slate/teal theme and existing profile/compare flow intact.
4. Prefer readable changes in `assets/enhancements.js` and `assets/theme.css`. Avoid editing the compiled `assets/app.js` without discussing source and build provenance.
5. Check the affected flow in light/dark mode and at mobile/desktop widths. Include the result in your pull request.

Never commit tokens or credentials. Document any new network service or local-storage use. A maintainer reviews changes before merging.
