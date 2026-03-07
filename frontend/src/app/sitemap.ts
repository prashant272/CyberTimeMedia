import { MetadataRoute } from 'next';
import { newsService } from './services/NewsService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.timecybermedia.com';

    // Static routes
    const routes = [
        '',
        '/breaking-news',
        '/sports/live',
        '/privacy',
        '/terms',
        '/cookies',
        '/disclaimer',
        '/Pages/world',
        '/Pages/world/india',
        '/Pages/world/europe',
        '/Pages/world/usa',
        '/Pages/world/africa',
        '/Pages/world/asia',
        '/Pages/world/middle-east',
        '/Pages/sports',
        '/Pages/business',
        '/Pages/awards',
        '/Pages/entertainment',
        '/Pages/lifestyle',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes (News Articles)
    const newsRoutes: MetadataRoute.Sitemap = [];
    try {
        const allNewsRes = await newsService.getAllNews(false, 1, 1000);
        const allDocs: any[] = (allNewsRes as any).news || allNewsRes.data || [];

        allDocs.forEach(item => {
            if (item.slug && item.category) {
                // Clean and encode subCategory
                const subCat = (item.subCategory || item.category)
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');

                const cat = item.category.toLowerCase();

                // Sanitize slug
                const safeSlug = item.slug
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');

                newsRoutes.push({
                    url: `${baseUrl}/Pages/${cat}/${encodeURIComponent(subCat)}/${encodeURIComponent(safeSlug)}`,
                    lastModified: item.publishedAt || item.createdAt || new Date(),
                    changeFrequency: 'weekly',
                    priority: 0.6
                });
            }
        });

    } catch (error) {
        console.error("Sitemap generation error:", error);
    }

    return [...routes, ...newsRoutes];
}
