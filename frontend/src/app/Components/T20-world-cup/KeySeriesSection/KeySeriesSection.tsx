'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface TeamInfo {
  code: string;
  name: string;
  flag: string;
  score?: string;
}

interface MatchCard {
  id: string;
  isLive: boolean;
  category: string;
  title: string;
  venue: string;
  team1: TeamInfo;
  team2: TeamInfo;
  matchStatus: string;
  startTime?: string;
}

const allMatchesData: MatchCard[] = [
  {
    id: '1',
    isLive: true,
    category: 'ICC Under 19 World Cup',
    title: 'Afghanistan Under-19s vs Ireland Under-19s, 9th Match Super Six Group I, Harare',
    venue: 'Harare',
    team1: {
      code: 'AFG-U19',
      name: 'Afghanistan',
      flag: '/flags/afg.png',
      score: '114/3 (23.2 ov)'
    },
    team2: {
      code: 'IRE-U19',
      name: 'Ireland',
      flag: '/flags/ire.png'
    },
    matchStatus: 'Afghanistan Under-19s elected to bat'
  },
  {
    id: '2',
    isLive: true,
    category: 'ICC Under 19 World Cup',
    title: 'New Zealand Under-19s vs England Under-19s, 10th Match Super Six Group II, Queens',
    venue: 'Queens',
    team1: {
      code: 'NZ-U19',
      name: 'New Zealand',
      flag: '/flags/nz.png'
    },
    team2: {
      code: 'ENG-U19',
      name: 'England',
      flag: '/flags/eng.png',
      score: '102/2 (23.5 ov)'
    },
    matchStatus: 'New Zealand Under-19s elected to bowl'
  },
  {
    id: '3',
    isLive: false,
    category: "Women's Premier League",
    title: 'Gujarat Giants Women vs Mumbai Indians Women, Match 19, Kotambi Stadium, India',
    venue: 'Kotambi Stadium, India',
    team1: {
      code: 'GG-W',
      name: 'Gujarat Giants',
      flag: '/teams/gg.png'
    },
    team2: {
      code: 'MI-W',
      name: 'Mumbai Indians',
      flag: '/teams/mi.png'
    },
    matchStatus: '',
    startTime: 'Match Starts 30 January, 2026 19:30 IST'
  },
  {
    id: '4',
    isLive: false,
    category: "Women's Premier League",
    title: 'Delhi Capitals Women vs Uttar Pradesh Warriors Women, Match 20, Kotambi Stadium, India',
    venue: 'Kotambi Stadium, India',
    team1: {
      code: 'DC-W',
      name: 'Delhi Capitals',
      flag: '/teams/dc.png'
    },
    team2: {
      code: 'UPW-W',
      name: 'UP Warriors',
      flag: '/teams/upw.png'
    },
    matchStatus: '',
    startTime: 'Match Starts 01 February, 2026 19:30 IST'
  },
  {
    id: '5',
    isLive: false,
    category: 'New Zealand tour of India',
    title: 'India vs New Zealand, 3rd T20I, Eden Gardens, Kolkata',
    venue: 'Eden Gardens, Kolkata',
    team1: {
      code: 'IND',
      name: 'India',
      flag: '/flags/ind.png'
    },
    team2: {
      code: 'NZ',
      name: 'New Zealand',
      flag: '/flags/nz.png'
    },
    matchStatus: '',
    startTime: 'Match Starts 02 February, 2026 19:00 IST'
  },
  {
    id: '6',
    isLive: false,
    category: "ICC Men's T20 World Cup",
    title: 'India vs Pakistan, Group Stage, Dubai International Stadium',
    venue: 'Dubai',
    team1: {
      code: 'IND',
      name: 'India',
      flag: '/flags/ind.png'
    },
    team2: {
      code: 'PAK',
      name: 'Pakistan',
      flag: '/flags/pak.png'
    },
    matchStatus: '',
    startTime: 'Match Starts 15 March, 2026 19:30 IST'
  }
];

const KeySeriesSection: React.FC = () => {
  const categories = [
    "Women's Premier League",
    'New Zealand tour of India',
    'ICC Under 19 World Cup',
    "ICC Men's T20 World Cup"
  ];

  const [activeTab, setActiveTab] = useState(0);

  const filteredMatches = allMatchesData.filter(
    match => match.category === categories[activeTab]
  );

  const displayMatches = filteredMatches.length > 0 ? filteredMatches : allMatchesData.slice(0, 4);

  return (
    <section className="bg-linear-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] py-10 px-8 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,rgba(255,68,68,0.06)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,153,0,0.05)_0%,transparent_50%)] before:pointer-events-none after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_2px,rgba(255,255,255,0.01)_4px)] after:pointer-events-none">
      <div className="max-w-[1400px] mx-auto relative z-[1]">
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-2 h-2 bg-linear-to-br from-[#ff4444] to-[#ff9900] rounded-full shadow-[0_0_16px_rgba(255,153,0,0.8)] animate-pulse"></div>
            <h2 className="text-[28px] font-bold text-white m-0 tracking-wide">Key Series</h2>
          </div>
          <div className="flex gap-2.5 flex-wrap border-b-2 border-white/10 pb-0.5 overflow-x-auto scrollbar-hide">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4.5 py-2.5 bg-white/2 backdrop-blur-lg border border-white/10 border-b-0 rounded-t-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-400 cubic-bezier(0.4,0,0.2,1) relative ${activeTab === index ? 'text-[#ffd700] bg-orange-500/12 border-orange-500/30 before:content-[""] before:absolute before:bottom-[-2px] before:inset-x-0 before:h-[3px] before:bg-linear-to-r before:from-[#ff4444] before:via-[#ff9900] before:to-[#ffd700] before:shadow-[0_0_12px_rgba(255,153,0,0.6)]' : 'text-white/60 cursor-pointer hover:text-[#ff9900] hover:bg-orange-500/8 hover:border-orange-500/20'}`}
                onClick={() => setActiveTab(index)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mb-10">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4 pr-15 md:grid-cols-1 md:pr-0">
            {displayMatches.map((match, index) => (
              <div
                key={match.id}
                className="group bg-white/3 backdrop-blur-2xl border border-white/10 rounded-xl p-4 transition-all duration-400 cubic-bezier(0.4,0,0.2,1) shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)] animate-in-fade-up opacity-0 relative cursor-pointer overflow-hidden hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(255,68,68,0.18),0_0_0_1px_rgba(255,153,0,0.25),inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-orange-500/30 hover:bg-white/5 hover:after:content-[''] hover:after:absolute hover:after:top-1/2 hover:after:left-1/2 hover:after:w-[250px] hover:after:h-[250px] hover:after:bg-[radial-gradient(circle,rgba(255,153,0,0.1),transparent_70%)] hover:after:rounded-full hover:after:-translate-x-1/2 hover:after:-translate-y-1/2 hover:after:transition-all hover:after:duration-600 after:pointer-events-none"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="flex justify-between items-center mb-3 gap-2.5 relative z-[1]">
                  <span className="text-[9px] font-bold text-[#ff9900] uppercase tracking-wider bg-linear-to-br from-orange-500/15 to-red-500/10 border border-orange-500/25 px-2.5 py-1 rounded-md transition-all duration-300 group-hover:bg-linear-to-br group-hover:from-orange-500/20 group-hover:to-red-500/15 group-hover:border-orange-500/40 line-height-[1.3] white-space-nowrap">
                    {match.category}
                  </span>
                  {match.isLive && (
                    <span className="flex items-center gap-1.5 bg-linear-to-br from-red-600 to-red-600/90 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-md tracking-wider uppercase backdrop-blur-lg shadow-[0_2px_10px_rgba(255,0,0,0.5)] line-height-[1.3]">
                      <span className="animate-pulse text-[9px]">●</span>
                      LIVE
                    </span>
                  )}
                </div>

                <p className="text-xs text-white/70 mb-3.5 leading-relaxed line-clamp-2 relative z-[1]">{match.title}</p>

                <div className="flex flex-col gap-0 mb-3 relative z-[1]">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-orange-500/30 flex items-center justify-center bg-white/5 shadow-md flex-shrink-0 transition-all duration-300 group-hover:border-orange-500/50 group-hover:shadow-orange-500/30">
                        <Image
                          src={match.team1.flag}
                          alt={match.team1.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[13px] font-bold text-[#f8f8f8] tracking-wide">{match.team1.code}</span>
                    </div>
                    {match.team1.score && (
                      <span className="text-sm font-bold text-[#ff9900] drop-shadow-[0_0_8px_rgba(255,153,0,0.3)]">{match.team1.score}</span>
                    )}
                  </div>

                  <div className="h-px bg-linear-to-r from-transparent via-orange-500/20 to-transparent"></div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-orange-500/30 flex items-center justify-center bg-white/5 shadow-md flex-shrink-0 transition-all duration-300 group-hover:border-orange-500/50 group-hover:shadow-orange-500/30">
                        <Image
                          src={match.team2.flag}
                          alt={match.team2.name}
                          width={24}
                          height={24}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[13px] font-bold text-[#f8f8f8] tracking-wide">{match.team2.code}</span>
                    </div>
                    {match.team2.score && (
                      <span className="text-sm font-bold text-[#ff9900] drop-shadow-[0_0_8px_rgba(255,153,0,0.3)]">{match.team2.score}</span>
                    )}
                  </div>
                </div>

                {match.matchStatus && (
                  <div className="flex gap-2 items-start py-2.5 border-t border-white/5 relative z-[1]">
                    <div className="w-[2.5px] min-h-[14px] flex-shrink-0 bg-linear-to-b from-orange-500/60 to-red-500/40 rounded-sm mt-0.5"></div>
                    <p className="text-[11px] text-white/70 m-0 leading-relaxed flex-1">{match.matchStatus}</p>
                  </div>
                )}
                {match.startTime && (
                  <div className="flex gap-2 items-start py-2.5 border-t border-white/5 relative z-[1]">
                    <div className="w-[2.5px] min-h-[14px] flex-shrink-0 bg-linear-to-b from-orange-500/60 to-red-500/40 rounded-sm mt-0.5"></div>
                    <p className="text-[11px] text-[#ff9900] font-semibold m-0 leading-relaxed flex-1">{match.startTime}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-linear-to-br from-red-500/15 to-orange-500/15 border border-orange-500/25 rounded-full flex items-center justify-center cursor-pointer transition-all duration-400 cubic-bezier(0.4,0,0.2,1) text-[#ff9900] backdrop-blur-xl md:hidden hover:bg-linear-to-br hover:from-red-500/20 hover:to-orange-500/20 hover:border-orange-500/40 hover:text-[#ffd700] hover:scale-110 hover:shadow-[0_8px_20px_rgba(255,153,0,0.4)] overflow-hidden before:absolute before:inset-y-0 before:-left-full before:w-full before:bg-linear-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-[left] before:duration-500 hover:before:left-full" aria-label="Next matches">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="group w-full rounded-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,153,0,0.2)] relative transition-all duration-400 hover:shadow-[0_12px_32px_rgba(255,153,0,0.25),0_0_0_1px_rgba(255,153,0,0.4)] hover:-translate-y-1">
          <div className="absolute -inset-0.5 bg-linear-to-br from-red-500/30 to-orange-500/30 blur-2xl opacity-0 transition-opacity duration-400 -z-[1] group-hover:opacity-100"></div>
          <Image
            src="/images/t20-world-cup-2026.jpg"
            alt="T20 World Cup 2026"
            width={1400}
            height={200}
            className="w-full h-auto block"
          />
        </div>
      </div>
    </section>
  );
};

export default KeySeriesSection;
