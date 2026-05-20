import { GetServerSideProps } from 'next';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority?: number;
}

const BASE_URL = 'https://web-ffulrcu5y-baahe.vercel.app';

const staticPages: SitemapUrl[] = [
  { loc: BASE_URL, priority: 1.0 },
  { loc: `${BASE_URL}/properties`, priority: 0.9 },
  { loc: `${BASE_URL}/agents`, priority: 0.8 },
  { loc: `${BASE_URL}/neighborhoods`, priority: 0.7 },
  { loc: `${BASE_URL}/login`, priority: 0.6 },
  { loc: `${BASE_URL}/register`, priority: 0.6 },
  { loc: `${BASE_URL}/sell`, priority: 0.8 },
  { loc: `${BASE_URL}/about`, priority: 0.5 },
];

export default function Sitemap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${page.priority || 0.5}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
};