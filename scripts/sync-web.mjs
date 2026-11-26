import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const siteDir = path.resolve(root, '..', 'SITE');
const wwwDir = path.resolve(root, 'www');

fs.mkdirSync(path.join(wwwDir, 'icones'), { recursive: true });

const copiar = [
  ['caderno-dados.js', 'caderno-dados.js'],
  ['caderno-livro.js', 'caderno-livro.js'],
  ['caderno-ui.js', 'caderno-ui.js'],
  ['caderno-dic.js', 'caderno-dic.js'],
  ['estilo-celular.css', 'estilo-celular.css'],
  ['favicon.svg', 'favicon.svg'],
  ['apple-touch-icon.png', 'apple-touch-icon.png'],
  ['icones/icone-192.png', 'icones/icone-192.png'],
  ['icones/icone-512.png', 'icones/icone-512.png'],
  ['icones/icone-maskable-512.png', 'icones/icone-maskable-512.png']
];

for (const [srcRel, dstRel] of copiar) {
  const src = path.join(siteDir, srcRel);
  const dst = path.join(wwwDir, dstRel);
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);
}

/* Adapta /idiomas/caderno/index.html para rodar empacotado em www/index.html (App Store & Google Play) */
let html = fs.readFileSync(path.join(siteDir, 'idiomas', 'caderno', 'index.html'), 'utf8');
html = html
  .replace(/href="\/estilo-celular\.css[^"]*"/g, 'href="./estilo-celular.css"')
  .replace(/src="\/caderno-dados\.js[^"]*"/g, 'src="./caderno-dados.js"')
  .replace(/src="\/caderno-livro\.js[^"]*"/g, 'src="./caderno-livro.js"')
  .replace(/src="\/caderno-ui\.js[^"]*"/g, 'src="./caderno-ui.js"')
  .replace(/src='\/caderno-dic\.js[^']*'/g, "src='./caderno-dic.js'")
  .replace(/href="\/favicon\.svg"/g, 'href="./favicon.svg"')
  .replace(/<link rel="icon" href="\/favicon\.ico"[^>]*>/g, '')
  .replace(/href="\/apple-touch-icon\.png"/g, 'href="./apple-touch-icon.png"')
  .replace(/<script[^>]+src="\/(menu-ativo|voltar-global|app|voltar|bau-flutuante)\.js[^"]*"[^>]*><\/script>/g, '')
  .replace(/href="\/idiomas\/caderno\/manifest\.webmanifest"/g, 'href="./manifest.webmanifest"')
  .replace(
    '</head>',
    '<style id="app-nativo-css">body.app-nativo #modo-app-bt,body.app-nativo [data-a="entrar"]{display:none!important}</style>\n</head>'
  )
  .replace('<body>', '<body class="modo-app app-nativo">')
  .replace('</body>', '<script src="./app-nativo.js"></script>\n</body>');

fs.writeFileSync(path.join(wwwDir, 'index.html'), html, 'utf8');

if (fs.existsSync(path.join(siteDir, 'idiomas', 'caderno', 'manifest.webmanifest'))) {
  fs.copyFileSync(
    path.join(siteDir, 'idiomas', 'caderno', 'manifest.webmanifest'),
    path.join(wwwDir, 'manifest.webmanifest')
  );
}

console.log('✓ Arquivos do Caderno sincronizados de ../SITE para ./www com sucesso!');
