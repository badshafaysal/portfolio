/**
 * Local helper: resize/recompress new JPGs in public/images, emit a WebP sibling,
 * and emit small responsive WebP variants (-480, -800) used by the project cards.
 * Requires ImageMagick (`magick` v7 or `convert` v6).   npm run optimize-images
 * Re-runs are safe: only images missing a WebP or a variant are processed.
 */
import { execSync } from 'node:child_process';
import { readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dir = join(process.cwd(), 'public', 'images');
if (!existsSync(dir)) { console.error('No public/images folder'); process.exit(1); }

let im;
for (const c of ['magick', 'convert']) {
  try { execSync(`${c} -version`, { stdio: 'ignore' }); im = c; break; } catch {}
}
if (!im) { console.error('ImageMagick not found (need `magick` or `convert`).'); process.exit(1); }

const SIZES = [480, 800];
const isJpg = (f) => /\.jpe?g$/i.test(f);
const webpOf = (f) => f.replace(/\.jpe?g$/i, '.webp');
const variantOf = (f, w) => f.replace(/\.jpe?g$/i, `-${w}.webp`);

const todo = readdirSync(dir).filter((f) => {
  if (!isJpg(f)) return false;
  const src = join(dir, f);
  const webp = join(dir, webpOf(f));
  if (!existsSync(webp) || statSync(webp).mtimeMs < statSync(src).mtimeMs) return true;
  return SIZES.some((w) => !existsSync(join(dir, variantOf(f, w))));
});
if (!todo.length) { console.log('Nothing to optimize.'); process.exit(0); }

for (const f of todo) {
  const src = join(dir, f);
  const webp = join(dir, webpOf(f));
  console.log('Optimizing', f);
  // Recompress the JPG only when it is new/changed, so re-runs never degrade quality
  if (!existsSync(webp) || statSync(webp).mtimeMs < statSync(src).mtimeMs) {
    execSync(`${im} "${src}" -resize "1600x>" -strip -interlace Plane -quality 82 "${src}"`, { stdio: 'inherit' });
    execSync(`${im} "${src}" -quality 80 "${webp}"`, { stdio: 'inherit' });
  }
  for (const w of SIZES) {
    execSync(`${im} "${webp}" -resize "${w}x>" -strip -quality 78 "${join(dir, variantOf(f, w))}"`, { stdio: 'inherit' });
  }
}
console.log('Done. Commit the updated .jpg + .webp files.');
