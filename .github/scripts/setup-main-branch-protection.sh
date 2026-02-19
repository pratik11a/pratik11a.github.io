#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   GITHUB_OWNER=pratik11a GITHUB_REPO=pratik11a.github.io GITHUB_USERNAME=pratik11a \
#   ./.github/scripts/setup-main-branch-protection.sh
#
# Prerequisites:
#   - GitHub CLI installed and authenticated: gh auth login
#   - Authenticated user must have admin rights on the repository.

: "${GITHUB_OWNER:?Set GITHUB_OWNER}"
: "${GITHUB_REPO:?Set GITHUB_REPO}"
: "${GITHUB_USERNAME:?Set GITHUB_USERNAME}"

if ! command -v gh >/dev/null 2>&1; then
  echo "❌ GitHub CLI (gh) is not installed."
  exit 1
fi

echo "🔒 Applying branch protection to ${GITHUB_OWNER}/${GITHUB_REPO} on branch main..."

gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  "/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/main/protection" \
  --input - <<JSON
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1,
    "require_last_push_approval": true
  },
  "restrictions": {
    "users": ["${GITHUB_USERNAME}"],
    "teams": [],
    "apps": []
  },
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
JSON

echo "✅ Branch protection applied."
echo "ℹ️ Direct push is restricted to: ${GITHUB_USERNAME}"
echo "ℹ️ Pull requests require approval and code owner review."
