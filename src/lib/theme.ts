import { fileIcons, type FileIconRule } from '../config/file-icons.ts';
import { folderIcons, type FolderIconRule } from '../config/folder-icons.ts';

/** https://code.visualstudio.com/api/extension-guides/file-icon-theme */
export interface IconTheme {
	hidesExplorerArrows: boolean;
	iconDefinitions: Record<string, { iconPath: string; }>;
	file: string;
	folder?: string;
	folderExpanded?: string;
	rootFolder?: string;
	rootFolderExpanded?: string;
	folderNames?: Record<string, string>;
	folderNamesExpanded?: Record<string, string>;
	fileExtensions: Record<string, string>;
	fileNames: Record<string, string>;
	languageIds: Record<string, string>;
}

export type AssignmentKind = 'fileExtensions' | 'fileNames' | 'languageIds' | 'folderNames';

export interface Conflict {
	kind: AssignmentKind;
	key: string;
	icons: string[];
}

export interface ThemeBuild {
	/** Theme with folder icons. */
	theme: IconTheme;
	/** Same theme, but VS Code's default folders + explorer arrows. */
	folderless: IconTheme;
	/** Every icon name the themes reference. */
	usedIcons: Set<string>;
	/** Keys assigned to more than one icon. Later assignments win in the output. */
	conflicts: Conflict[];
	/** Keys listed more than once for the same icon (harmless, but noise). */
	duplicates: Conflict[];
}

const BUILTIN_ICONS = ['file', 'folder', 'folder_open', 'root', 'root_open'];

export function buildTheme(): ThemeBuild {
	const iconDefinitions: IconTheme['iconDefinitions'] = {};
	const usedIcons = new Set<string>();
	const define = (icon: string) => {
		usedIcons.add(icon);
		iconDefinitions[icon] = { iconPath: `./icons/${icon}.svg` };
		return icon;
	};
	BUILTIN_ICONS.forEach(define);

	const conflicts: Conflict[] = [];
	const duplicates: Conflict[] = [];
	const owners = new Map<string, string>(); // `${kind}:${key}` -> icon

	const assign = (target: Record<string, string>, kind: AssignmentKind, rawKey: string, icon: string) => {
		// VS Code matches names, extensions and folder names case-insensitively.
		const key = kind === 'languageIds' ? rawKey : rawKey.toLowerCase();
		const owner = owners.get(`${kind}:${key}`);
		if (owner === icon) duplicates.push({ kind, key, icons: [icon] });
		else if (owner) conflicts.push({ kind, key, icons: [owner, icon] });
		owners.set(`${kind}:${key}`, icon);
		target[key] = icon;
	};

	const fileExtensions: Record<string, string> = {};
	const fileNames: Record<string, string> = {};
	const languageIds: Record<string, string> = {};
	for (const [icon, rule] of Object.entries(fileIcons) as [string, FileIconRule][]) {
		define(icon);
		rule.extensions?.forEach((ext) => assign(fileExtensions, 'fileExtensions', ext, icon));
		rule.fileNames?.forEach((name) => assign(fileNames, 'fileNames', name, icon));
		rule.languageIds?.forEach((lang) => assign(languageIds, 'languageIds', lang, icon));
	}

	const folderNames: Record<string, string> = {};
	const folderNamesExpanded: Record<string, string> = {};
	for (const [icon, rule] of Object.entries(folderIcons) as [string, FolderIconRule][]) {
		define(icon);
		define(`${icon}_open`);
		for (const name of rule.folderNames) {
			assign(folderNames, 'folderNames', name, icon);
			folderNamesExpanded[name.toLowerCase()] = `${icon}_open`;
		}
	}

	const shared = { iconDefinitions, file: 'file', fileExtensions, fileNames, languageIds };
	const theme: IconTheme = {
		hidesExplorerArrows: true,
		folder: 'folder',
		folderExpanded: 'folder_open',
		rootFolder: 'root',
		rootFolderExpanded: 'root_open',
		folderNames,
		folderNamesExpanded,
		...shared,
	};
	const folderless: IconTheme = { hidesExplorerArrows: false, ...shared };

	return { theme, folderless, usedIcons, conflicts, duplicates };
}
