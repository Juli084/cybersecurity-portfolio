// Gera o README.md de cada laboratório a partir do lab.md (fonte única),
// além do índice labs/README.md e de docs/skills-matrix.md e docs/references.md.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const LABS = join(ROOT, 'labs');
const SITE = 'https://juli084.github.io/cybersecurity-portfolio';

const STRENGTH = {
  E3: 'Evidência direta (captura de tela própria ou saída de terminal copiada na entrega)',
  E2: 'Registro textual próprio, sem captura de tela',
  E1: 'Entrega parcial',
};
const KIND = {
  laboratorio: 'Laboratório',
  serie: 'Série de laboratórios',
  avaliacao: 'Avaliação prática',
  'estudo-de-caso': 'Estudo de caso',
};
const ENV = {
  'packet-tracer': 'Cisco Packet Tracer (rede simulada)',
  'vm-linux': 'VM Linux de laboratório (VirtualBox)',
  'vm-windows': 'VM Windows 10 (VirtualBox)',
  'pc-lab': 'PC Windows do laboratório do curso',
  online: 'Serviços online de análise',
  documental: 'Cenário documental',
};
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const month = (ym) => `${MONTHS[Number(ym.slice(5)) - 1]}/${ym.slice(0, 4)}`;
const list = (items) => items.map((i) => `- ${i}`).join('\n');
const oneLine = (s) => String(s).replace(/\s+/g, ' ').trim();

function readLab(dir) {
  const raw = readFileSync(join(LABS, dir, 'lab.md'), 'utf8').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error(`frontmatter ausente em ${dir}`);
  return { dir, data: parse(match[1]), body: match[2].trim() };
}

function readme({ dir, data: d, body }) {
  const period = d.dateEnd && d.dateEnd !== d.date ? `${month(d.date)} a ${month(d.dateEnd)}` : month(d.date);
  const fw = d.frameworks ?? {};
  const fwLines = [];
  if (fw.csf?.length) fwLines.push(`- **NIST CSF 2.0:** ${fw.csf.map((f) => `${f.id} (${f.name})`).join('; ')}`);
  if (fw.attack?.length) fwLines.push(`- **MITRE ATT&CK:** ${fw.attack.map((f) => `${f.id} ${f.name}`).join('; ')}`);
  if (fw.owasp?.length) fwLines.push(`- **OWASP:** ${fw.owasp.map((f) => `${f.id} ${f.name}`).join('; ')}`);
  if (fw.nice?.length) fwLines.push(`- **NICE Framework:** tarefas relacionadas às funções ${fw.nice.join(', ')}`);

  const evidence = (d.evidence ?? []).length
    ? d.evidence.map((e) => `![${e.alt}](${e.src})\n\n*${e.caption}*`).join('\n\n')
    : 'Este laboratório não tem captura de tela própria. A execução é comprovada pelos valores e saídas registrados na entrega, reproduzidos na análise técnica.';

  const parts = [
    `# ${d.title}`,
    `> ${KIND[d.kind]} ${d.id} · ${period} · ${STRENGTH[d.evidenceStrength]}\n>\n> Página no portfólio: ${SITE}/laboratorios/${d.slug}/`,
    `## Objetivo\n\n${oneLine(d.summary)}\n\n${list(d.objectives)}`,
    `## Cenário\n\n${oneLine(d.context)}`,
    `## Ambiente\n\n${list(d.environments.map((e) => ENV[e]))}`,
    d.protocols?.length ? `## Tecnologias\n\n${d.protocols.join(', ')}` : '',
    `## Ferramentas\n\n${d.tools?.length ? d.tools.join(', ') : 'Nenhuma: análise sobre material fornecido.'}`,
    `## Procedimento\n\n${d.procedure.map((p, i) => `${i + 1}. ${p}`).join('\n')}`,
    `## Evidências\n\n${evidence}`,
    `## Análise técnica\n\n${body}`,
    `## Resultado\n\n${oneLine(d.result)}`,
    `## O que aprendi\n\n${oneLine(d.learning)}`,
    `## Competências demonstradas\n\n${list(d.skills.map((s) => `\`${s}\``))}\n\nA relação entre competências e laboratórios está em [docs/skills-matrix.md](../../docs/skills-matrix.md).`,
    fwLines.length
      ? `## Frameworks relacionados\n\nRelação com o que foi praticado. Não indica exercício profissional da função.\n\n${fwLines.join('\n')}`
      : '',
    d.references?.length ? `## Referências\n\n${list(d.references.map((r) => `[${r.label}](${r.url})`))}` : '',
    d.limitations?.length ? `## Limitações\n\n${list(d.limitations)}` : '',
    d.reproducibility?.length ? `## Para reproduzir\n\n${list(d.reproducibility)}` : '',
    `## Considerações éticas\n\n${d.scope ? `${oneLine(d.scope)}\n\n` : ''}Atividade realizada em ambiente acadêmico, controlado e autorizado, com finalidade educacional. Veja [docs/ethics.md](../../docs/ethics.md).`,
    `---\n\n*Arquivo gerado a partir de \`lab.md\` por \`npm run readmes\`. Edite o \`lab.md\`.*`,
  ];
  writeFileSync(join(LABS, dir, 'README.md'), parts.filter(Boolean).join('\n\n') + '\n');
}

const dirs = readdirSync(LABS, { withFileTypes: true })
  .filter((e) => e.isDirectory() && existsSync(join(LABS, e.name, 'lab.md')))
  .map((e) => e.name)
  .sort();
const labs = dirs.map(readLab);
labs.forEach(readme);

// Índice
const rows = labs.map(
  ({ dir, data: d }) =>
    `| ${d.id} | [${d.title}](./${dir}/README.md) | ${(d.tools ?? []).slice(0, 4).join(', ') || 'análise documental'} | ${d.evidenceStrength} |`,
);
writeFileSync(
  join(LABS, 'README.md'),
  `# Laboratórios\n\nCada pasta tem um \`lab.md\` (fonte), um \`README.md\` (gerado) e, quando há, as capturas em \`evidence/\`.\n\n| ID | Laboratório | Ferramentas | Evidência |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n\n**E3:** evidência direta. **E2:** registro textual próprio.\n`,
);

// Matriz de competências
const bySkill = new Map();
for (const lab of labs) for (const s of lab.data.skills) bySkill.set(s, [...(bySkill.get(s) ?? []), lab]);
const skillRows = [...bySkill.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([skill, ls]) => `| \`${skill}\` | ${ls.map((l) => `[${l.data.id}](../labs/${l.dir}/README.md)`).join(', ')} |`);
writeFileSync(
  join(ROOT, 'docs', 'skills-matrix.md'),
  `# Matriz de competências\n\nGerada a partir dos metadados dos laboratórios. A versão navegável está em ${SITE}/competencias/.\n\n| Competência | Laboratórios que a comprovam |\n| --- | --- |\n${skillRows.join('\n')}\n`,
);

// Referências
const refs = new Map();
for (const lab of labs) for (const r of lab.data.references ?? []) refs.set(r.url, r.label);
writeFileSync(
  join(ROOT, 'docs', 'references.md'),
  `# Referências\n\nFontes oficiais citadas nos laboratórios.\n\n${[...refs.entries()]
    .sort(([, a], [, b]) => a.localeCompare(b, 'pt-BR'))
    .map(([u, l]) => `- [${l}](${u})`)
    .join('\n')}\n`,
);

console.log(`READMEs gerados: ${labs.length} laboratórios, ${bySkill.size} competências, ${refs.size} referências.`);
