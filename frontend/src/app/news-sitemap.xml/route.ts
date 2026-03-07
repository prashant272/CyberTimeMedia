import { newsService } from '../services/NewsService';

export async function GET() {
    const baseUrl = 'https://www.timecybermedia.com';

    try {
        // Get latest news (limit to 100 for Google News sitemaps)
        // Google News sitemaps should only include articles from the last 2 days.
        const allNewsRes = await newsService.getAllNews(false, 1, 100);
        const allDocs: any[] = (allNewsRes as any).news || allNewsRes.data || [];

        // Filter articles from the last 3 hours
        const threeHoursAgo = new Date();
        threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);

        const latestArticles = allDocs.filter(item => {
            const pubDate = new Date(item.publishedAt || item.createdAt || 0);
            return pubDate >= threeHoursAgo;
        });

        const sitemapEntries = latestArticles.map(item => {
            const subCat = (item.subCategory || item.category || 'news')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            const cat = (item.category || 'news').toLowerCase();
            const safeSlug = (item.slug || '')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            const url = `${baseUrl}/Pages/${cat}/${encodeURIComponent(subCat)}/${encodeURIComponent(safeSlug)}`;
            const pubDate = new Date(item.publishedAt || item.createdAt || new Date()).toISOString();

            return `
  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>Time Cyber Media</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${item.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</news:title>
    </news:news>
  </url>`;
        }).join('');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${sitemapEntries}
</urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
            },
        });
    } catch (error) {
        console.error('News sitemap generation error:', error);
        return new Response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', {
            headers: { 'Content-Type': 'application/xml' },
        });
    }
}
