# Repository guidance for Codex and other coding agents

## Keep documentation current

Documentation is part of completing a change. Before marking work complete:

- Read README.md and the documentation relevant to the affected feature.
- Update those documents in the same commit or pull request when changing user behavior, setup, configuration, routes, APIs, deployment, device support, or operational limitations.
- Remove or correct superseded instructions; do not leave conflicting descriptions of the current UI.
- For changes with no documentation impact, say so briefly in the completion or PR summary. Do not make unrelated documentation edits just to satisfy a checklist.
- Verify documented commands, paths, links, and settings against the current code. Record what was actually tested and clearly separate local checks, production verification, and physical-device verification.
- Never claim a reboot, authentication flow, deployment, or device behavior was tested without evidence. Date device observations and identify untested limitations.
- Never commit credentials, private display URLs, session data, signing keys, or personal device screenshots.

## Documentation map

- README.md: current setup, authentication, user-facing features, and links to detailed guides.
- docs/frame-display.md: fullscreen frame view, Android companion integration, startup/reboot expectations, and device verification.
- TECHNICAL_DOSSIER.md: historical technical snapshot; keep its historical status clear and point readers to current documentation. Do not present old architecture as current.
- ARCHITECTURE_BLUEPRINT.md: proposed architecture, not a statement that all proposed work has shipped.
- DOMAIN_CONSTITUTION.md: domain rules; review before changing domain behavior.

## Scope and verification

Preserve unrelated working-tree changes. Use focused checks appropriate to the change. Documentation-only edits need link/content/diff checks, not a full application build. Keep generated build files out of unrelated commits.
