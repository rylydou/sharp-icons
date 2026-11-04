import { basename } from 'node:path';
import { basePalette, SLOTS, type Palette } from '../config/palettes.ts';
import { ICONS_DIR } from './paths.ts';

/** Loads every source SVG, keyed by name (file name without `.svg`), sorted by name. */
export async function loadIcons(): Promise<Map<string, string>> {
	const paths = await Array.fromAsync(new Bun.Glob('*.svg').scan({ cwd: ICONS_DIR, absolute: true }));
	paths.sort();

	const entries = await Promise.all(
		paths.map(async (path) => [basename(path, '.svg'), await Bun.file(path).text()] as const),
	);
	return new Map(entries);
}

const HEX_COLOR = /#[0-9a-f]{6}\b/gi;

/** All distinct 6-digit hex colors used in an SVG, uppercased. */
export function colorsIn(svg: string): Set<string> {
	return new Set(Array.from(svg.matchAll(HEX_COLOR), (m) => m[0].toUpperCase()));
}

/** Returns a function that swaps base-palette colors for `palette`'s colors in a single pass. */
export function recolorer(palette: Palette): (svg: string) => string {
	if (palette === basePalette) return (svg) => svg;

	const swaps = new Map(SLOTS.map((slot) => [basePalette.colors[slot], palette.colors[slot]]));
	return (svg) => svg.replace(HEX_COLOR, (hex) => swaps.get(hex.toUpperCase()) ?? hex);
}
