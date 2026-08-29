import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { kitchenSets } from '../data/kitchens';

const pagesDir = join(process.cwd(), 'src', 'pages');

const isContentPage = (name: string) => /\.(astro|md|mdx)$/.test(name);

const toRoute = (root: string, filePath: string) => {
  const relativePath = filePath.slice(root.length + 1).replace(/\\/g, '/');
  const withoutExt = relativePath.replace(/\.(astro|md|mdx)$/, '');

  if (withoutExt.split('/').some((segment) => segment.startsWith('['))) {
    return null;
  }

  if (withoutExt.endsWith('/index')) {
    return withoutExt.slice(0, -'/index'.length);
  }

  return withoutExt === 'index' ? '' : withoutExt;
};

const collectRoutes = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        return collectRoutes(fullPath);
      }

      if (!entry.isFile() || !isContentPage(entry.name)) {
        return [];
      }

      const route = toRoute(pagesDir, fullPath);
      return route === null ? [] : [route];
    })
  );

  return nested.flat();
};

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site?.toString() ?? 'https://kuhni-v-orenburge.ru';
  const origin = baseUrl.replace(/\/$/, '');

  const normalizeUrl = (path: string) => (path ? `${origin}/${path}` : `${origin}/`);

  const staticPages = await collectRoutes(pagesDir);

  // Автоматически добавляем все статьи из коллекции articles
  const articles = await getCollection('articles');

  const articlePages = articles.map((article) => `articles/${article.id}`);

  // Страницы фотогалерей (/kitchens/<slug>) — динамический роут, руками
  const kitchenPages = kitchenSets.map((set) => `kitchens/${set.slug}`);

  const pages = [...new Set([...staticPages, ...articlePages, ...kitchenPages])].sort();

  const urls = pages
    .map((page) => {
      const url = page ? normalizeUrl(page) : baseUrl.replace(/\/$/, '') + '/';
      return `
  <url>
    <loc>${url}</loc>
  </url>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
