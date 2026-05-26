# @zenml/hashi (Hashi)

Hashi — the shared design system for ZenML frontend apps.

Currently exposes `@zenml/hashi/globals.css` (the canonical dual-theme stylesheet: generic ZenML at `:root`/`.dark`, Kitaru deviation under `[data-app="kitaru"]`).

## Consumers

- `apps/kitaru-ui` (OSS) — consumes `@zenml/hashi/globals.css` (Kitaru theme via `<html data-app="kitaru">`)

## Adding more content

When adding more, place sources under `src/` and add a subpath to `package.json` `exports` (the `./globals.css` entry is the existing pattern). Bump `private: true` to `false` and add a real `version` if/when publishing to npm.
