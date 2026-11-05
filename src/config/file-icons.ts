/**
 * File icon assignments. Each key is the name of an SVG in `icons/`.
 *
 * VS Code resolves a file's icon in this order:
 *   1. `fileNames`   — exact base name, e.g. `package-lock.json`
 *   2. `extensions`  — longest matching extension, e.g. `stories.tsx` before `tsx`
 *   3. `languageIds` — the language VS Code (or an extension) detected
 *
 * Matching is case-insensitive. Each name/extension/language may only be
 * assigned once; the build fails on conflicts.
 */

export interface FileIconRule {
	extensions?: string[];
	fileNames?: string[];
	languageIds?: string[];
}

/** Every combination of `names` × `exts`, where `''` means "no extension". */
const variants = (names: string[], exts: string[]) =>
	names.flatMap((name) => exts.map((ext) => (ext ? `${name}.${ext}` : name)));

const DOC_EXTS = ['', 'txt', 'md', 'rst', 'adoc', 'markdown'];

export const fileIcons = {
	// --- Documents & media ---------------------------------------------------
	plaintext: {
		extensions: ['txt', 'text', 'nfo', 'tres', 'gdns'],
		languageIds: ['plaintext', 'godot-resource'],
	},
	richtext: {
		extensions: [
			'rtf', 'pdf', 'doc', 'docx', 'odt', 'sxw', 'gdoc', 'pages', 'epub',
			'xls', 'xlsx', 'ods', 'numbers', 'ppt', 'pptx', 'odp',
		],
	},
	log: {
		extensions: ['log'],
		languageIds: ['log'],
	},
	image: {
		extensions: [
			'png', 'apng', 'jpg', 'jpeg', 'jpe', 'jfif', 'pjpeg', 'pjp', 'gif', 'webp', 'avif', 'jxl',
			'heic', 'heif', 'bmp', 'ico', 'icns', 'cur', 'tif', 'tiff', 'tga', 'dds', 'exr', 'hdr', 'qoi',
			'psd', 'psb', 'xcf', 'kra', 'ora', 'pbm', 'pgm', 'ppm', 'pnm', 'raw', 'dng', 'cr2', 'cr3', 'nef', 'arw',
		],
	},
	svg: {
		extensions: ['svg', 'svgz'],
	},
	audio: {
		extensions: [
			'mp3', 'wav', 'ogg', 'oga', 'opus', 'flac', 'alac', 'aac', 'm4a', 'wma', 'aif', 'aiff', 'aifc',
			'mka', 'weba', 'ape', 'wv', 'mid', 'midi', 'bank', 'strings.bank',
		],
	},
	video: {
		extensions: ['mp4', 'm4v', 'mkv', 'webm', 'mov', 'avi', 'wmv', 'flv', 'mpg', 'mpeg', 'ogv', '3gp', 'm2ts', 'vob'],
	},
	model: {
		extensions: [
			'blend', 'block', 'c4d', 'stl', 'obj', 'fbx', 'gltf', 'glb', 'dae', '3ds', 'ply', '3mf',
			'usd', 'usda', 'usdc', 'usdz', 'max', 'ma', 'mb', 'vox', 'x3d', '3d-objects', 'x3d-object',
			'tscn', 'escn',
		],
	},
	font: {
		extensions: ['ttf', 'ttc', 'otf', 'woff', 'woff2', 'eot', 'fnt', 'bdf'],
	},
	aseprite: {
		extensions: ['ase', 'aseprite'],
	},
	icon: {
		fileNames: [
			...variants(['favicon'], ['ico', 'png', 'svg', 'gif', 'webp', 'avif']),
			...variants(['apple-touch-icon'], ['png']),
		],
	},

	// --- Binaries & archives -------------------------------------------------
	archive: {
		extensions: [
			'zip', '7z', 'rar', '001', 'cab', 'iso', 'img', 'tar', 'gz', 'tgz', 'bz2', 'tbz', 'tbz2',
			'xz', 'txz', 'lz', 'lzma', 'lz4', 'zst', 'tzst', 'br', 'z', 'taz', 'lzh', 'lza', 'cpio',
			'barchive2', 'tvz', 'tvz2', 'garchive', 'tpz', 'arj', 'rpm', 'deb', 'vhd', 'vhdx', 'wim',
			'swm', 'fat', 'ntfs', 'dmg', 'hfs', 'xar', 'squashfs', 'vsix', 'pck', 'crate', 'whl', 'nupkg',
		],
	},
	object: {
		extensions: ['o', 'a', 'lib', 'so', 'dll', 'dylib', 'elf', 'bundle', 'jar', 'class', 'pyc', 'pyd', 'rlib', 'beam', 'node'],
	},
	bin: {
		extensions: ['bin', 'dat', 'hex', 'rom'],
	},
	app: {
		extensions: ['exe', 'app', 'msi', 'msix', 'appx', 'appimage', 'apk', 'aab', 'ipa', 'xapk'],
	},
	debug: {
		extensions: ['pdb', 'js.map', 'mjs.map', 'cjs.map', 'css.map'],
	},

	// --- Tooling & config ----------------------------------------------------
	script: {
		extensions: ['sh', 'bash', 'zsh', 'fish', 'ksh', 'csh', 'tcsh', 'nu', 'command', 'bat', 'cmd', 'ps1', 'psm1', 'psd1', 'gradle'],
		fileNames: [
			'gradlew', '.bashrc', '.bash_profile', '.bash_aliases', '.bash_logout', '.profile',
			'.zshrc', '.zshenv', '.zprofile', '.zlogin', '.zlogout', '.envrc',
		],
		languageIds: ['shellscript', 'bat', 'powershell', 'fish', 'nushell'],
	},
	lock: {
		extensions: ['lockb', 'pem', 'crt', 'cer', 'der', 'csr', 'key', 'p12', 'pfx', 'gpg', 'pgp', 'asc', 'sig'],
		fileNames: [
			'package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lock', 'bun.lockb', 'deno.lock',
			'cargo.lock', 'go.sum', 'go.work.sum', 'gemfile.lock', 'composer.lock', 'poetry.lock', 'pipfile.lock', 'uv.lock',
			'pdm.lock', 'mix.lock', 'pubspec.lock', 'podfile.lock', 'package.resolved', 'flake.lock', 'gradle.lockfile',
			'packages.lock.json', '.terraform.lock.hcl',
			'known_hosts', 'authorized_keys',
		],
		languageIds: ['go.sum'],
	},
	config: {
		extensions: ['ini', 'cfg', 'conf', 'env', 'properties', 'import', 'gdnlib', 'tet', 'remap', 'reg'],
		fileNames: [
			...variants(['.env'], ['', 'local', 'example', 'sample', 'template', 'development', 'production', 'test']),
			...variants(['.env.development', '.env.production', '.env.test'], ['local']),
			'.editorconfig', '.npmrc', '.yarnrc', '.nvmrc', '.node-version', '.python-version', '.ruby-version',
			'.tool-versions', '.browserslistrc', '.prettierrc', '.eslintrc', '.stylelintrc', '.babelrc', '.swcrc',
			'.clang-format', '.clang-tidy', '.clangd', '.flake8', '.pylintrc', '.htaccess',
			'.ignore', '.npmignore', '.vscodeignore', '.prettierignore', '.eslintignore', '.stylelintignore', '.rgignore', '.fdignore',
		],
		languageIds: ['ini', 'properties', 'dotenv', 'editorconfig', 'ignore', 'gdresource', 'godot-asset'],
	},
	tools: {
		extensions: ['cmake', 'mk', 'mak', 'just', 'bazel', 'bzl', 'ninja'],
		fileNames: [
			'makefile', 'gnumakefile', 'cmakelists.txt', 'justfile', '.justfile', 'meson.build', 'meson_options.txt',
			'build.bazel', 'workspace.bazel', 'module.bazel',
		],
		languageIds: ['makefile', 'cmake', 'just', 'meson', 'starlark'],
	},
	docker: {
		extensions: ['dockerfile', 'containerfile'],
		fileNames: [
			'dockerfile', 'containerfile', '.dockerignore',
			...variants(['docker-compose', 'docker-compose.override', 'compose', 'compose.override'], ['yml', 'yaml']),
		],
		languageIds: ['dockerfile', 'dockercompose'],
	},
	git: {
		fileNames: ['.gitignore', '.gitattributes', '.gitmodules', '.gitkeep', '.git-blame-ignore-revs', '.mailmap'],
		languageIds: ['git-commit', 'git-rebase', 'gitignore', 'gitattributes', 'gitmodules', 'scminput'],
	},
	diff: {
		extensions: ['diff', 'patch', 'rej'],
		languageIds: ['diff'],
	},
	robot: {
		fileNames: [
			'robots.txt', 'llms.txt', 'llms-full.txt',
			'agents.md', 'claude.md', 'claude.local.md', 'gemini.md', 'copilot-instructions.md',
			'.cursorrules', '.windsurfrules',
		],
	},

	// --- Repo docs -----------------------------------------------------------
	readme: {
		fileNames: variants(['readme'], DOC_EXTS),
	},
	info: {
		fileNames: [
			...variants([
				'changelog', 'changes', 'history', 'news', 'releases', 'contributing', 'contributors', 'authors',
				'maintainers', 'credits', 'acknowledgments', 'support', 'security', 'code_of_conduct', 'governance',
				'install', 'building', 'notice', 'eula', 'issue_template', 'pull_request_template',
				'pull-request-template', 'codeowners',
			], DOC_EXTS),
			'humans.txt',
		],
	},
	license: {
		fileNames: [
			...variants(['license', 'licence', 'copying', 'copyright', 'unlicense', 'patents'], DOC_EXTS),
			'id_rsa', 'id_ecdsa', 'id_ed25519',
		],
	},
	todo: {
		fileNames: variants(['todo', 'tasks', 'plans'], DOC_EXTS),
	},

	// --- Data & markup -------------------------------------------------------
	json: {
		extensions: ['json', 'jsonc', 'json5', 'jsonl', 'ndjson', 'geojson', 'topojson', 'webmanifest', 'har', 'code-workspace'],
		languageIds: ['json', 'jsonc', 'json5', 'jsonl', 'snippets'],
	},
	xml: {
		extensions: [
			'xml', 'xsd', 'xsl', 'xslt', 'wsdl', 'rss', 'atom', 'plist', 'xaml', 'axml', 'resx', 'nuspec',
			'csproj', 'fsproj', 'vbproj', 'vcxproj', 'props', 'targets', 'iml', 'xlf', 'xliff', 'kml', 'gpx',
		],
		fileNames: ['app.manifest'],
		languageIds: ['xml', 'xsl'],
	},
	yaml: {
		extensions: ['yaml', 'yml'],
		languageIds: ['yaml', 'github-actions-workflow'],
	},
	toml: {
		extensions: ['toml'],
		fileNames: ['pipfile'],
		languageIds: ['toml'],
	},
	csv: {
		extensions: ['csv', 'tsv', 'psv'],
		languageIds: ['csv', 'tsv'],
	},
	markdown: {
		extensions: ['md', 'markdown', 'mdown', 'mkd', 'mkdn', 'mdwn', 'qmd'],
		languageIds: ['markdown', 'quarto'],
	},
	mdx: {
		extensions: ['mdx'],
		languageIds: ['mdx'],
	},
	meml: {
		extensions: ['meml'],
		languageIds: ['meml'],
	},
	hxml: {
		extensions: ['hxml'],
		languageIds: ['hxml'],
	},
	database: {
		extensions: [
			'db', 'db3', 'sqlite', 'sqlite3', 'libsql', 'mdb', 'accdb', 'rdb',
			'sql', 'ddl', 'dml', 'pg', 'pgsql', 'psql', 'postgres', 'mysql', 'cql', 'dbml',
			'prisma', 'graphql', 'graphqls', 'gql', 'http', 'rest',
		],
		languageIds: ['sql', 'pgsql', 'plsql', 'mysql', 'prisma', 'graphql', 'http'],
	},

	// --- Web -----------------------------------------------------------------
	html: {
		extensions: ['html', 'htm', 'shtml', 'ejs', 'hbs', 'handlebars', 'mustache', 'njk', 'twig'],
		languageIds: ['html', 'handlebars', 'nunjucks', 'twig'],
	},
	xhtml: {
		extensions: ['xhtml', 'xht'],
	},
	css: {
		extensions: ['css', 'pcss', 'postcss'],
		languageIds: ['css', 'postcss'],
	},
	scss: {
		extensions: ['scss', 'sass'],
		languageIds: ['scss', 'sass'],
	},
	less: {
		extensions: ['less'],
		languageIds: ['less'],
	},
	javascript: {
		extensions: ['js', 'mjs', 'cjs'],
		languageIds: ['javascript'],
	},
	typescript: {
		extensions: ['ts', 'mts', 'cts'],
		languageIds: ['typescript'],
	},
	jsx: {
		extensions: ['jsx'],
		languageIds: ['javascriptreact'],
	},
	tsx: {
		extensions: ['tsx'],
		languageIds: ['typescriptreact'],
	},
	webassembly: {
		extensions: ['wasm', 'wat', 'wast'],
		languageIds: ['webassembly', 'wat'],
	},
	vue: {
		extensions: ['vue'],
		languageIds: ['vue'],
	},
	nuxt: {
		extensions: ['nuxt'],
		fileNames: variants(['nuxt.config'], ['js', 'mjs', 'ts', 'mts']),
		languageIds: ['nuxt'],
	},
	svelte: {
		extensions: ['svelte'],
		fileNames: variants(['svelte.config'], ['js', 'mjs', 'ts']),
		languageIds: ['svelte'],
	},
	angular: {
		extensions: ['angular', 'component.html', 'component.js', 'component.ts'],
		fileNames: ['angular.json', '.angular-cli.json'],
		languageIds: ['angular'],
	},
	storybook: {
		extensions: variants(['stories', 'story'], ['js', 'jsx', 'mjs', 'ts', 'tsx', 'mdx', 'svelte', 'vue']),
	},
	liquid: {
		extensions: ['liquid'],
		languageIds: ['liquid'],
	},
	liquid_css: {
		extensions: ['css.liquid'],
	},
	liquid_scss: {
		extensions: ['scss.liquid', 'sass.liquid'],
	},
	liquid_js: {
		extensions: ['js.liquid'],
	},
	liquid_ts: {
		extensions: ['ts.liquid'],
	},
	php: {
		extensions: ['php', 'phtml', 'phps', 'php3', 'php4', 'php5', 'phar'],
		languageIds: ['php'],
	},
	cshtml: {
		extensions: ['cshtml', 'razor'],
		languageIds: ['razor', 'aspnetcorerazor'],
	},

	// --- Systems languages ---------------------------------------------------
	assembly: {
		extensions: ['asm', 's', 'nasm', 'a51'],
		languageIds: ['asm', 'nasm', 'arm', 'riscv', 'm'],
	},
	c: {
		extensions: ['c', 'i'],
		languageIds: ['c'],
	},
	h: {
		extensions: ['h'],
	},
	cpp: {
		extensions: ['cpp', 'cc', 'cxx', 'c++', 'cp', 'cppm', 'ixx', 'ino'],
		languageIds: ['cpp', 'cuda-cpp'],
	},
	hpp: {
		extensions: ['hpp', 'hh', 'hxx', 'h++', 'hp', 'inl', 'ipp', 'tpp', 'txx'],
	},
	rust: {
		extensions: ['rs'],
		languageIds: ['rust'],
	},
	go: {
		extensions: ['go'],
		fileNames: ['go.mod', 'go.work'],
		languageIds: ['go', 'go.mod', 'go.work'],
	},
	odin: {
		extensions: ['odin'],
		languageIds: ['odin'],
	},
	swift: {
		extensions: ['swift'],
		languageIds: ['swift'],
	},
	gleam: {
		extensions: ['gleam'],
		languageIds: ['gleam'],
	},
	nix: {
		extensions: ['nix'],
		languageIds: ['nix'],
	},

	// --- .NET / JVM ----------------------------------------------------------
	csharp: {
		extensions: ['cs', 'csx'],
		languageIds: ['csharp'],
	},
	fsharp: {
		extensions: ['fs', 'fsi', 'fsx', 'fsscript'],
		languageIds: ['fsharp'],
	},
	java: {
		extensions: ['java'],
		languageIds: ['java'],
	},
	kotlin: {
		extensions: ['kt', 'kts', 'ktm', 'kotlin'],
		languageIds: ['kotlin'],
	},
	scala: {
		extensions: ['scala', 'sc', 'sbt'],
		languageIds: ['scala'],
	},

	// --- Scripting languages -------------------------------------------------
	python: {
		extensions: ['py', 'pyi', 'pyw', 'pyx', 'pxd', 'ipynb'],
		languageIds: ['python', 'cython'],
	},
	ruby: {
		extensions: ['rb', 'rake', 'gemspec', 'ru', 'erb'],
		fileNames: ['gemfile', 'rakefile', 'guardfile', 'podfile', 'fastfile', 'brewfile', 'vagrantfile', '.irbrc', '.pryrc'],
		languageIds: ['ruby', 'erb'],
	},
	lua: {
		extensions: ['lua', 'luau', 'rockspec'],
		languageIds: ['lua', 'luau'],
	},
	perl: {
		extensions: ['pl', 'pm', 'pod', 'psgi'],
		languageIds: ['perl'],
	},
	r: {
		extensions: ['r', 'rmd', 'rds', 'rdata', 'rproj'],
		fileNames: ['.rprofile', '.rhistory'],
		languageIds: ['r', 'rmd'],
	},
	julia: {
		extensions: ['jl'],
		languageIds: ['julia', 'juliamarkdown'],
	},
	elixir: {
		extensions: ['ex', 'exs', 'eex', 'heex', 'leex'],
		languageIds: ['elixir', 'eex', 'html-eex', 'phoenix-heex'],
	},
	haskell: {
		extensions: ['hs', 'lhs', 'hsc', 'cabal'],
		languageIds: ['haskell', 'cabal'],
	},
	dart: {
		extensions: ['dart'],
		languageIds: ['dart'],
	},
	haxe: {
		extensions: ['hx'],
		languageIds: ['haxe'],
	},
	solidity: {
		extensions: ['sol'],
		languageIds: ['solidity'],
	},

	// --- Game dev & graphics -------------------------------------------------
	godot: {
		extensions: ['gd', 'godot', 'gdignore'],
		languageIds: ['gdscript', 'godot-project'],
	},
	shader: {
		extensions: [
			'glsl', 'essl', 'hlsl', 'hlsli', 'fx', 'fxh', 'cg', 'cginc', 'shader', 'wgsl', 'metal', 'slang',
			'usf', 'ush', 'sf', 'tesc', 'tese', 'rgen', 'rchit', 'rahit', 'rmiss', 'rint', 'rcall',
			'gdshader', 'gdshaderinc',
		],
		languageIds: ['glsl', 'hlsl', 'cg', 'wgsl', 'metal', 'slang', 'shaderlab', 'gdshader', 'godot-shader'],
	},
	shader_vertex: {
		extensions: ['vert', 'vs', 'vsh', 'glslv'],
	},
	shader_fragment: {
		extensions: ['frag', 'fsh', 'glslf'],
	},
	shader_geometry: {
		extensions: ['geom', 'gs', 'gsh', 'glslg'],
	},
	shader_compute: {
		extensions: ['comp', 'compute'],
	},
	spv: {
		extensions: ['spv', 'spirv'],
	},
} satisfies Record<string, FileIconRule>;

export type FileIconName = keyof typeof fileIcons;
