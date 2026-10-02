#!/usr/bin/env node
// Claude Code PostToolUse hook: instant sensor after every Edit/Write.
// Formats the file, lints it with the harness rules, and feeds failures back
// to the agent (exit code 2 = "show stderr to the model and let it fix it").
import { execFileSync } from "node:child_process"

let input = ""
process.stdin.on("data", (c) => (input += c))
process.stdin.on("end", () => {
  let file
  try {
    file = JSON.parse(input)?.tool_input?.file_path
  } catch {
    process.exit(0)
  }
  if (!file || !/\.(tsx?|mjs|css|json|md)$/.test(file) || file.includes("node_modules"))
    process.exit(0)

  // Generated files must never be edited by hand.
  if (/tokens\.generated\.ts$|src\/app\/tokens\.css$/.test(file)) {
    console.error(`✗ ${file} is generated. Edit tokens/tokens.json and run \`pnpm tokens\`.`)
    process.exit(2)
  }
  try {
    execFileSync("pnpm", ["exec", "prettier", "--write", "--log-level=warn", file], {
      stdio: "pipe",
    })
    if (/\.tsx?$/.test(file) && file.includes("/src/"))
      execFileSync("pnpm", ["exec", "eslint", "--max-warnings=0", file], { stdio: "pipe" })
  } catch (e) {
    console.error(String(e.stdout || "") + String(e.stderr || ""))
    process.exit(2)
  }
})
