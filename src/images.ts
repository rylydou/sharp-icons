/**
 * Regenerates the README images in images/readme/.
 *
 *   bun run images
 *
 * Output is deterministic (seeded shuffle), so re-running only changes the
 * images when the icons themselves change.
 */
import { join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { IMAGES_DIR, ROOT } from './lib/paths.ts';
import { loadIcons } from './lib/svg.ts';
import { buildTheme } from './lib/theme.ts';

const README_DIR = join(IMAGES_DIR, 'readme');
const ICON = 16;
const CELL = 32;

const { usedIcons } = buildTheme();
const icons = [...(await loadIcons())].filter(([name]) => usedIcons.has(name));

function svgDocument(width: number, height: number, body: string[]): string {
	return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${body.join('')}</svg>`;
}

/** Places an icon's <svg> at (x, y), namespacing its IDs so icons can't clobber each other's defs. */
function placeIcon(svg: string, x: number, y: number, n: number): string {
	const prefix = `i${n}_`;
	return svg
		.replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
		.replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
		.replace(/<svg\b/, `<svg x="${x}" y="${y}"`);
}

/** Rasterizes an SVG to PNG. `scale` renders the vector larger rather than upscaling a bitmap. */
function render(svg: string, { scale = 1, background }: { scale?: number; background?: string; } = {}): Buffer {
	return new Resvg(svg, {
		fitTo: { mode: 'zoom', value: scale },
		background,
		// Use a pinned font instead of system fonts so the output is identical on every machine.
		font: {
			loadSystemFonts: false,
			fontFiles: [join(ROOT, 'node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf')],
			defaultFontFamily: 'DejaVu Sans',
			sansSerifFamily: 'DejaVu Sans',
		},
	})
		.render()
		.asPng();
}

/** Deterministic PRNG (mulberry32). */
function random(seed: number): () => number {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function shuffle<T>(items: T[], rand: () => number): T[] {
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[items[i], items[j]] = [items[j]!, items[i]!];
	}
	return items;
}

interface Rect {
	x: number;
	y: number;
	width: number;
	height: number;
}

const intersects = (a: Rect, b: Rect) =>
	a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

/**
 * A grid of icons with the logo centered on top. Grid cells the logo would
 * overlap are left empty, so icons flow around the logo instead of under it.
 */
async function banner() {
	const cols = 14;
	const rows = 7;
	const padding = 9;
	const scale = 2;
	// images/logo.png is 512x124 with no transparent margin, drawn at 2x.
	const logoSize = { width: 256, height: 62 };
	// Minimum space between the logo and any icon. Icons are CELL - ICON apart
	// from each other, so this matches the gap elsewhere in the grid.
	const clearance = CELL - ICON;

	const width = cols * CELL - (CELL - ICON) + padding * 2;
	const height = rows * CELL - (CELL - ICON) + padding * 2;
	const logo: Rect = { x: (width - logoSize.width) / 2, y: (height - logoSize.height) / 2, ...logoSize };
	const keepOut: Rect = {
		x: logo.x - clearance,
		y: logo.y - clearance,
		width: logo.width + clearance * 2,
		height: logo.height + clearance * 2,
	};

	const slots: Rect[] = [];
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const slot = { x: padding + col * CELL, y: padding + row * CELL, width: ICON, height: ICON };
			if (!intersects(slot, keepOut)) slots.push(slot);
		}
	}

	// Variants of the same icon look repetitive in the collage.
	const pool = shuffle(icons.filter(([name]) => !name.startsWith('liquid_')), random(0x54a29));
	// More icons than slots: show a random subset. Fewer: reuse evenly spaced icons.
	const extra = Math.max(0, slots.length - pool.length);
	const cells = shuffle(
		[...pool.slice(0, slots.length), ...Array.from({ length: extra }, (_, i) => pool[Math.floor((pool.length / extra) * i)]!)],
		random(0x54a29),
	);

	const logoPng = (await Bun.file(join(IMAGES_DIR, 'logo.png')).bytes()).toBase64();
	const body = [
		...slots.map((slot, i) => placeIcon(cells[i]![1], slot.x, slot.y, i)),
		`<image x="${logo.x}" y="${logo.y}" width="${logo.width}" height="${logo.height}" href="data:image/png;base64,${logoPng}"/>`,
	];

	await Bun.write(join(README_DIR, 'banner.png'), render(svgDocument(width, height, body), { scale }));
	console.log(`banner: ${slots.length} of ${rows * cols} cells used, showing ${Math.min(pool.length, slots.length)} of ${pool.length} icons`);
}

async function listing() {
	const cols = 4;
	const colWidth = 200;
	const margin = 16;
	const rows = Math.ceil(icons.length / cols);

	const width = cols * colWidth + margin * 2;
	const height = rows * CELL - (CELL - ICON) + margin * 2;
	const body = ['<style>text { font: bold 16px sans-serif; fill: white; }</style>'];

	// Fill column by column so names read top-to-bottom alphabetically.
	icons.forEach(([name, svg], i) => {
		const x = margin + Math.floor(i / rows) * colWidth;
		const y = margin + (i % rows) * CELL;
		body.push(placeIcon(svg, x, y, i), `<text x="${x + 24}" y="${y + 14}">${name.replaceAll('_', ' ')}</text>`);
	});

	await Bun.write(join(README_DIR, 'listing.png'), render(svgDocument(width, height, body), { background: 'black' }));
}

await Promise.all([banner(), listing()]);
console.log(`wrote banner.png and listing.png to images/readme/ (${icons.length} icons)`);
