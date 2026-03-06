import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Story {
  id: string | number;
  title: string;
  image: string;
  slug: string;
  section: string;
  category: string;
}

interface RecommendedStoriesProps {
  stories: Story[];
}

export default function RecommendedStories({ stories }: RecommendedStoriesProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-[24px] p-6 mb-6 shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all duration-300">
      <h2 className="relative font-['Lora',serif] text-xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-transparent bg-linear-to-r bg-no-repeat bg-[length:60px_2px] bg-left-bottom from-[#dc2626] to-[#b91c1c] uppercase tracking-wider transition-colors duration-300 before:absolute before:left-0 before:bottom-[-2px] before:w-1.5 before:h-1.5 before:bg-linear-to-br before:from-[#dc2626] before:to-[#b91c1c] before:rounded-full before:shadow-[0_0_8px_#dc2626] before:animate-pulse">RECOMMENDED STORIES</h2>
      <div className="flex flex-col gap-4">
        {stories.map((story, index) => (
          <Link
            key={story.id}
            href={`/Pages/${story.section || 'india'}/${story.category || 'general'}/${story.slug}`}
            className="group relative flex gap-3 pb-4 border-b border-gray-100 last:border-none last:pb-0 transition-all duration-300 cubic-bezier(0.4,0,0.2,1) hover:translate-x-1.5 before:absolute before:-inset-x-6 before:-inset-y-2 before:bg-gray-50 before:opacity-0 before:transition-opacity before:duration-300 before:rounded-[12px] hover:before:opacity-100"
          >
            <div className="relative flex-shrink-0 w-20 h-15 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 transition-colors duration-300 group-hover:border-transparent">
              <Image
                src={story.image}
                alt={story.title}
                width={80}
                height={60}
                className="w-full h-full object-cover transition-transform duration-500 cubic-bezier(0.4,0,0.2,1) group-hover:scale-110"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 flex items-center justify-center bg-black/75 text-white font-['Inter',sans-serif] text-[11px] font-bold rounded shadow-sm backdrop-blur-[4px] transition-all duration-300 group-hover:bg-linear-to-br group-hover:from-[#dc2626] group-hover:to-[#b91c1c]">{index + 1}</span>
            </div>
            <h3 className="relative font-['Lora',serif] text-sm font-semibold leading-relaxed text-gray-800 line-clamp-3 tracking-tight transition-colors duration-300 group-hover:text-[#dc2626]">{story.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
