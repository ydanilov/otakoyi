#!/usr/bin/env node
// Claude Code Stop hook: before the agent says "done", the fast sensors must be green.
import { execSync } from "node:child_process"

const steps = ["pnpm -s tokens:check", "pnpm -s check:stories", "pnpm -s typecheck"]
for (const cmd of steps) {
  try {
    execSync(cmd, { stdio: "pipe" })
  } catch (e) {
    console.error(
      `✗ \`${cmd}\` failed — fix before finishing:\n${String(e.stdout || "")}${String(e.stderr || "")}`,
    )
    process.exit(2)
  }
}
