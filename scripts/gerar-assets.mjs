import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'assets');

fs.mkdirSync(assetsDir, { recursive: true });

/* Símbolo oficial Unirversos (infinito blush #f8dde1 sobre ameixa #3a2b38) */

// 1. Ícone principal 1024x1024 (App Store exige PNG SEM transparência e quadrado, sem bordas arredondadas)
const iconOnlySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#3a2b38"/>
  <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
        fill="none" stroke="#f8dde1" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// 2. Android Adaptive Icon — Foreground (área segura central ~66%)
const iconForegroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 108 108">
  <g transform="translate(22, 22) scale(1)">
    <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
          fill="none" stroke="#f8dde1" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

// 3. Android Adaptive Icon — Background sólido
const iconBackgroundSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#3a2b38"/>
</svg>`;

// 4. Splash Screen claro (2732x2732 — fundo papel #fdf6f4 + emblema central)
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
  <rect width="2732" height="2732" fill="#fdf6f4"/>
  <g transform="translate(1066, 1066)">
    <rect width="600" height="600" rx="140" fill="#3a2b38"/>
    <g transform="scale(9.375)">
      <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
            fill="none" stroke="#f8dde1" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;

// 5. Splash Screen escuro (2732x2732 — modo escuro do iOS/Android)
const splashDarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732">
  <rect width="2732" height="2732" fill="#2b1f29"/>
  <g transform="translate(1066, 1066)">
    <rect width="600" height="600" rx="140" fill="#3a2b38"/>
    <g transform="scale(9.375)">
      <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
            fill="none" stroke="#f8dde1" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
</svg>`;

await sharp(Buffer.from(iconOnlySvg))
  .flatten({ background: '#3a2b38' })
  .removeAlpha()
  .png()
  .toFile(path.join(assetsDir, 'icon-only.png'));

await sharp(Buffer.from(iconForegroundSvg))
  .png()
  .toFile(path.join(assetsDir, 'icon-foreground.png'));

await sharp(Buffer.from(iconBackgroundSvg))
  .flatten({ background: '#3a2b38' })
  .removeAlpha()
  .png()
  .toFile(path.join(assetsDir, 'icon-background.png'));

await sharp(Buffer.from(splashSvg))
  .flatten({ background: '#fdf6f4' })
  .removeAlpha()
  .png()
  .toFile(path.join(assetsDir, 'splash.png'));

await sharp(Buffer.from(splashDarkSvg))
  .flatten({ background: '#2b1f29' })
  .removeAlpha()
  .png()
  .toFile(path.join(assetsDir, 'splash-dark.png'));

console.log('✓ Assets base (ícone 1024×1024 sem transparência + splash 2732×2732) gerados em ./assets');
