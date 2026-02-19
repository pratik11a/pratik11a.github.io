# Main branch protection

This repository is configured to require owner-approved pull requests before changes land in `main`.

## What is enforced

- Direct pushes to `main` are restricted.
- Pull requests are required before merge.
- At least 1 approval is required.
- CODEOWNERS review is required.
- Stale approvals are dismissed when new commits are pushed.
- Force pushes and branch deletion are blocked.

## Files used

- `.github/CODEOWNERS` — sets the required code owner (`@pratik11a`).
- `.github/scripts/setup-main-branch-protection.sh` — applies branch protection via GitHub API.

## Apply protection via script

```bash
GITHUB_OWNER=pratik11a \
GITHUB_REPO=pratik11a.github.io \
GITHUB_USERNAME=pratik11a \
./.github/scripts/setup-main-branch-protection.sh
```

> You must be authenticated with `gh auth login` and have admin access to the repository.
