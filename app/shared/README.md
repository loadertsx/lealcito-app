# Shared

Reserved for reusable, domain-neutral UI and utilities. Nothing here imports
`core`, `features`, or `routes`. Keep business-specific components inside their
feature, even if several routes use them.

- `lib/cn.ts`: `cn()` to merge Tailwind classes, plus the `ClassName` and
  `ClassNameRecord` prop types. See the [style guide](../../docs/style-guide.md).

Do not add placeholders to fill this directory. See
[architecture](../../docs/architecture.md).
