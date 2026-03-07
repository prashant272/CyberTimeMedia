import React, { useMemo, useEffect } from 'react';
import { useActiveAds } from '@/app/hooks/useAds';

interface ArticleContentProps {
  content: string;
  summary?: string;
}

export default function ArticleContent({ content, summary }: ArticleContentProps) {
  const { data: ads } = useActiveAds();
  const [currentAdIndex, setCurrentAdIndex] = React.useState(0);

  const inArticleAds = useMemo(() => {
    if (!ads) return [];
    return ads.filter(ad => ad.isActive && (ad.headerImageUrl || ad.placement === 'in-article' || ad.placement === 'header'));
  }, [ads]);

  useEffect(() => {
    if (inArticleAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentAdIndex(prev => (prev + 1) % inArticleAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [inArticleAds.length]);

  const contentWithAds = useMemo(() => {
    if (!content) return null;

    const contentClasses = "bg-white py-4 relative overflow-hidden transition-colors duration-300 font-['Inter',sans-serif] leading-[1.85] text-gray-800 text-[1.125rem] tracking-tight selection:bg-[#fecaca] [&_p]:mb-7 [&_p]:text-justify [&_p]:hyphens-auto md:[&_p]:text-[1.05rem] md:[&_p]:leading-relaxed md:[&_p]:text-left [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:text-[4.5rem] [&_p:first-of-type::first-letter]:leading-none [&_p:first-of-type::first-letter]:font-bold [&_p:first-of-type::first-letter]:mr-3 [&_p:first-of-type::first-letter]:text-[#dc2626] [&_p:first-of-type::first-letter]:font-['Lora',serif] [&_p:first-of-type::first-letter]:uppercase [&_h1]:font-['Lora',serif] [&_h1]:text-gray-900 [&_h1]:mt-10 lg:[&_h1]:mt-14 [&_h1]:mb-6 [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-[clamp(1.75rem,5vw,2.75rem)] [&_h2]:font-['Lora',serif] [&_h2]:text-gray-900 [&_h2]:mt-10 lg:[&_h2]:mt-14 [&_h2]:mb-6 [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:tracking-tight [&_h2]:text-[clamp(1.5rem,4vw,2.25rem)] [&_h2]:border-b-2 [&_h2]:border-gray-100 [&_h2]:pb-3 [&_h2]:relative [&_h2::after]:content-[''] [&_h2::after]:absolute [&_h2::after]:bottom-[-2px] [&_h2::after]:left-0 [&_h2::after]:w-20 [&_h2::after]:h-0.5 [&_h2::after]:bg-[#dc2626] [&_h3]:font-['Lora',serif] [&_h3]:text-gray-900 [&_h3]:mt-10 lg:[&_h3]:mt-14 [&_h3]:mb-6 [&_h3]:font-bold [&_h3]:leading-tight [&_h3]:tracking-tight [&_h3]:text-[clamp(1.25rem,3.5vw,1.75rem)] [&_h4]:font-['Lora',serif] [&_h4]:text-gray-900 [&_h4]:mt-10 lg:[&_h4]:mt-14 [&_h4]:mb-6 [&_h4]:font-bold [&_h4]:leading-tight [&_h4]:tracking-tight [&_h4]:text-[1.25rem] md:[&_h4]:text-[1.35rem] [&_a]:text-[#dc2626] [&_a]:underline [&_a]:decoration-1.5 [&_a]:underline-offset-3 [&_a]:font-medium [&_a]:transition-all [&_a]:duration-300 hover:[&_a]:text-[#b91c1c] hover:[&_a]:decoration-[#b91c1c] hover:[&_a]:bg-[#fef2f2] hover:[&_a]:rounded hover:[&_a]:px-0.5 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-[16px] md:[&_img]:rounded-[24px] [&_img]:my-8 md:[&_img]:my-12 [&_img]:shadow-xl [&_img]:block [&_img]:mx-auto [&_img]:border [&_img]:border-gray-100 [&_img]:transition-transform [&_img]:duration-500 hover:[&_img]:-translate-y-1 [&_figure]:my-10 md:[&_figure]:my-14 [&_figure]:text-center [&_figcaption]:text-[0.85rem] md:[&_figcaption]:text-[0.9rem] [&_figcaption]:text-gray-500 [&_figcaption]:mt-4 [&_figcaption]:italic [&_figcaption]:px-4 md:[&_figcaption]:px-8 [&_figcaption]:leading-relaxed [&_figcaption::before]:content-['▲_'] [&_figcaption::before]:text-[0.7rem] [&_figcaption::before]:text-[#dc2626] [&_ul]:my-6 md:[&_ul]:my-8 [&_ul]:bg-gray-50 [&_ul]:p-5 md:[&_ul]:p-8 [&_ul]:rounded-2xl [&_ul]:border [&_ul]:border-dashed [&_ul]:border-gray-200 [&_ul]:list-none [&_ul_li]:mb-4 [&_ul_li]:relative [&_ul_li]:pl-6 [&_ul_li::before]:content-['→'] [&_ul_li::before]:absolute [&_ul_li::before]:left-0 [&_ul_li::before]:text-[#dc2626] [&_ul_li::before]:font-bold [&_ol]:my-6 md:[&_ol]:my-8 [&_ol]:bg-gray-50 [&_ol]:p-5 md:[&_ol]:p-8 [&_ol]:rounded-2xl [&_ol]:border [&_ol]:border-dashed [&_ol]:border-gray-200 [&_ol]:list-decimal [&_ol_li]:mb-4 [&_ol_li]:font-medium [&_ol_li]:pl-2 [&_ol_li::marker]:text-[#dc2626] [&_ol_li::marker]:font-bold [&_blockquote]:my-10 md:[&_blockquote]:my-14 [&_blockquote]:p-6 sm:[&_blockquote]:p-10 md:[&_blockquote]:p-12 [&_blockquote]:bg-[#fef2f2] [&_blockquote]:border-l-[5px] [&_blockquote]:border-[#dc2626] [&_blockquote]:rounded-r-[16px] md:[&_blockquote]:rounded-r-[24px] [&_blockquote]:relative [&_blockquote::before]:content-['\"'] [&_blockquote::before]:absolute [&_blockquote::before]:top-0 [&_blockquote::before]:left-4 [&_blockquote::before]:text-[4rem] md:[&_blockquote::before]:text-[5rem] [&_blockquote::before]:font-['Lora',serif] [&_blockquote::before]:text-[#dc2626] [&_blockquote::before]:opacity-15 [&_blockquote::before]:leading-none [&_blockquote_p]:m-0 [&_blockquote_p]:italic [&_blockquote_p]:font-['Lora',serif] [&_blockquote_p]:text-[1.125rem] sm:[&_blockquote_p]:text-[1.25rem] md:[&_blockquote_p]:text-[1.35rem] [&_blockquote_p]:leading-relaxed [&_blockquote_p]:text-gray-800 [&_strong]:font-bold [&_strong]:text-gray-900 [&_strong]:bg-linear-to-r [&_strong]:from-[#fca5a5]/30 [&_strong]:to-[#fca5a5]/30 [&_strong]:bg-no-repeat [&_strong]:bg-[length:100%_0.3em] [&_strong]:bg-[0_88%] [&_b]:font-bold [&_b]:text-gray-900 [&_b]:bg-linear-to-r [&_b]:from-[#fca5a5]/30 [&_b]:to-[#fca5a5]/30 [&_b]:bg-no-repeat [&_b]:bg-[length:100%_0.3em] [&_b]:bg-[0_88%] [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-[#dc2626] [&_code]:border [&_code]:border-gray-200 [&_pre]:bg-[#1e293b] [&_pre]:text-[#e2e8f0] [&_pre]:p-5 md:[&_pre]:p-6 [&_pre]:rounded-xl md:[&_pre]:rounded-2xl [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:font-mono [&_pre]:text-[0.8rem] md:[&_pre]:text-[0.9rem] [&_pre]:leading-relaxed [&_pre]:border [&_pre]:border-white/10";

    const articleSummary = summary ? (
      <div className="mb-8 md:mb-10 p-6 sm:p-8 md:p-10 bg-linear-to-br from-gray-50 to-white rounded-[20px] md:rounded-[24px] border-l-4 border-l-[#dc2626] border-y border-r border-y-gray-100 border-r-gray-100 relative overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-gray-100/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-3 mb-5 relative z-10">
          <div className="w-8 h-[2px] bg-[#dc2626]"></div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#dc2626] font-['Inter',sans-serif]">Quick Read</span>
        </div>
        <p className="font-['Inter',sans-serif] text-[1.15rem] leading-[1.8] text-gray-800 font-medium relative z-10 m-0">
          {summary}
        </p>
      </div>
    ) : null;

    if (inArticleAds.length === 0) {
      return (
        <div className={contentClasses}>
          {articleSummary}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    const paragraphs = content.split('</p>');
    if (paragraphs.length <= 2) {
      return <div className={contentClasses} dangerouslySetInnerHTML={{ __html: content }} />;
    }

    const midPoint = Math.floor(paragraphs.length / 2);
    const firstHalf = paragraphs.slice(0, midPoint).join('</p>') + '</p>';
    const secondHalf = paragraphs.slice(midPoint).join('</p>');

    const ad = inArticleAds[currentAdIndex];

    return (
      <div className={contentClasses}>
        {articleSummary}
        <div dangerouslySetInnerHTML={{ __html: firstHalf }} />

        <div className="my-12 p-6 bg-black/[0.02] rounded-xl border border-black/[0.05] flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="text-[0.7rem] font-bold text-[#bbb] tracking-widest uppercase">ADVERTISEMENT</div>
          <div className="w-full max-w-[800px] animate-in-slide-right" key={currentAdIndex}>
            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-[1.01]">
              <img src={ad.headerImageUrl || ad.imageUrl} alt={ad.title} className="w-full h-auto block" />
            </a>
          </div>
        </div>

        <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
      </div>
    );
  }, [content, inArticleAds, currentAdIndex]);

  return contentWithAds;
}
