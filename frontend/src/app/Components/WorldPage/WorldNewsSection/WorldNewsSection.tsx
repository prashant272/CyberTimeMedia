import React from 'react';

const NewsSection: React.FC = () => {
  return (
    <div className="bg-[var(--background)] min-h-screen py-10 transition-colors duration-300">
      <section className="max-w-[1400px] mx-auto px-8 md:px-4">
        <div className="flex flex-col gap-5 mb-8 border-b border-[var(--border)] pb-6">
          <h2 className="font-['Lora',serif] text-4xl font-black text-[var(--heading-color)] relative before:content-[''] before:absolute before:bottom-[-2px] before:left-0 before:w-16 before:h-1 before:bg-linear-to-r before:from-[var(--primary)] before:to-[var(--accent)] before:rounded-full">India</h2>
          <nav className="flex flex-wrap gap-3">
            {['Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Delhi', 'Bihar', 'Madhya Pradesh', 'Rajasthan', 'Haryana', 'Chhattisgarh'].map(cat => (
              <span key={cat} className="px-4 py-1.5 bg-[var(--muted)] text-[var(--text-color)] text-xs font-bold rounded-full border border-[var(--border)] transition-all duration-300 hover:bg-[var(--primary)] hover:text-white hover:border-transparent cursor-pointer uppercase tracking-wider">{cat}</span>
            ))}
          </nav>
        </div>
        <div className="grid grid-cols-[1fr_380px] gap-8 lg:grid-cols-1">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
            <NewsCard image="/path-to-crash.jpg" title="'Runway was not in sight...': Crew to ATC moments before Ajit Pawar's plane crashed in Baramati" />
            <NewsCard image="/path-to-bandh.jpg" title="Odisha Bandh highlights: Normal life disrupted, NNKS workers block Puri-Bhubaneswar road" />
            <NewsCard image="/path-to-ajit.jpg" title="Ajit Pawar dies at 66, Mamata Banerjee demands probe into Baramati plane crash" />
            <NewsCard image="/path-to-summit.jpg" title="India-EU Summit yields 13 major agreements: From historic FTA to green energy" />
            <NewsCard image="/path-to-clash.jpg" title="Jharkhand: 15 people, 4 policemen injured as violent clash erupts in Ramgarh" />
            <NewsCard image="/path-to-odisha.jpg" title="Odisha Bandh today: Are schools, colleges, banks, govt offices closed?" />
          </div>
          <aside className="flex flex-col gap-8">
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-[var(--muted-foreground)] text-xs font-bold tracking-[0.2em] border border-dashed border-[var(--border)] rounded-xl uppercase">ADVERTISEMENT</div>
            <h3 className="font-['Lora',serif] text-2xl font-bold text-[var(--heading-color)] border-l-4 border-[var(--primary)] pl-4">Top News</h3>
            <div className="group flex gap-3 p-3 bg-[var(--muted)] rounded-lg transition-all duration-300 hover:bg-[var(--nav-hover-bg)] cursor-pointer">
              <p className="flex-1 font-['Inter',sans-serif] font-semibold text-xs text-[var(--text-color)] leading-relaxed group-hover:text-[var(--primary)] transition-colors duration-300">Ajit Pawar death: Devendra Fadnavis expresses grief, announces mourning</p>
              <img src="/thumb1.jpg" alt="thumb" className="w-20 h-14 rounded object-cover flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="group flex gap-3 p-3 bg-[var(--muted)] rounded-lg transition-all duration-300 hover:bg-[var(--nav-hover-bg)] cursor-pointer">
              <p className="flex-1 font-['Inter',sans-serif] font-semibold text-xs text-[var(--text-color)] leading-relaxed group-hover:text-[var(--primary)] transition-colors duration-300">Ajit Pawar plane crash: Supriya Sule and Parth reach Baramati | Video</p>
              <img src="/thumb2.jpg" alt="thumb" className="w-20 h-14 rounded object-cover flex-shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105" />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
};

const NewsCard = ({ image, title }: any) => (
  <div className="group bg-[var(--card-bg)] rounded-xl overflow-hidden border border-[var(--card-border)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer">
    <img src={image} alt="news" className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
    <p className="p-4 font-['Inter',sans-serif] font-bold text-sm text-[var(--heading-color)] leading-snug group-hover:text-[var(--primary)] transition-colors duration-300">{title}</p>
  </div>
);

export default NewsSection;