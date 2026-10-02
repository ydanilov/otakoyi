// Conventional commits: feat|fix|chore|docs|test|refactor|perf|ci(scope): subject
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      1,
      "always",
      ["ui", "sections", "site", "works", "content", "tokens", "harness", "ci", "deps", "figma"],
    ],
    "body-max-line-length": [0],
  },
}

export default config
