// Auditoria de privacidade e de segredos sobre os arquivos de texto do repositório e do build.
// Falha (exit 1) se encontrar segredo, caminho pessoal, e-mail não autorizado ou termo proibido.
//
// Termos específicos do projeto (nomes de terceiros, senhas de laboratório, dados de rede reais)
// ficam em .privacy-terms.txt, um por linha, fora do controle de versão: a própria lista é sensível.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const SKIP_DIRS = new Set(['node_modules', '.git', '.astro', '_raw']);
const TEXT_EXT = new Set(['.md', '.astro', '.ts', '.mjs', '.js', '.json', '.yml', '.yaml', '.css', '.html', '.xml', '.txt', '.svg']);
const ALLOWED_EMAILS = new Set(['juliorodrigues84@live.com']);

const RULES = [
  { name: 'token do GitHub', re: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
  { name: 'chave AWS', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'chave privada', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'caminho pessoal do Windows', re: /[A-Za-z]:\\Users\\[^\\\s"']+/g },
  { name: 'caminho pessoal Unix', re: /\/(?:home|Users)\/(?!analyst\b)[a-z][\w.-]+\//g },
  { name: 'endereço MAC completo', re: /\b(?:[0-9a-f]{2}:){5}[0-9a-f]{2}\b/gi },
  { name: 'telefone', re: /\(\d{2}\)\s?9?\d{4}-?\d{4}/g },
];

const isPrivateOrDoc = (ip) => {
  const [a, b, c] = ip.split('.').map(Number);
  if ([a, b, c].some((n) => n > 255)) return true; // não é IP
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    a === 255 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113)
  );
};

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (TEXT_EXT.has(extname(entry.name).toLowerCase()) && statSync(full).size < 2_000_000) yield full;
  }
}

const termsFile = join(ROOT, '.privacy-terms.txt');
const terms = existsSync(termsFile)
  ? readFileSync(termsFile, 'utf8').split(/\r?\n/).map((t) => t.trim()).filter((t) => t && !t.startsWith('#'))
  : [];

const errors = [];
const warnings = [];
let files = 0;

for (const file of walk(ROOT)) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  if (rel === 'scripts/audit-privacy.mjs' || rel === 'package-lock.json' || rel === '.privacy-terms.txt') continue;
  files += 1;
  const text = readFileSync(file, 'utf8');
  const lower = text.toLowerCase();

  for (const rule of RULES) {
    for (const m of text.matchAll(rule.re)) errors.push(`${rel}: ${rule.name}: ${m[0].slice(0, 40)}`);
  }
  for (const m of text.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)) {
    const email = m[0].toLowerCase().replace(/\.$/, '');
    if (!ALLOWED_EMAILS.has(email) && !/\.(png|jpg|webp|svg|css|js)$/.test(email) && !email.startsWith('noreply@')) {
      errors.push(`${rel}: e-mail não autorizado: ${email}`);
    }
  }
  for (const term of terms) {
    if (lower.includes(term.toLowerCase())) errors.push(`${rel}: termo proibido (.privacy-terms.txt): ${term}`);
  }
  for (const m of text.matchAll(/\b(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}\b/g)) {
    if (!isPrivateOrDoc(m[0])) warnings.push(`${rel}: IP público a revisar: ${m[0]}`);
  }
}

const uniq = (a) => [...new Set(a)];
console.log(`Auditoria de privacidade: ${files} arquivos de texto, ${terms.length} termos específicos.`);
for (const w of uniq(warnings)) console.log(`  aviso  ${w}`);
for (const e of uniq(errors)) console.log(`  ERRO   ${e}`);
if (errors.length > 0) {
  console.log(`\n${uniq(errors).length} problema(s). Corrija antes de publicar.`);
  process.exit(1);
}
console.log(`Nenhum problema. ${uniq(warnings).length} aviso(s) para revisão manual.`);
