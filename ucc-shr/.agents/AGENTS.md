# AI Agent Behavior Rules

## UI & Component System Usage
- **Strictly Use Atomic Components**: ALWAYS use pre-defined atomic components (e.g., `<Heading>`, `<Text>`, `<Button>`, `<FadeIn>`) rather than hardcoding raw Tailwind CSS classes for typography, padding, or layouts.
- **Do Not Hardcode Design Tokens**: Text sizes, font weights, colors, and margins MUST come from the codebase's defined scales so that any future changes to the design system propagate automatically everywhere. If building a new section, first check `src/components/atoms` or `tailwind.config.ts` for existing utilities before writing custom classes.
