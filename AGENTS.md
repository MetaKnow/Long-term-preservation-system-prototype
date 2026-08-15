# Project Agents Guidance

## UI/UX Skill: ui-ux-pro-max

This project uses the `ui-ux-pro-max` skill for all UI/UX design and implementation work (designing, building, creating, reviewing, fixing, or improving interfaces).

- Skill definition: `.codex/skills/ui-ux-pro-max/SKILL.md` - read it before any UI/UX task and follow its workflow.
- Data: `.codex/skills/ui-ux-pro-max/data/` (CSV design database).
- Scripts: `.codex/skills/ui-ux-pro-max/scripts/` (`search.py`, `design_system.py`, `core.py`).

### Running the skill (Windows)

Use `python` (not `python3`) and the `.codex/skills/...` path. Run all commands from the project root.

Generate a full design system (required first step):

    python .codex\skills\ui-ux-pro-max\scripts\search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]

Detailed domain search:

    python .codex\skills\ui-ux-pro-max\scripts\search.py "<keyword>" --domain <domain> [-n <max_results>]

Stack guidelines (default: html-tailwind):

    python .codex\skills\ui-ux-pro-max\scripts\search.py "<keyword>" --stack html-tailwind

Available domains: product, style, typography, color, landing, chart, ux, react, web, prompt.
Available stacks: html-tailwind, react, nextjs, vue, svelte, swiftui, react-native, flutter, shadcn, jetpack-compose.

When implementing UI, also follow the "Common Rules for Professional UI" and "Pre-Delivery Checklist" sections in `SKILL.md`.
