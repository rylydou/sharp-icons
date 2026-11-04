import { palettes, type Palette } from '../config/palettes.ts';
import { PACKAGE_JSON } from './paths.ts';

export const THEME_FILE = 'icons.json';
export const FOLDERLESS_THEME_FILE = 'icons-folderless.json';

interface IconThemeContribution {
	id: string;
	label: string;
	path: string;
}

/**
 * Theme IDs are public: users reference them in `workbench.iconTheme`.
 * Keep this scheme stable so existing settings keep working.
 */
function contributions(palette: Palette): IconThemeContribution[] {
	const id = palette.id === 'default' ? 'sharp-icons' : `sharp-icons_${palette.id}`;
	const label = `Sharp Icons - ${palette.label}`;
	return [
		{ id, label, path: `./dist/${palette.id}/${THEME_FILE}` },
		{ id: `${id}_folderless`, label: `${label} - No Folders`, path: `./dist/${palette.id}/${FOLDERLESS_THEME_FILE}` },
	];
}

/**
 * Brings `contributes.iconThemes` in package.json in line with the palettes.
 * Returns whether the manifest was out of date. Only writes when `write` is set.
 */
export async function syncManifest({ write }: { write: boolean; }): Promise<boolean> {
	const file = Bun.file(PACKAGE_JSON);
	const original = await file.text();
	const pkg = JSON.parse(original);

	pkg.contributes ??= {};
	pkg.contributes.iconThemes = palettes.flatMap(contributions);

	const updated = JSON.stringify(pkg, null, '\t') + '\n';
	const stale = updated !== original;
	if (stale && write) await Bun.write(file, updated);
	return stale;
}
