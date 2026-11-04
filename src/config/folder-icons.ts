/**
 * Folder icon assignments. Each key is the base name of an SVG pair in
 * `icons/`: `<name>.svg` (closed) and `<name>_open.svg` (expanded).
 *
 * The generic `folder` and `root` icons are applied automatically.
 */

export interface FolderIconRule {
	folderNames: string[];
}

export const folderIcons = {
	dotfolder: {
		folderNames: [
			// VCS & CI
			'.git', '.github', '.gitlab', '.circleci', '.husky', '.changeset', '.hg', '.svn', '.jj',
			// Editors & AI tools
			'.vscode', '.vs', '.idea', '.fleet', '.zed', '.vim', '.devcontainer', '.cursor', '.claude',
			// Package managers & toolchains
			'.yarn', '.pnpm-store', '.cargo', '.gradle', '.venv', '.tox', '.direnv', '.terraform', '.docker', '.config',
			// Framework output & caches
			'.next', '.nuxt', '.svelte-kit', '.astro', '.angular', '.expo', '.turbo', '.vercel', '.netlify', '.storybook',
			'.cache', '.parcel-cache', '.mypy_cache', '.pytest_cache', '.ruff_cache', '.godot',
		],
	},
} satisfies Record<string, FolderIconRule>;
