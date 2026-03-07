import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/Dashboard/', '/api/', '/_next/'],
            },
            {
                userAgent: 'Googlebot-News',
                allow: '/',
            }
        ],
        sitemap: [
            'https://www.timecybermedia.com/sitemap.xml',
            'https://www.timecybermedia.com/news-sitemap.xml',
        ],
    };
}
