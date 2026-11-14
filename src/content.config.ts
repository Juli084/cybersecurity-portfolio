import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  CATEGORY_IDS,
  ENVIRONMENT_IDS,
  EVIDENCE_TYPE_IDS,
  OS_IDS,
  SKILL_IDS,
} from './data/taxonomy';

const yearMonth = z.string().regex(/^\d{4}-\d{2}$/, 'use AAAA-MM');
const framework = z.object({ id: z.string(), name: z.string() });
const reference = z.object({ label: z.string(), url: z.url() });

/**
 * Um laboratório (ou série de laboratórios) documentado.
 * O build falha se faltar campo obrigatório ou se um valor estiver fora da taxonomia:
 * é a trava contra publicar algo sem evidência classificada.
 */
const labs = defineCollection({
  loader: glob({ base: './labs', pattern: '*/lab.md' }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      covers: z.array(z.string().regex(/^\d{3}$/)).min(1),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string(),
      summary: z.string(),
      date: yearMonth,
      dateEnd: yearMonth.optional(),
      kind: z.enum(['laboratorio', 'serie', 'avaliacao', 'estudo-de-caso']),
      category: z.enum(CATEGORY_IDS),
      environments: z.array(z.enum(ENVIRONMENT_IDS)).min(1),
      os: z.array(z.enum(OS_IDS)).min(1),
      tools: z.array(z.string()),
      protocols: z.array(z.string()),
      skills: z.array(z.enum(SKILL_IDS)).min(1),
      evidenceTypes: z.array(z.enum(EVIDENCE_TYPE_IDS)).min(1),
      evidenceStrength: z.enum(['E3', 'E2', 'E1']),
      context: z.string(),
      objectives: z.array(z.string()).min(1),
      procedure: z.array(z.string()).min(1),
      evidence: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string() }))
        .default([]),
      result: z.string(),
      learning: z.string(),
      limitations: z.array(z.string()).default([]),
      reproducibility: z.array(z.string()).default([]),
      scope: z.string().optional(),
      frameworks: z
        .object({
          nice: z.array(z.string()).default([]),
          csf: z.array(framework).default([]),
          attack: z.array(framework).default([]),
          owasp: z.array(framework).default([]),
        })
        .default({ nice: [], csf: [], attack: [], owasp: [] }),
      references: z.array(reference).default([]),
      featured: z.number().int().positive().optional(),
      anonymized: z.boolean().default(false),
      status: z.literal('completed').default('completed'),
    }),
});

const projects = defineCollection({
  loader: glob({ base: './projects', pattern: '*/project.md' }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      slug: z.string().regex(/^[a-z0-9-]+$/),
      title: z.string(),
      summary: z.string(),
      date: yearMonth,
      team: z.string(),
      myPart: z.string(),
      kind: z.string(),
      deliverables: z.array(z.string()),
      evidence: z
        .array(z.object({ src: image(), alt: z.string(), caption: z.string() }))
        .default([]),
      limitations: z.array(z.string()).default([]),
      order: z.number(),
    }),
});

export const collections = { labs, projects };
