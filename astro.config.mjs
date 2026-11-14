import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// No GitHub Actions, SITE_URL e BASE_PATH vêm de actions/configure-pages.
// Localmente valem os padrões abaixo.
const site = process.env.SITE_URL || 'https://juli084.github.io';
const base = process.env.BASE_PATH !== undefined ? process.env.BASE_PATH || '/' : '/cybersecurity-portfolio';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  compressHTML: true,
  integrations: [sitemap()],
});
