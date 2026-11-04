import { basePalette, palettes } from '../config/palettes.ts';
import { colorsIn } from './svg.ts';
import type { ThemeBuild } from './theme.ts';

export interface Report {
	errors: string[];
	warnings: string[];
}

const HEX = /^#[0-9A-F]{6}$/;
const SVG_ROOT = /<svg\b[^>]*\bwidth="16"[^>]*\bheight="16"[^>]*\bviewBox="0 0 16 16"/;

export function validate(build: ThemeBuild, icons: Map<string, string>): Report {
	const errors: string[] = [];
	const warnings: string[] = [];

	// Palettes
	const ids = new Set<string>();
	for (const palette of palettes) {
		if (ids.has(palette.id)) errors.push(`palette "${palette.id}" is defined twice`);
		ids.add(palette.id);
		for (const [slot, color] of Object.entries(palette.colors)) {
			if (!HEX.test(color)) errors.push(`palette "${palette.id}" has invalid ${slot} color "${color}"`);
		}
	}
	const baseColors = new Set(Object.values(basePalette.colors));
	if (baseColors.size !== Object.keys(basePalette.colors).length) {
		errors.push(`palette "${basePalette.id}" must use a distinct color per slot so other palettes can be mapped from it`);
	}

	// Assignments
	for (const { kind, key, icons: [a, b] } of build.conflicts) {
		errors.push(`${kind} "${key}" is assigned to both "${a}" and "${b}"`);
	}
	for (const { kind, key, icons: [icon] } of build.duplicates) {
		warnings.push(`${kind} "${key}" is listed more than once for "${icon}"`);
	}
	for (const [kind, map] of Object.entries({ fileExtensions: build.theme.fileExtensions, fileNames: build.theme.fileNames })) {
		for (const key of Object.keys(map)) {
			if (kind === 'fileExtensions' && key.startsWith('.')) errors.push(`extension "${key}" should not start with a dot`);
			if (/\s|[*?/\\]/.test(key)) errors.push(`${kind} "${key}" contains whitespace, a wildcard, or a path separator`);
		}
	}

	// Icons
	for (const icon of build.usedIcons) {
		if (!icons.has(icon)) errors.push(`icon "${icon}" is assigned but icons/${icon}.svg does not exist`);
	}
	for (const [icon, svg] of icons) {
		if (!build.usedIcons.has(icon)) warnings.push(`icons/${icon}.svg is not assigned to anything`);
		if (!SVG_ROOT.test(svg)) warnings.push(`icons/${icon}.svg is not a 16x16 SVG with a "0 0 16 16" viewBox`);

		const offPalette = [...colorsIn(svg)].filter((c) => !baseColors.has(c));
		if (offPalette.length) {
			warnings.push(`icons/${icon}.svg uses colors outside the palette (won't be recolored): ${offPalette.join(', ')}`);
		}
	}

	return { errors, warnings };
}

export function printReport({ errors, warnings }: Report): void {
	for (const w of warnings) console.warn(`  \x1b[33mwarn\x1b[0m  ${w}`);
	for (const e of errors) console.error(`  \x1b[31merror\x1b[0m ${e}`);
}
