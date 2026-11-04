/**
 * Builds every icon theme into dist/ and syncs package.json.
 *
 *   bun run build           build dist/ and update package.json
 *   bun run check           validate only; exits non-zero on errors or a stale package.json
 *   bun run build --strict  also treat warnings as errors
 */
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { palettes } from './config/palettes.ts';
import { FOLDERLESS_THEME_FILE, syncManifest, THEME_FILE } from './lib/manifest.ts';
import { DIST_DIR } from './lib/paths.ts';
import { loadIcons, recolorer } from './lib/svg.ts';
import { buildTheme } from './lib/theme.ts';
import { printReport, validate } from './lib/validate.ts';

const { values: args } = parseArgs({
	args: Bun.argv.slice(2),
	options: {
		check: { type: 'boolean', default: false },
		strict: { type: 'boolean', default: false },
	},
});

const start = performance.now();
const icons = await loadIcons();
const build = buildTheme();
const report = validate(build, icons);

console.log(
	`${icons.size} icons, ${Object.keys(build.theme.fileExtensions).length} extensions, ` +
	`${Object.keys(build.theme.fileNames).length} file names, ${Object.keys(build.theme.languageIds).length} languages, ` +
	`${Object.keys(build.theme.folderNames ?? {}).length} folders`,
);
printReport(report);

if (report.errors.length || (args.strict && report.warnings.length)) {
	console.error(`\nfailed with ${report.errors.length} error(s), ${report.warnings.length} warning(s)`);
	process.exit(1);
}

if (args.check) {
	if (await syncManifest({ write: false })) {
		console.error('\npackage.json `contributes.iconThemes` is out of date; run `bun run build`');
		process.exit(1);
	}
	console.log('check passed');
	process.exit(0);
}

// Only ship icons that are actually referenced.
const shipped = [...icons].filter(([name]) => build.usedIcons.has(name));
const themeJson = JSON.stringify(build.theme);
const folderlessJson = JSON.stringify(build.folderless);

await rm(DIST_DIR, { recursive: true, force: true });
await Promise.all(
	palettes.flatMap((palette) => {
		const dir = join(DIST_DIR, palette.id);
		const recolor = recolorer(palette);
		return [
			Bun.write(join(dir, THEME_FILE), themeJson),
			Bun.write(join(dir, FOLDERLESS_THEME_FILE), folderlessJson),
			...shipped.map(([name, svg]) => Bun.write(join(dir, 'icons', `${name}.svg`), recolor(svg))),
		];
	}),
);

if (await syncManifest({ write: true })) console.log('updated package.json');
console.log(`built ${palettes.length} palettes into dist/ in ${Math.round(performance.now() - start)}ms`);
