import { join, resolve } from 'node:path';

export const ROOT = resolve(import.meta.dir, '../..');
export const ICONS_DIR = join(ROOT, 'icons');
export const DIST_DIR = join(ROOT, 'dist');
export const OUT_DIR = join(ROOT, 'bin');
export const IMAGES_DIR = join(ROOT, 'images');
export const PACKAGE_JSON = join(ROOT, 'package.json');
