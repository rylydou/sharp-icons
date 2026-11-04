/**
 * Packages the extension and publishes it to the VS Marketplace and Open VSX.
 *
 *   bun run package                     build + bin/sharp-icons-<version>.vsix
 *   bun run dogfood                     package, then install into your local VS Code
 *   bun run publish                     package, then publish to every target (GitHub Actions only)
 *   bun run publish --target openvsx    publish to one target only (vscode | openvsx)
 *   bun run publish --dry-run           package and print what would be published (works anywhere)
 *
 * Publishing uses trusted publishing (OIDC) instead of stored tokens: the
 * Release workflow's GitHub OIDC token is exchanged for a short-lived publish
 * credential by each marketplace. That only works inside a GitHub Actions job
 * with `permissions: id-token: write` whose repo/workflow match the trusted
 * publisher registered on each marketplace (see CONTRIBUTING.md).
 */
import { cp, mkdir, rm } from 'node:fs/promises';
import { delimiter, join } from 'node:path';
import { parseArgs } from 'node:util';
import { $ } from 'bun';
import { OUT_DIR, PACKAGE_JSON, ROOT } from './lib/paths.ts';

const manifest = await Bun.file(PACKAGE_JSON).json();

/**
 * Each marketplace identifies the extension as `<publisher>.<name>`, and the
 * publisher is baked into the VSIX. The extension is listed under different
 * publishers on each marketplace, so each target gets its own VSIX.
 */
const TARGETS = {
	vscode: {
		name: 'VS Marketplace',
		publisher: manifest.publisher as string, // marketplace.visualstudio.com/items?itemName=CiberTurtle.sharp-icons
		publish: (vsix: string) => $`vsce publish --packagePath ${vsix} --skip-duplicate --oidc`,
	},
	openvsx: {
		name: 'Open VSX',
		publisher: 'rylydou', // open-vsx.org/extension/rylydou/sharp-icons
		publish: (vsix: string) => $`ovsx publish ${vsix} --skip-duplicate --trusted-publishing`,
	},
};
type Target = keyof typeof TARGETS;

const { values: args, positionals } = parseArgs({
	args: Bun.argv.slice(2),
	allowPositionals: true,
	options: {
		target: { type: 'string', multiple: true },
		'dry-run': { type: 'boolean', default: false },
		'allow-dirty': { type: 'boolean', default: false },
	},
});

const COMMANDS = ['package', 'dogfood', 'publish'];
const command = positionals[0] ?? 'package';
if (!COMMANDS.includes(command)) {
	console.error(`unknown command "${command}" (expected ${COMMANDS.join(', ')})`);
	process.exit(1);
}

const targets = (args.target ?? (command === 'publish' ? Object.keys(TARGETS) : ['vscode'])) as Target[];
const unknown = targets.filter((t) => !(t in TARGETS));
if (unknown.length) {
	console.error(`unknown target(s): ${unknown.join(', ')} (expected ${Object.keys(TARGETS).join(', ')})`);
	process.exit(1);
}

$.cwd(ROOT);
// Never pass long-lived tokens through: vsce refuses `--oidc` alongside VSCE_PAT,
// and ovsx silently prefers OVSX_PAT over trusted publishing.
const { VSCE_PAT, OVSX_PAT, ...env } = Bun.env;
$.env({ ...env, PATH: [join(ROOT, 'node_modules', '.bin'), Bun.env.PATH].join(delimiter) });

if (command === 'publish' && !args['dry-run']) {
	if (!args['allow-dirty']) {
		const dirty = (await $`git status --porcelain`.text()).trim();
		if (dirty) {
			console.error(`refusing to publish with uncommitted changes (pass --allow-dirty to override):\n${dirty}`);
			process.exit(1);
		}
	}
	if (!Bun.env.ACTIONS_ID_TOKEN_REQUEST_URL || !Bun.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN) {
		console.error(
			'publishing uses trusted publishing, which needs a GitHub Actions OIDC token.\n' +
			'Push a version tag to run the Release workflow, or use --dry-run to test packaging locally.\n' +
			'(In a workflow, the job needs `permissions: id-token: write`.)',
		);
		process.exit(1);
	}
}

/**
 * Packages a VSIX for `publisher` from a staging copy of the shipped files, so
 * package.json in the repo is never modified.
 */
async function packageFor(publisher: string): Promise<string> {
	const suffix = publisher === manifest.publisher ? '' : `-${publisher}`;
	const vsix = join(OUT_DIR, `${manifest.name}-${manifest.version}${suffix}.vsix`);
	const stage = join(OUT_DIR, 'stage', publisher);

	await rm(stage, { recursive: true, force: true });
	await Promise.all((manifest.files as string[]).map((file) => cp(join(ROOT, file), join(stage, file), { recursive: true })));
	const { scripts, devDependencies, ...shipped } = await Bun.file(PACKAGE_JSON).json();
	await Bun.write(join(stage, 'package.json'), JSON.stringify({ ...shipped, publisher }, null, '\t'));

	await $`vsce package --no-dependencies --out ${vsix}`.cwd(stage).quiet();
	console.log(`packaged ${vsix} (${(Bun.file(vsix).size / 1024).toFixed(0)} KiB)`);
	return vsix;
}

await $`${process.execPath} src/build.ts`;
await mkdir(OUT_DIR, { recursive: true });

const vsixByPublisher = new Map<string, string>();
for (const target of targets) {
	const { publisher } = TARGETS[target];
	if (!vsixByPublisher.has(publisher)) vsixByPublisher.set(publisher, await packageFor(publisher));
}
await rm(join(OUT_DIR, 'stage'), { recursive: true, force: true });
const vsixFor = (target: Target) => vsixByPublisher.get(TARGETS[target].publisher)!;

if (command === 'package') process.exit(0);
if (command === 'dogfood') {
	await $`code --install-extension ${vsixFor(targets[0]!)} --force`;
	process.exit(0);
}

let failed = false;
for (const target of targets) {
	const { name, publisher } = TARGETS[target];
	const id = `${publisher}.${manifest.name}@${manifest.version}`;
	if (args['dry-run']) {
		console.log(`[dry run] would publish ${id} to ${name}`);
		continue;
	}
	console.log(`\npublishing ${id} to ${name}...`);
	const result = await TARGETS[target].publish(vsixFor(target)).nothrow();
	if (result.exitCode !== 0) {
		failed = true;
		console.error(`failed to publish to ${name} (exit ${result.exitCode})`);
	}
}
process.exit(failed ? 1 : 0);
