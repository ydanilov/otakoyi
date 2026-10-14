#!/usr/bin/env bash
# Vercel "Ignored Build Step" (vercel.json → ignoreCommand). Exit 0 = skip the build, 1 = build.
# Saves the Hobby plan's daily deployment limit: the Storybook project only builds from main.
url="${VERCEL_PROJECT_PRODUCTION_URL:-}"
branch="${VERCEL_GIT_COMMIT_REF:-}"
if [[ "$url" == *storybook* && "$branch" != "main" ]]; then
  echo "Storybook: skip preview build on $branch"
  exit 0
fi
exit 1
