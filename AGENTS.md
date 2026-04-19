## Learned User Preferences

- Target UI consistency with HeroUI v3 default theme and liquid-glass-style polish (Apple-like glass affordances).
- Prefer HeroUI components (`Toolbar isAttached`, `Button`, etc.) over native controls or bespoke chrome for shared marketing and tool headers.
- Keep the marketing homepage from duplicating the full tools grid; one browseable tools section (`ToolDirectory`) is enough.
- On tool routes, align the sticky header and outer layout to the same surface token as the main workspace so there is no visible seam.
- For marketing pages, keep header, body, and full-page wrapper on the same `background` canvas tokens so the canvas matches the header strip.
- When following an attached implementation plan, do not edit the plan file itself; update existing todos in place (in progress / completed).
- Prefer git commits that exclude editor-only paths such as `.cursor/` unless the user explicitly wants them tracked.

## Learned Workspace Facts

- App uses TanStack Router, Vite, pnpm, HeroUI v3, and Tailwind v4; global theme tokens are customized in `src/styles.css` after `@heroui/styles`.
- Tool UIs mount from the `_tools` route layout (`src/routes/_tools/route.tsx`), which uses `surface-secondary` as the unified shell background.
- Homepage route wraps content in a full-viewport `bg-background` column alongside `__root.tsx` body classes for a consistent marketing canvas.
- Each tool toolbar (the options bar below `ToolHeader`) must use `<ToolPageToolbar>` from `src/components/ToolPageToolbar.tsx` as its outer shell, with a HeroUI `<Toolbar aria-label="…">` inside for semantic role and layout.
- State management is intentionally per-tool: nanostores for Image Editor (cross-component shared state), router search params for Name Checker (shareable URLs), `useSessionStorage` for Diff Checker (tab persistence), and local `useState` for PDF Editor and Deco. Pick the lightest approach that fits the tool's sharing requirements — do not introduce a new pattern without a clear reason.
