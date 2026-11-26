import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'loja-assets');
fs.mkdirSync(outDir, { recursive: true });

const iconSquareSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#f8dde1"/>
  <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
        fill="none" stroke="#3a2b38" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const bannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="1.6" fill="#ecdadd"/>
    </pattern>
  </defs>
  <rect width="1024" height="500" fill="#fdf6f4"/>
  <rect width="1024" height="500" fill="url(#dots)"/>
  <!-- Faixa lateral decorativa -->
  <circle cx="940" cy="80" r="140" fill="#f8dde1" opacity="0.55"/>
  <circle cx="110" cy="460" r="120" fill="#e8efe8" opacity="0.7"/>
  <!-- Ícone em destaque à esquerda (marrom por cima do rosa) -->
  <g transform="translate(86, 125)">
    <rect width="250" height="250" rx="56" fill="#f8dde1" stroke="#ecdadd" stroke-width="3"/>
    <g transform="scale(3.90625)">
      <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
            fill="none" stroke="#3a2b38" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>
  <!-- Textos principais -->
  <text x="385" y="210" font-family="Segoe UI, Arial, sans-serif" font-size="60" font-weight="800" fill="#3a2b38">Caderno Unirversos</text>
  <text x="385" y="268" font-family="Segoe UI, Arial, sans-serif" font-size="29" font-weight="600" fill="#c23f5e">Japonês · Kanji · Dicionário · Flashcards</text>
  <text x="385" y="322" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="#705f6c">Escreva, desenhe na página e estude 100% offline.</text>
  <!-- Selo inferior -->
  <rect x="385" y="352" width="275" height="44" rx="22" fill="#3a2b38"/>
  <text x="522" y="381" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="20" font-weight="700" fill="#fdf6f4">Offline · Sem Anúncios</text>
</svg>`;

const iconRoundedSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#f8dde1"/>
  <path d="M32 32C40 19 55 19 55 32C55 45 40 45 32 32C24 19 9 19 9 32C9 45 24 45 32 32Z"
        fill="none" stroke="#3a2b38" stroke-width="7.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

await sharp(Buffer.from(iconSquareSvg)).resize(1024, 1024).flatten({ background: '#f8dde1' }).removeAlpha().png().toFile(path.join(outDir, 'icone-1024x1024.png'));
await sharp(Buffer.from(iconRoundedSvg)).resize(512, 512).png().toFile(path.join(outDir, 'icone-512x512.png'));
await sharp(Buffer.from(iconRoundedSvg)).resize(114, 114).png().toFile(path.join(outDir, 'icone-114x114.png'));
await sharp(Buffer.from(bannerSvg)).resize(1024, 500).flatten({ background: '#fdf6f4' }).removeAlpha().png().toFile(path.join(outDir, 'banner-1024x500.png'));

console.log('✓ Assets das lojas gerados em ./loja-assets');
