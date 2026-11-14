import { getCollection, type CollectionEntry } from 'astro:content';
import {
  EVIDENCE_STRENGTH,
  SKILLS,
  SKILL_DOMAINS,
  type EvidenceStrengthId,
  type SkillDomain,
  type SkillId,
} from '../data/taxonomy';

export type Lab = CollectionEntry<'labs'>;
export type Project = CollectionEntry<'projects'>;

/** Prefixa o caminho com o `base` do site (necessário em GitHub Pages de projeto). */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.replace(/^\//, '');
  return `${base}/${clean}`;
}

export const labUrl = (lab: Lab) => url(`laboratorios/${lab.data.slug}/`);

export async function getLabs(): Promise<Lab[]> {
  const labs = await getCollection('labs');
  return labs.sort((a, b) => a.data.covers[0].localeCompare(b.data.covers[0]));
}

export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => a.data.order - b.data.order);
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

export function formatMonth(ym: string): string {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]}/${y}`;
}

export function formatPeriod(start: string, end?: string): string {
  return end && end !== start ? `${formatMonth(start)} a ${formatMonth(end)}` : formatMonth(start);
}

const uniq = <T>(items: T[]) => [...new Set(items)];
const sortPt = (items: string[]) => [...items].sort((a, b) => a.localeCompare(b, 'pt-BR'));

/** Números do painel. Tudo é contado a partir dos laboratórios publicados. */
export function getStats(labs: Lab[]) {
  const covered = uniq(labs.flatMap((l) => l.data.covers));
  const tools = sortPt(uniq(labs.flatMap((l) => l.data.tools)));
  const protocols = sortPt(uniq(labs.flatMap((l) => l.data.protocols)));
  const categories = uniq(labs.map((l) => l.data.category));
  const captures = labs.reduce((n, l) => n + l.data.evidence.length, 0);
  const withCapture = labs.filter((l) => l.data.evidenceStrength === 'E3');
  const frameworks = {
    csf: uniq(labs.flatMap((l) => l.data.frameworks.csf.map((f) => f.id))).sort(),
    attack: uniq(labs.flatMap((l) => l.data.frameworks.attack.map((f) => f.id))).sort(),
    nice: sortPt(uniq(labs.flatMap((l) => l.data.frameworks.nice))),
    owasp: uniq(labs.flatMap((l) => l.data.frameworks.owasp.map((f) => f.id))).sort(),
  };
  const dates = labs.flatMap((l) => [l.data.date, l.data.dateEnd ?? l.data.date]).sort();
  return {
    labCount: covered.length,
    pageCount: labs.length,
    tools,
    protocols,
    categoryCount: categories.length,
    captures,
    labsWithCapture: uniq(withCapture.flatMap((l) => l.data.covers)).length,
    frameworks,
    firstDate: dates[0],
    lastDate: dates[dates.length - 1],
  };
}

export interface SkillRow {
  id: SkillId;
  label: string;
  domain: SkillDomain;
  labs: Lab[];
  tools: string[];
  best: EvidenceStrengthId;
  level: string;
}

const STRENGTH_ORDER: EvidenceStrengthId[] = ['E3', 'E2', 'E1'];

/**
 * Matriz de competências: cada competência lista os laboratórios que a comprovam.
 * O "nível" descreve o tipo de evidência, não uma nota.
 */
export function getSkillMatrix(labs: Lab[]) {
  const rows: SkillRow[] = [];
  for (const id of Object.keys(SKILLS) as SkillId[]) {
    const related = labs.filter((l) => l.data.skills.includes(id));
    if (related.length === 0) continue;
    const best = STRENGTH_ORDER.find((s) => related.some((l) => l.data.evidenceStrength === s)) ?? 'E2';
    const practiced = uniq(related.flatMap((l) => l.data.covers)).length;
    const level =
      best === 'E3'
        ? practiced > 1
          ? 'Praticado em laboratório, com captura própria'
          : 'Demonstrado em laboratório, com captura própria'
        : 'Praticado em laboratório, registro textual';
    rows.push({
      id,
      label: SKILLS[id].label,
      domain: SKILLS[id].domain,
      labs: related,
      tools: sortPt(uniq(related.flatMap((l) => l.data.tools))),
      best,
      level,
    });
  }
  const domains = (Object.keys(SKILL_DOMAINS) as SkillDomain[])
    .map((domain) => ({
      id: domain,
      label: SKILL_DOMAINS[domain],
      rows: rows.filter((r) => r.domain === domain),
    }))
    .filter((d) => d.rows.length > 0);
  return { rows, domains };
}

export const INVENTORIED_LABS = 46;

export const strengthLabel = (s: EvidenceStrengthId) => EVIDENCE_STRENGTH[s].short;
