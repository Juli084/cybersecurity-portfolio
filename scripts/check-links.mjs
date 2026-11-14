// Verifica links e recursos do build em dist/.
// Internos: o arquivo de destino precisa existir. Externos: só com --external (faz requisições).
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const DIST = join(ROOT, 'dist');
const BASE = (process.env.BASE_PATH ?? '/cybersecurity-portfolio').replace(/\/$/, '');
const checkExternal = process.argv.includes('--external');

if (!existsSync(DIST)) {
  console.error('dist/ não existe. Rode npm run build antes.');
  process.exit(1);
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

const broken = [];
const external = new Map();
let pages = 0;
let internal = 0;
const problems = [];

for (const file of walk(DIST)) {
  pages += 1;
  const rel = relative(DIST, file).replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');

  // checagens estruturais mínimas de SEO e acessibilidade
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${rel}: <title> ausente ou curto`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) problems.push(`${rel}: description ausente ou curta`);
  if ((html.match(/<h1[\s>]/g) ?? []).length !== 1) problems.push(`${rel}: deve haver exatamente um <h1>`);
  if (!/<html lang="pt-BR"/.test(html)) problems.push(`${rel}: atributo lang ausente`);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="[^"]+"/.test(img[0])) problems.push(`${rel}: imagem sem texto alternativo`);
  }

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const target = m[1];
    if (/^(mailto:|tel:|data:|#)/.test(target)) continue;
    if (/^https?:\/\//.test(target)) {
      external.set(target, [...(external.get(target) ?? []), rel]);
      continue;
    }
    internal += 1;
    const [path] = target.split(/[?#]/);
    if (!path.startsWith(`${BASE}/`) && path !== BASE) {
      broken.push(`${rel}: link interno fora do base "${BASE}": ${target}`);
      continue;
    }
    const local = join(DIST, decodeURIComponent(path.slice(BASE.length)));
    const candidates = [local, join(local, 'index.html')];
    if (!candidates.some((c) => existsSync(c) && (statSync(c).isFile() || existsSync(join(c, 'index.html'))))) {
      broken.push(`${rel}: destino inexistente: ${target}`);
    }
  }
}

console.log(`Links: ${pages} páginas, ${internal} links internos, ${external.size} URLs externas distintas.`);

if (checkExternal) {
  const urls = [...external.keys()];
  const results = await Promise.all(
    urls.map(async (u) => {
      for (const method of ['HEAD', 'GET']) {
        try {
          const res = await fetch(u, {
            method,
            redirect: 'follow',
            signal: AbortSignal.timeout(20000),
            headers: { 'User-Agent': 'Mozilla/5.0 (link-check)' },
          });
          if (res.status < 400) return [u, res.status];
          if (method === 'GET') return [u, res.status];
        } catch (err) {
          if (method === 'GET') return [u, String(err.cause?.code ?? err.name)];
        }
      }
      return [u, 'erro'];
    }),
  );
  for (const [u, status] of results) {
    if (typeof status !== 'number' || status >= 400) {
      console.log(`  externo ${status}: ${u}  (em ${external.get(u)[0]})`);
    }
  }
  const bad = results.filter(([, s]) => typeof s !== 'number' || s >= 400).length;
  console.log(`Externos: ${results.length - bad} ok, ${bad} com problema (403 e 429 costumam ser bloqueio a robôs; conferir à mão).`);
}

for (const p of problems) console.log(`  ESTRUTURA ${p}`);
for (const b of broken) console.log(`  QUEBRADO  ${b}`);
if (broken.length > 0 || problems.length > 0) process.exit(1);
console.log('Nenhum link interno quebrado e nenhuma falha estrutural.');
