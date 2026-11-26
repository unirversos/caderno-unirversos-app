import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const wwwDir = path.join(root, 'www');
const outDir = path.join(root, 'loja-assets');
fs.mkdirSync(outDir, { recursive: true });

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const demoSeedScript = `
<script>
(function(){
  var params = new URLSearchParams(location.search);
  var cena = params.get('cena') || '1';
  var agora = Date.now();
  var notas = [
    {
      id: 'demo-1',
      t: 'Kanji N5 — Natureza',
      x: '山 (やま) — montanha\\n川 (かわ) — rio\\n木 (き) — árvore\\n花 (はな) — flor\\n空 (そら) — céu\\n\\nFrase do dia:\\n青い空と白い雲 (あおい そら と しろい くも)\\nCéu azul e nuvens brancas.',
      a: 2026, o: 11, d: 25, w: 3,
      pap: 'kanji',
      cad: 'Kanji N5',
      fav: true,
      s: [],
      pp: [
        { x: 'Prática de leitura:\\n\\n今日 (きょう) — hoje\\n明日 (あした) — amanhã\\n時間 (じかん) — tempo / hora\\n先生 (せんせい) — professor(a)\\n学生 (がくせい) — estudante', s: [], pap: 'pauta' }
      ],
      m: agora
    },
    {
      id: 'demo-2',
      t: 'Saudações essenciais',
      x: 'おはようございます — Bom dia (formal)\\nこんにちは — Boa tarde / Olá\\nこんばんは — Boa noite\\nありがとうございます — Muito obrigado(a)\\nすみません — Com licença / Desculpe',
      a: 2026, o: 11, d: 24, w: 2,
      pap: 'pauta',
      cad: 'Conversação',
      fav: true,
      s: [],
      pp: [],
      m: agora - 86400000
    },
    {
      id: 'demo-3',
      t: 'Verbos do cotidiano',
      x: '食べる (たべる) — comer\\n飲む (のむ) — beber\\n行く (いく) — ir\\n見る (みる) — ver / assistir\\n書く (かく) — escrever\\n読む (よむ) — ler',
      a: 2026, o: 11, d: 23, w: 1,
      pap: 'ponto',
      cad: 'Vocabulário',
      fav: false,
      s: [],
      pp: [],
      m: agora - 172800000
    }
  ];
  try { localStorage.setItem('uniCadernoNotas1', JSON.stringify(notas)); } catch(e){}

  window.addEventListener('DOMContentLoaded', function(){
    setTimeout(function(){
      if (cena === '2') {
        var dicbt = document.getElementById('dicbt');
        if (dicbt) dicbt.click();
      } else if (cena === '3') {
        var botoes = Array.from(document.querySelectorAll('button'));
        var btEst = botoes.find(function(b){ return /estudar|flashcard/i.test(b.textContent || ''); });
        if (btEst) btEst.click();
        else {
          var cfgbt = document.getElementById('cfgbt');
          if (cfgbt) cfgbt.click();
        }
      }
    }, 150);
  });
})();
</script>
`;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];
  const filePath = path.join(wwwDir, urlPath === '/' ? 'index.html' : urlPath);
  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
  if (urlPath === '/' || urlPath === '/index.html') {
    let html = fs.readFileSync(filePath, 'utf8');
    html = html.replace('<head>', '<head>' + demoSeedScript);
    res.end(html);
  } else {
    fs.createReadStream(filePath).pipe(res);
  }
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();

const cenas = [
  ['1', 'screenshot-1-caderno.png'],
  ['2', 'screenshot-2-dicionario.png'],
  ['3', 'screenshot-3-estudo.png']
];

for (const [cena, nome] of cenas) {
  const outFile = path.join(outDir, nome);
  const tmpProfile = fs.mkdtempSync(path.join(os.tmpdir(), 'caderno-shot-'));
  try {
    await execFileAsync(chromePath, [
      '--headless=new',
      `--user-data-dir=${tmpProfile}`,
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--no-default-browser-check',
      '--hide-scrollbars',
      '--window-size=1280,800',
      '--force-device-scale-factor=1',
      '--virtual-time-budget=1200',
      `--screenshot=${outFile}`,
      `http://127.0.0.1:${port}/index.html?cena=${cena}`
    ], { timeout: 25000 });
    console.log('✓ Gerado:', nome);
  } finally {
    fs.rmSync(tmpProfile, { recursive: true, force: true });
  }
}

server.close();
