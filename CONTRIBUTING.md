# Contributing

Requires [Bun](https://bun.sh).

```sh
bun install
bun run build    # build every theme into dist/ (also syncs package.json)
```

Press <kbd>F5</kbd> in VS Code to open a window with the extension loaded, then
pick a theme with **Preferences: File Icon Theme**.

## Project layout

```
icons/                    Source SVGs, drawn in the default palette (16×16)
src/
  config/
    file-icons.ts         Which files/extensions/languages get which icon
    folder-icons.ts       Which folders get which icon
    palettes.ts           Color palettes (one theme + one "No Folders" theme each)
  lib/                    Theme generation, validation, recoloring, manifest sync
  build.ts                `bun run build` / `bun run check`
  images.ts               `bun run images` (README banner + listing)
  release.ts              `bun run package` / `dogfood` / `publish`
dist/                     Build output (gitignored, shipped in the VSIX)
```

## Adding an icon

1. Draw it at 16×16 and export the SVG to `icons/<name>.svg`. Only use colors
   from the default palette in `src/config/palettes.ts`; other colors won't
   change when the user picks a different palette.
2. Add a `<name>` entry to `src/config/file-icons.ts` with its `extensions`,
   `fileNames`, and/or `languageIds`.
3. Run `bun run build`. The build fails if a name is assigned to two icons or an
   assigned SVG is missing, and warns about unused SVGs and off-palette colors.
4. Run `bun run images` to refresh the README images, and add a CHANGELOG entry.

## Scripts

| Command                | What it does                                                         |
| ---------------------- | -------------------------------------------------------------------- |
| `bun run build`        | Build all themes into `dist/` and sync `contributes.iconThemes`      |
| `bun run check`        | Validate assignments + icons, typecheck, verify package.json is synced |
| `bun run images`       | Regenerate `images/readme/banner.png` and `listing.png`              |
| `bun run package`      | Build and package `bin/sharp-icons-<version>.vsix`                   |
| `bun run dogfood`      | Package and install into your local VS Code                          |
| `bun run publish`      | Package and publish to the VS Marketplace **and** Open VSX           |

## Releasing

The extension is published as `CiberTurtle.sharp-icons` on the
[VS Marketplace](https://marketplace.visualstudio.com/items?itemName=CiberTurtle.sharp-icons)
and as `rylydou.sharp-icons` on [Open VSX](https://open-vsx.org/extension/rylydou/sharp-icons).
`bun run publish` packages a VSIX per publisher and uploads each one; publishers
are configured in `src/release.ts`.

1. Bump `version` in `package.json` and move the CHANGELOG's `[Unreleased]` notes under it.
2. Commit, then tag and push: `git tag v1.3.0 && git push --follow-tags`.
3. The **Release** workflow checks that the tag matches `package.json`, publishes to
   both marketplaces, and attaches the VSIX files to a GitHub release.

### Trusted publishing

Publishing uses [trusted publishing](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#publish-with-github-actions-and-trusted-publishing)
(OIDC): the Release workflow's GitHub identity token is exchanged for a credential that
expires within minutes. No tokens are stored, so there are no repository secrets to set
or rotate. Because of this, `bun run publish` only works inside that workflow. Locally,
use `bun run publish --dry-run` to build both VSIX files without uploading them.

Set this up once per marketplace:

- **VS Marketplace:** go to [publisher management](https://marketplace.visualstudio.com/manage),
  open the `CiberTurtle` publisher, select **Trusted Publishing**, and create a policy:
  - Repository owner: `rylydou`
  - Repository: `sharp-icons`
  - Workflow: `release.yml`
  - Environment: leave empty
- **Open VSX:** go to [trusted publishers](https://open-vsx.org/user-settings/trusted-publishers)
  and register the same repository and workflow (`release.yml`) for `rylydou.sharp-icons`.

The policy is tied to the workflow file name, so renaming `release.yml` breaks
publishing until the policies are updated. Once both policies are in place, delete any
old `VSCE_PAT` / `OVSX_PAT` repository secrets and revoke the tokens.
