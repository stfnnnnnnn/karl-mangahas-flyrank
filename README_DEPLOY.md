# FlyRank-inspired interactive React capstone site

This version uses React 18 directly in the browser, so it can still be deployed from `docs/` on GitHub Pages without a Node build step.

Interactive features:
- responsive sticky navigation and mobile menu
- switchable Average Precision / Precision@20 / Precision@50 chart
- animated model comparison bars
- interactive reason-code explorer
- expandable feature list
- responsive timeline, action playbook, and limitations cards

Deploy:
1. Copy `docs/` into the repository root.
2. Verify all metrics against the final W07 receipts.
3. GitHub → Settings → Pages → Deploy from branch → `main` → `/docs`.
4. Verify the page in incognito and on mobile.
5. Put the exact deployed URL, one line only, in `submission/paper_url.txt`.

React, ReactDOM, and Babel load from public CDNs. This keeps deployment simple. For a later production portfolio, the same component can be moved into a Vite build.
