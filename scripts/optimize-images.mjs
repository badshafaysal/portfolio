/**
 * Local helper: resize/recompress new JPGs in public/images and emit WebP siblings.
 * Requires ImageMagick (`magick` v7 or `convert` v6).   npm run optimize-images
 * Only processes JPGs without an up-to-date .webp, so re-runs don't degrade quality.
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

const todo = readdirSync(dir).filter((f) => {
  if (!/\.jpe?g$/i.test(f)) return false;
  const webp = join(dir, f.replace(/\.jpe?g$/i, '.webp'));
  return !existsSync(webp) || statSync(webp).mtimeMs < statSync(join(dir, f)).mtimeMs;
});
if (!todo.length) { console.log('Nothing to optimize.'); process.exit(0); }

for (const f of todo) {
  const src = join(dir, f);
  const webp = join(dir, f.replace(/\.jpe?g$/i, '.webp'));
  console.log('Optimizing', f);
  execSync(`${im} "${src}" -resize "1600x>" -strip -interlace Plane -quality 82 "${src}"`, { stdio: 'inherit' });
  execSync(`${im} "${src}" -quality 80 "${webp}"`, { stdio: 'inherit' });
}
console.log('Done. Commit the updated .jpg + .webp files.');
