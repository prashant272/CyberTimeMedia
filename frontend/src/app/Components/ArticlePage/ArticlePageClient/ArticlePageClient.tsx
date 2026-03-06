'use client';

import React from 'react';
import Breadcrumb from '../Breadcrumb/Breadcrumb';
import ArticleHeader from '../ArticleHeader/ArticleHeader';
import ArticleContent from '../ArticleContent/ArticleContent';
import TopNewsSidebar from '../TopNewsSidebar/TopNewsSidebar';
import RelatedArticles from '../RelatedArticles/RelatedArticles';
import ArticleTags from '../ArticleTags/ArticleTags';
import MoreStoriesSection from '../../Common/MoreFromSection/MoreFromSection';
import RecommendedStories from '../RecommendedStories/RecommendedStories';
import SocialShare from '../../Common/SocialShare/SocialShare';
import BreadcrumbSchema from '../../Common/JSONLD/BreadcrumbSchema';
import SidebarAds from '../../Common/SidebarAds/SidebarAds';

interface ArticleData {
  id: string | number;
  section: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  author?: string;
  authorId?: {
    _id: string;
    name: string;
    ProfilePicture: string;
    designation: string;
  };
  readTime?: string;
  tags?: string[];
  content: string;
  slug: string;
  targetLink?: string;
  nominationLink?: string;
}

interface SidebarNewsItem {
  id: string | number;
  title: string;
  image: string;
  slug: string;
  section: string;
  category: string;
}

interface RelatedArticle {
  id: string | number;
  title: string;
  slug: string;
  section?: string;
  category?: string;
  image?: string;
}

interface ArticlePageClientProps {
  article: ArticleData;
  relatedArticles: RelatedArticle[];
  topNews: SidebarNewsItem[];
  recommendedStories: SidebarNewsItem[];
  section: string;
  category: string;
}

const normalizeUrl = (url: string): string => {
  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export default function ArticlePageClient({
  article,
  relatedArticles,
  topNews,
  recommendedStories,
  section,
  category
}: ArticlePageClientProps) {

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [
      normalizeUrl(article.image)
    ],
    "datePublished": article.date,
    "dateModified": article.date,
    "author": [{
      "@type": "Person",
      "name": article.author || "TIME CYBERMEDIA News"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "TIME CYBERMEDIA Media",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.primetimemedia.in/logo.png"
      }
    },
    "description": article.subtitle || article.content.substring(0, 150)
  };

  return (
    <div className="bg-[var(--background)] min-h-screen py-8 relative overflow-hidden transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "/" },
          { name: section.charAt(0).toUpperCase() + section.slice(1), item: `/Pages/${section}` },
          { name: article.title, item: `/Pages/${section}/${category}/${article.slug}` }
        ]}
      />
      <div className="max-w-[1200px] mx-auto px-5 relative z-[1]">
        <Breadcrumb
          section={section}
          category={category}
          title={article.title}
        />

        <div className="grid grid-cols-[1fr_350px] gap-8 mt-5 lg:grid-cols-1 lg:gap-10">
          <div className="bg-white p-10 md:p-6 rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 transition-all duration-300 cubic-bezier(0.4,0,0.2,1)">
            <ArticleHeader article={article} />
            <ArticleContent content={article.content} summary={article.subtitle} />
            <RelatedArticles articles={relatedArticles} />
            {article.tags && article.tags.length > 0 && (
              <ArticleTags tags={article.tags} />
            )}

            {(article.category?.toUpperCase() === "AWARDS" || section?.toUpperCase() === "AWARDS") && (
              <div className="flex flex-wrap gap-4 my-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 sm:flex-col sm:p-4">
                {article.targetLink && (
                  <a
                    href={article.targetLink.startsWith('http') ? article.targetLink : `https://${article.targetLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] sm:w-full flex items-center justify-center gap-2.5 p-3.5 bg-white text-gray-800 border-2 border-gray-200 rounded-[16px] font-bold no-underline uppercase text-xs tracking-wider transition-all duration-300 hover:bg-gray-100 hover:border-gray-300 hover:-translate-y-0.5"
                  >
                    <span>Visit More Info</span>
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}
                {article.nominationLink && (
                  <a
                    href={article.nominationLink.startsWith('http') ? article.nominationLink : `https://${article.nominationLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] sm:w-full flex items-center justify-center gap-2.5 p-3.5 bg-linear-to-br from-[#dc2626] to-[#b91c1c] text-white rounded-[16px] font-bold no-underline uppercase text-xs tracking-wider shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:brightness-105 active:translate-y-0"
                  >
                    <span>Submit Nomination</span>
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
            <div className="my-6 py-4 border-y border-gray-200">
              <SocialShare
                url={typeof window !== 'undefined' ? window.location.href : `https://www.primetimemedia.in/Pages/${article.section}/${article.category}/${article.slug}`}
                title={article.title}
                description={article.subtitle}
                image={article.image}
                isArticle={true}
              />
              <div className="my-8 p-6 bg-gray-50 rounded-[24px] border border-gray-100 shadow-sm transition-all duration-300 hover:border-[#dc2626] hover:shadow-md">
                {article.authorId ? (
                  <div className="flex items-center gap-6 sm:flex-col sm:text-center sm:gap-4">
                    <div className="flex-shrink-0 w-[90px] h-[90px] sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-white shadow-md">
                      <img
                        src={article.authorId.ProfilePicture || '/default-avatar.png'}
                        alt={article.authorId.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="block text-[11px] uppercase tracking-wider text-gray-500 mb-1 font-semibold">Published By</span>
                      <h4 className="text-xl font-extrabold m-0 text-gray-900 font-['Lora',serif]">{article.authorId.name}</h4>
                      <p className="text-sm text-[#dc2626] font-semibold m-0">{article.authorId.designation || 'Senior Editor'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Published by:</span>
                    <span className="text-sm font-bold text-gray-900">{article.author || 'TIME CYBERMEDIA News'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:grid lg:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] lg:gap-6">
            <SidebarAds count={4} />
            <TopNewsSidebar news={topNews} />
            {recommendedStories && recommendedStories.length > 0 && (
              <RecommendedStories stories={recommendedStories} />
            )}
          </aside>
        </div>

        <MoreStoriesSection
          sectionTitle={`MORE FROM ${section.toUpperCase()}`}
          overrideSection={section}
        />
      </div>
    </div>
  );
}