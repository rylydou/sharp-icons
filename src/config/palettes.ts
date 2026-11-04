/**
 * Color palettes. Source SVGs in `icons/` are drawn with the `default` palette;
 * every other palette is produced by swapping each default color for the color
 * in the same slot.
 *
 * Order matters: it's the order themes appear in VS Code's theme picker.
 * The `id` is part of the public theme ID (`sharp-icons_<id>`), so never rename
 * an existing one or users' `workbench.iconTheme` settings will break.
 */

export const SLOTS = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'light', 'dark'] as const;
export type Slot = (typeof SLOTS)[number];
type AsStrings<T extends readonly unknown[]> = { [K in keyof T]: string };
type Colors = AsStrings<typeof SLOTS>;

export interface Palette {
	id: string;
	label: string;
	colors: Record<Slot, string>;
}

function palette(id: string, label: string, colors: Colors): Palette {
	return {
		id,
		label,
		colors: Object.fromEntries(SLOTS.map((slot, i) => [slot, colors[i]!.toUpperCase()])) as Record<Slot, string>,
	};
}

export const palettes: Palette[] = [
	// red, orange, yellow, green, blue, purple, light, dark
	palette('default', 'Default', ['#FF5252', '#EF652F', '#FFCC4A', '#8BC34A', '#42A5F5', '#A56FFF', '#A3B2BF', '#6C7780']),
	palette('monochrome', 'Monochrome', ['#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080', '#808080']),
	palette('solarized', 'Solarized', ['#DC322F', '#CB4B16', '#B58900', '#859900', '#268BD2', '#6C71C4', '#839496', '#657B83']),
	palette('monokai', 'Monokai', ['#F92672', '#FD971F', '#E6DB74', '#A6E22E', '#66D9EF', '#AE81FF', '#F8F8F2', '#75715E']),
	palette('monokai_pro', 'Monokai Pro', ['#FF6188', '#FC9867', '#FFD866', '#A9DC76', '#78DCE8', '#AB9DF2', '#FDF9F3', '#908E8F']),
	palette('gruvbox', 'Gruvbox', ['#CC241D', '#D65D0E', '#D79921', '#98971A', '#458588', '#B16286', '#FBF1C7', '#928374']),
	palette('gruvbox_faded', 'Gruvbox Faded', ['#9D0006', '#AF3A03', '#B57614', '#79740E', '#427B58', '#8F3F71', '#FBF1C7', '#928374']),
	palette('gruvbox_bright', 'Gruvbox Bright', ['#FB4934', '#FE8019', '#FABD2F', '#B8BB26', '#83A598', '#D3869B', '#FBF1C7', '#928374']),
	palette('adwaita', 'Adwaita', ['#E01B24', '#FF7800', '#F6D32D', '#33D17A', '#3584E4', '#9141AC', '#9A9996', '#77767B']),
	palette('ios_light', 'iOS Light', ['#FF3B30', '#FF9500', '#FFCC00', '#34C759', '#007AFF', '#AF52DE', '#8E8E93', '#48484A']),
	palette('ios_dark', 'iOS Dark', ['#FF453A', '#FF9F0A', '#FFD60A', '#30D158', '#0A84FF', '#BF5AF2', '#8E8E93', '#48484A']),
	palette('zughy', 'Zughy', ['#E6482E', '#F47E1B', '#F4B41B', '#B6D53C', '#28CCDF', '#BF5AF2', '#827094', '#4F546B']),
];

export const basePalette = palettes[0]!;
