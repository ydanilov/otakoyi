---
description: Push the current branch and open a PR with the template filled in
---

1. Confirm you are NOT on `main` (`git branch --show-current`). If you are, stop.
2. `git push -u origin HEAD`
3. Open a PR with `gh pr create --fill-first` and fill `.github/pull_request_template.md`: what & why, Figma link, Mobbin refs, checklist (tick only what you verified).
4. Wait for CI (`gh pr checks --watch`). If red, fix and push again.
5. Post the PR URL plus the Vercel preview and Storybook preview links, then **stop** — merging is a human checkpoint.
