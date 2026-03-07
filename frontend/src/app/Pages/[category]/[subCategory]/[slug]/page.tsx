import { notFound } from 'next/navigation';
import { newsService, NewsItem } from '@/app/services/NewsService';
import ArticlePageClient from '@/app/Components/ArticlePage/ArticlePageClient/ArticlePageClient';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    category: string;
    subCategory: string;
    slug: string;
  }>;
}

const siteUrl = "https://www.timecybermedia.com";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, category } = await params;

  try {
    const sectionKey = category.toLowerCase();
    const res = await newsService.getNewsBySlug(sectionKey, slug).catch(err => null);

    if (!res) return { title: "News | Time Cyber Media" };
    const news = res.news || res.data;

    if (news) {
      let imageUrl = news.image || '/placeholder.jpg';
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${siteUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
      }

      const snippet = news.summary || news.content?.substring(0, 150) || "Read the latest news";
      const fullDescription = `${snippet.replace(/[#*]/g, '')}... | Click to read full news and view more updates on Time Cyber Media`;

      const { subCategory } = await params;
      const articleUrl = `${siteUrl}/Pages/${category}/${subCategory}/${slug}`;

      return {
        metadataBase: new URL(siteUrl),
        title: news.title,
        description: fullDescription,
        alternates: {
          canonical: articleUrl,
        },
        openGraph: {
          title: news.title,
          description: fullDescription,
          url: articleUrl,
          siteName: 'Time Cyber Media',
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: news.title,
            },
          ],
          type: 'article',
          publishedTime: news.publishedAt || (news as any).createdAt,
          section: category,
          tags: news.tags || [],
        },
        twitter: {
          card: 'summary_large_image',
          title: news.title,
          description: fullDescription,
          images: [imageUrl],
        },
        category: category,
      };
    }
  } catch (error) {
    console.error("Metadata generation error:", error);
  }

  return {
    metadataBase: new URL(siteUrl),
    title: "News | Time Cyber Media",
    description: "Latest breaking news and updates on Time Cyber Media."
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { category: catParam, subCategory: subCatParam, slug } = await params;

  const category = decodeURIComponent(catParam).toLowerCase().replace(/-/g, ' ');
  const subCategory = decodeURIComponent(subCatParam).toLowerCase().replace(/-/g, ' ');
  const sectionKey = catParam.toLowerCase(); // Use raw param for API

  try {
    // Fetch specifically by slug. The backend now finds by slug regardless of section mismatch.
    const newsRes = await newsService.getNewsBySlug(sectionKey, slug).catch(err => {
      console.warn(`Initial fetch failed for ${slug} in ${sectionKey}, trying fallback...`, err.message);
      return null;
    });

    let foundArticle = newsRes?.news || newsRes?.data;

    // If still not found, it might be a truly missing article or a draft
    if (!foundArticle) {
      notFound();
    }

    // Fetch related news from the same category
    const articleCategory = foundArticle.category || sectionKey;
    const sectionRes = await newsService.getNewsBySection(articleCategory).catch(() => ({ news: [], data: [] }));
    const relatedNews = ((sectionRes as any).news || (sectionRes as any).data || []) as NewsItem[];

    return renderArticle(foundArticle!, relatedNews, category, subCategory, slug);

  } catch (error) {
    console.error("Article Detail server-side error:", error);
    notFound();
  }
}

function renderArticle(foundArticle: any, categoryNews: any[], category: string, subCategory: string, slug: string) {
  console.log(`[DEBUG] Article ${slug} authorId:`, foundArticle.authorId);

  const articleData = {
    id: foundArticle._id || foundArticle.slug,
    section: foundArticle.category || category,
    category: foundArticle.subCategory || subCategory,
    title: foundArticle.title,
    subtitle: foundArticle.summary || '',
    image: foundArticle.image || '/placeholder.jpg',
    date: foundArticle.publishedAt || foundArticle.createdAt || new Date().toISOString(),
    author: foundArticle.author || 'Time Cyber Media',
    authorId: foundArticle.authorId,
    readTime: '',
    content: foundArticle.content || 'Content not available',
    tags: foundArticle.tags || [],
    slug: foundArticle.slug,
    targetLink: foundArticle.targetLink,
    nominationLink: foundArticle.nominationLink
  };

  // Filter related articles from the provided category stories
  const related = categoryNews
    .filter((news: any) => news.slug !== slug)
    .slice(0, 3)
    .map((news: any) => ({
      id: news._id || news.slug,
      title: news.title,
      slug: news.slug,
      section: news.category,
      category: news.subCategory,
      image: news.image
    }));

  const topNews = categoryNews.slice(0, 10).map((news: any) => ({
    id: news._id || news.slug,
    title: news.title,
    image: news.image || '/placeholder.jpg',
    slug: news.slug,
    section: news.category || '',
    category: news.subCategory || ''
  }));

  const recommendedStories = categoryNews.slice(10, 15).map((news: any) => ({
    id: news._id || news.slug,
    title: news.title,
    image: news.image || '/placeholder.jpg',
    slug: news.slug,
    section: news.category || '',
    category: news.subCategory || ''
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/Pages/${foundArticle.category}/${foundArticle.subCategory}/${foundArticle.slug}`
    },
    "headline": articleData.title,
    "description": articleData.subtitle || articleData.content.substring(0, 160),
    "image": [
      articleData.image.startsWith('http') ? articleData.image : `${siteUrl}${articleData.image.startsWith('/') ? '' : '/'}${articleData.image}`
    ],
    "datePublished": articleData.date,
    "dateModified": articleData.date,
    "author": {
      "@type": "Person",
      "name": articleData.author || "Time Cyber Media",
      "url": siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Time Cyber Media",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "articleSection": foundArticle.category,
    "articleBody": articleData.content.substring(0, 5000)
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlePageClient
        article={articleData}
        relatedArticles={related}
        topNews={topNews}
        recommendedStories={recommendedStories}
        section={category}
        category={subCategory}
      />
    </>
  );
}
