---
description: Start a task the harness way — brief → reference → design → build → verify → PR
argument-hint: <issue number or one-line goal>
---

Task: $ARGUMENTS

1. Read `AGENTS.md`, `docs/brief.md` and the relevant ADRs in `docs/decisions/`.
2. If an issue number was given, read it with `gh issue view`. Restate the goal and acceptance criteria in 3–5 bullets. **If anything is ambiguous, stop and ask.**
3. Reference: check `docs/research/`. If the task is new UI, search Mobbin (MCP) for 3–5 references and add a note under `docs/research/`.
4. Design: if a Figma frame exists, read it via Figma MCP and map it to existing components (Storybook MCP lists them). Never invent a component that exists.
5. Create a branch: `git switch -c feat/<slug>` (or `fix/`, `chore/`).
6. Build with `@/components/ui` + tokens only. Every new/changed component gets a story with a `play` test.
7. Run `/verify`. Fix until green.
8. Run `/ship`.
