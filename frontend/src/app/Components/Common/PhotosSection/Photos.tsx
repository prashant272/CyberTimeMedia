"use client"
import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

const categories = ['India', 'Sports', 'Entertainment', 'World', 'Fashion', 'Lifestyle'];

const photoData = [
  {
    id: '1',
    category: 'Lifestyle',
    title: "Things to do in Mumbai today that don't feel touristy",
    image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=500&q=80',
  },
  {
    id: '2',
    category: 'India',
    title: "Ajit Pawar dies: Here's everything you need to know about plane crash in pics",
    image: 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=500&q=80',
  },
  {
    id: '3',
    category: 'Lifestyle',
    title: "From ice skating to nature walks: 7 boredom-proof things to do in Gurgaon (Gurugram)",
    image: 'https://images.unsplash.com/photo-1547990158-947754378170?w=500&q=80',
  },
  {
    id: '4',
    category: 'Fashion & Lifestyle',
    title: "Heart Evangelista to Victoria Beckham: The best-dressed stars at Paris Couture Fashion Week 2026",
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=80',
  },
  {
    id: '5',
    category: 'India',
    title: "Arjun MBT, Bhairav Battalions and more: India displays its military might on Republic Day | In Pics",
    image: 'https://images.unsplash.com/photo-1532375811409-905115c3b381?w=500&q=80',
  }
];

export const PhotosSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('India');

  return (
    <section className="bg-[#f8fafc] py-16 px-8 md:px-6 sm:px-4 relative overflow-hidden transition-colors duration-300 after:absolute after:left-1/2 after:top-0 after:h-full after:w-[1px] after:-translate-x-1/2 after:bg-gradient-to-b after:from-transparent after:via-[#e2e8f0] after:to-transparent after:pointer-events-none">
      <div className="max-w-[1400px] mx-auto relative z-[1]">
        <h2 className="text-center font-['Lora',serif] text-[clamp(2rem,5vw,2.5rem)] font-bold mb-6 text-[#0f172a] tracking-tight transition-colors duration-300">Photos</h2>

        <nav className="flex justify-center gap-2 flex-wrap mb-8 p-3 bg-white rounded-full border border-[#e2e8f0] shadow-sm max-w-fit mx-auto transition-all duration-300">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-6 py-2.5 bg-transparent border border-transparent rounded-full font-['Inter',sans-serif] font-medium text-[0.9375rem] text-[#334155] cursor-pointer transition-all duration-300 cubic-bezier(0.4,0,0.2,1) tracking-wide whitespace-nowrap hover:bg-[#dc2626]/[0.05] hover:border-[#dc2626] hover:text-[#dc2626] hover:-translate-y-px ${activeTab === cat ? 'bg-[#dc2626]/[0.05] border-[#dc2626] text-[#dc2626] font-semibold shadow-sm' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
            {photoData.map((photo) => (
              <div key={photo.id} className="group bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-sm cursor-pointer transition-all duration-300 cubic-bezier(0.4,0,0.2,1) relative hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#dc2626] after:absolute after:top-0 after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#dc2626] after:to-[#7c3aed] after:opacity-0 after:transition-opacity after:duration-300 after:z-[2] hover:after:opacity-100">
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f1f5f9]">
                  <img src={photo.image} alt={photo.title} className="w-full h-full object-cover transition-transform duration-500 cubic-bezier(0.4,0,0.2,1) group-hover:scale-[1.08]" />
                  <div className="absolute bottom-2 left-2 z-[1]">
                    <div className="bg-[rgba(239,68,68,0.95)] p-2 rounded-md flex items-center justify-center shadow-[0_2px_8px_rgba(239,68,68,0.4)] transition-all duration-300 cubic-bezier(0.4,0,0.2,1) group-hover:bg-[#dc2626] group-hover:scale-110">
                      <ImageIcon size={16} color="white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[#dc2626] font-['Inter',sans-serif] font-semibold text-[0.75rem] block mb-2 uppercase tracking-wider transition-colors duration-300">{photo.category}</span>
                  <h3 className="font-['Lora',serif] text-[0.9375rem] font-semibold leading-[1.4] text-[#0f172a] line-clamp-2 transition-colors duration-300 tracking-tight group-hover:text-[#dc2626]">{photo.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <button className="relative inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] border border-[#dc2626] rounded-full font-['Inter',sans-serif] font-semibold text-base text-white cursor-pointer transition-all duration-300 cubic-bezier(0.4,0,0.2,1) shadow-[0_4px_16px_rgba(59,130,246,0.25)] overflow-hidden before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-[100%] hover:from-[#b91c1c] hover:to-[#dc2626] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.35)] active:translate-y-0">
            View All <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};