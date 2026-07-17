# Help Hive AI Rules

These rules have been extracted from the Master Design System (Part VIII) and apply to all future AI interactions within this project.

## 61. Rules for Antigravity
When operating in this codebase, the AI must strictly adhere to the UI components already established. Never introduce a new raw HTML button if `<Button>` exists. Never introduce custom CSS where a reusable shadcn component exists.

## 62. Rules for Future Prompts
When asked to build a new feature, default to **Mobile-First** and **Senior-First** paradigms. 
- Do not assume desktop behavior.
- Always optimize for extreme accessibility (minimum 48px touch targets, minimum 16px text sizes).
- If a feature causes anxiety or confusion for a senior user, redesign it to be simpler.

## 63. Things AI Must Never Do
1. Never introduce complex, multi-column layouts on mobile.
2. Never reduce text size below 16px.
3. Never use generic Tailwind colors (e.g., `bg-red-500`) when semantic tokens exist.
4. Never build competitive "leaderboards" for volunteers; recognition should be impact-driven, not competitive.
5. Never design Help Hive to feel like a stressful "gig economy" app.

## 64. Reusable Design Principles
If a pattern solves a problem once, use it everywhere. Consistency builds trust. Always look at `src/components/ui/` and `src/features/*/components/` before creating new components.
