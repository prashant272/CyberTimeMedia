'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsItem {
  id: string;
  image: string;
  title: string;
  slug: string;
}

interface ScheduleMatch {
  id: string;
  team1: string;
  team2: string;
  team1Flag: string;
  team2Flag: string;
  venue: string;
  date: string;
  matchNumber: string;
  group: string;
}

interface PointsTableTeam {
  team: string;
  m: number;
  w: number;
  l: number;
  nr: number;
  nrr: string;
  pts: number;
}

const newsData: NewsItem[] = [
  {
    id: '1',
    image: '/images/mayank-yadav.jpg',
    title: 'Mayank Yadav set to return in T20 World Cup warm-ups, Tilak Varma, Riyan Parag set to be cleared soon',
    slug: 'mayank-yadav-t20-world-cup-return'
  },
  {
    id: '2',
    image: '/images/kamindu-mendis.jpg',
    title: 'Why is Kamindu Mendis dropped from T20 World Cup 2026? Sri Lanka captain Dasun Shanaka answers',
    slug: 'kamindu-mendis-dropped-t20-world-cup'
  },
  {
    id: '3',
    image: '/images/t20-trophy.jpg',
    title: 'T20 World Cup 2026 warm up matches schedule confirmed, two Indian teams to play',
    slug: 't20-world-cup-warm-up-schedule'
  },
  {
    id: '4',
    image: '/images/rohit-sharma.jpg',
    title: 'Rohit Sharma wants India to play both Varun Chakravarthy, Kuldeep Yadav in T20 World Cup',
    slug: 'rohit-sharma-varun-kuldeep-t20'
  },
  {
    id: '5',
    image: '/images/icc-pakistan.jpg',
    title: "ICC's massive U-turn set to shock Pakistan amid T20 World Cup boycott row, Bangladesh on standby",
    slug: 'icc-pakistan-t20-world-cup-boycott'
  },
  {
    id: '6',
    image: '/images/ajinkya-rahane.jpg',
    title: "'He plays that high-risk game: Ajinkya Rahane advises India to prepare around star batter ahead of T20 WC 2026",
    slug: 'ajinkya-rahane-india-t20-advice'
  },
  {
    id: '7',
    image: '/images/pcb-secretary.jpg',
    title: "Former PCB secretary questions Board's 'purpose' for Pakistan's potential T20 World Cup pull out",
    slug: 'pcb-pakistan-t20-world-cup-pullout'
  },
  {
    id: '8',
    image: '/images/west-indies-retirement.jpg',
    title: 'Disappointed with T20 World Cup snub, West Indies cricketer hints at retirement from international cricket',
    slug: 'west-indies-t20-retirement'
  },
  {
    id: '9',
    image: '/images/italy-ireland.jpg',
    title: 'Italy, ranked 29th in ICC T20I rankings, upset Ireland ahead of T20 World Cup 2026',
    slug: 'italy-upset-ireland-t20'
  }
];

const pointsTableData = {
  groupA: [
    { team: 'PAK', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'IND', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'NED', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'USA', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'NAM', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 }
  ],
  groupB: [
    { team: 'AUS', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'IRE', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'SL', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'ZIM', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'OMA', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 }
  ],
  groupC: [
    { team: 'SCO', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'WI', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'ENG', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'NEP', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'ITA', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 }
  ],
  groupD: [
    { team: 'NZ', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'UAE', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'SA', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'BAN', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 },
    { team: 'PNG', m: 0, w: 0, l: 0, nr: 0, nrr: '0', pts: 0 }
  ]
};

const scheduleData: ScheduleMatch[] = [
  {
    id: '1',
    team1: 'Pakistan',
    team2: 'Netherlands',
    team1Flag: '/flags/pak.png',
    team2Flag: '/flags/ned.png',
    venue: 'Sinhalese Sports Club Ground, Sri Lanka',
    date: '07 Feb, 2026',
    matchNumber: '1st Match',
    group: 'Group A'
  },
  {
    id: '2',
    team1: 'West Indies',
    team2: 'Scotland',
    team1Flag: '/flags/wi.png',
    team2Flag: '/flags/sco.png',
    venue: 'Eden Gardens, India',
    date: '07 Feb, 2026',
    matchNumber: '2nd Match',
    group: 'Group C'
  }
];

const T20WorldCupSection: React.FC = () => {
  const [scheduleTab, setScheduleTab] = useState<'current' | 'upcoming' | 'recent'>('upcoming');

  return (
    <section className="bg-linear-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] py-12 px-8 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_30%,rgba(255,68,68,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,153,0,0.06)_0%,transparent_50%),radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.03)_0%,transparent_60%)] before:pointer-events-none before:animate-pulse-slow after:absolute after:inset-0 after:bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.01)_2px,rgba(255,255,255,0.01)_4px)] after:pointer-events-none">
      <div className="max-w-[1400px] mx-auto relative z-[1]">
        <div className="flex items-center gap-3.5 mb-8 relative after:content-[''] after:flex-1 after:h-0.5 after:bg-linear-to-r after:from-orange-500/50 after:to-transparent after:ml-5">
          <div className="w-2.5 h-2.5 bg-linear-to-br from-[#ff4444] to-[#ff9900] rounded-full shadow-[0_0_20px_rgba(255,153,0,0.9),0_0_40px_rgba(255,68,68,0.5)] animate-pulse relative before:content-[''] before:absolute before:-inset-0.75 before:rounded-full before:border-2 before:border-orange-500/30 before:animate-ping"></div>
          <h2 className="text-3xl font-extrabold text-[#ffffff] m-0 tracking-widest text-shadow-orange bg-linear-to-br from-white to-[#ffd700] bg-clip-text text-transparent uppercase">T20 CRICKET WORLD CUP 2026</h2>
        </div>

        <div className="grid grid-cols-[1fr_400px] gap-7 lg:grid-cols-1">
          <div className="flex flex-col gap-6">
            <div className="group bg-white/4 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 cubic-bezier(0.4,0,0.2,1) relative before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-0.75 before:bg-linear-to-r before:from-transparent before:via-orange-500/50 before:to-transparent before:opacity-0 hover:before:opacity-100 hover:-translate-y-1.5 hover:scale-[1.01] hover:shadow-[0_16px_36px_rgba(255,68,68,0.25),0_0_0_1px_rgba(255,153,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-orange-500/40 hover:bg-white/6">
              <div className="relative w-full aspect-video overflow-hidden bg-linear-to-br from-[#1a1a2e]/95 to-[#16213e]/95">
                <Image
                  src="/images/ravi-shastri-india.jpg"
                  alt="Ravi Shastri India T20"
                  fill
                  className="object-cover transition-all duration-700 cubic-bezier(0.4,0,0.2,1) group-hover:scale-[1.08] group-hover:brightness-110"
                />
              </div>
              <div className="p-6 bg-black/75 backdrop-blur-md transition-colors duration-400 group-hover:bg-black/85">
                <h3 className="text-[21px] font-bold leading-normal text-[#f8f8f8] m-0 text-shadow-md">
                  'Very explosive': Ravi Shastri makes bold claim around team India ahead of T20 World Cup 2026
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4.5 md:grid-cols-1">
              {newsData.slice(0, 6).map((news, index) => (
                <Link
                  key={news.id}
                  href={`/cricket/${news.slug}`}
                  className="group bg-white/4 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-[0_3px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 cubic-bezier(0.4,0,0.2,1) animate-in-fade-up opacity-0 relative before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange-500/50 before:to-transparent before:opacity-0 hover:before:opacity-100 after:content-[''] after:absolute after:inset-0 after:rounded-xl after:p-px after:bg-linear-to-br after:from-orange-500/0 after:to-orange-500/30 hover:after:opacity-100 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_14px_28px_rgba(255,68,68,0.22),0_0_0_1px_rgba(255,153,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-orange-500/40 hover:bg-white/6"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-linear-to-br from-[#1a1a2e]/95 to-[#16213e]/95">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-all duration-600 cubic-bezier(0.4,0,0.2,1) group-hover:scale-110 group-hover:brightness-115"
                    />
                  </div>
                  <p className="text-[13px] font-semibold leading-relaxed text-white/90 m-0 p-4 line-clamp-2 transition-all duration-300 group-hover:text-[#ff9900]">{news.title}</p>
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4.5 md:grid-cols-1">
              {newsData.slice(6).map((news, index) => (
                <Link
                  key={news.id}
                  href={`/cricket/${news.slug}`}
                  className="group bg-white/4 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-[0_3px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-500 cubic-bezier(0.4,0,0.2,1) animate-in-fade-up opacity-0 relative before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange-500/50 before:to-transparent before:opacity-0 hover:before:opacity-100 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-[0_14px_28px_rgba(255,68,68,0.22),0_0_0_1px_rgba(255,153,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-orange-500/40 hover:bg-white/6"
                  style={{ animationDelay: `${(index + 6) * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-linear-to-br from-[#1a1a2e]/95 to-[#16213e]/95">
                    <Image
                      src={news.image}
                      alt={news.title}
                      fill
                      className="object-cover transition-all duration-600 cubic-bezier(0.4,0,0.2,1) group-hover:scale-110 group-hover:brightness-115"
                    />
                  </div>
                  <p className="text-[13px] font-semibold leading-relaxed text-white/90 m-0 p-4 line-clamp-2 transition-all duration-300 group-hover:text-[#ff9900]">{news.title}</p>
                </Link>
              ))}
            </div>

            <button className="self-end inline-flex items-center gap-3 px-8 py-3.5 bg-linear-to-br from-red-500/15 to-orange-500/15 border-2 border-orange-500/30 rounded-xl text-[#ff9900] text-[13px] font-bold uppercase tracking-widest cursor-pointer transition-all duration-500 cubic-bezier(0.4,0,0.2,1) relative overflow-hidden shadow-[0_4px_15px_rgba(255,153,0,0.2)] before:absolute before:inset-y-0 before:-left-full before:w-full before:bg-linear-to-r before:from-transparent before:via-white/15 before:to-transparent before:transition-[left] before:duration-600 hover:before:left-full hover:bg-linear-to-br hover:from-red-500/25 hover:to-orange-500/25 hover:border-orange-500/50 hover:text-[#ffd700] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,153,0,0.4)]">
              <span>Read More</span>
              <svg className="w-5 h-5 transition-transform duration-400 group-hover:translate-x-1.5" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="mt-7">
              <div className="flex items-center gap-3.5 mb-6 after:content-[''] after:flex-1 after:h-0.5 after:bg-linear-to-r after:from-orange-500/40 after:to-transparent after:ml-4">
                <div className="w-2.5 h-2.5 bg-linear-to-br from-[#ff4444] to-[#ff9900] rounded-full shadow-[0_0_20px_rgba(255,153,0,0.9)] animate-pulse"></div>
                <h3 className="text-[26px] font-extrabold text-[#ffffff] m-0 tracking-wide text-shadow-orange bg-linear-to-br from-white to-[#ffd700] bg-clip-text text-transparent uppercase">SCHEDULE</h3>
              </div>

              <div className="flex gap-3.5 border-b-2 border-white/10 mb-6 pb-0.5">
                <button
                  className={`px-7 py-3 bg-white/3 backdrop-blur-md border border-white/10 border-b-0 rounded-t-xl text-xs font-bold uppercase tracking-widest transition-all duration-400 cubic-bezier(0.4,0,0.2,1) relative ${scheduleTab === 'current' ? 'text-[#ffd700] bg-orange-500/15 border-orange-500/40 shadow-[0_4px_12px_rgba(255,153,0,0.2)] before:content-[""] before:absolute before:bottom-[-2px] before:inset-x-0 before:h-1 before:bg-linear-to-r before:from-[#ff4444] before:via-[#ff9900] before:to-[#ffd700] before:shadow-[0_0_16px_rgba(255,153,0,0.7)]' : 'text-white/65 cursor-pointer hover:text-[#ff9900] hover:bg-orange-500/10 hover:border-orange-500/25 hover:-translate-y-0.5'}`}
                  onClick={() => setScheduleTab('current')}
                >
                  CURRENT
                </button>
                <button
                  className={`px-7 py-3 bg-white/3 backdrop-blur-md border border-white/10 border-b-0 rounded-t-xl text-xs font-bold uppercase tracking-widest transition-all duration-400 cubic-bezier(0.4,0,0.2,1) relative ${scheduleTab === 'upcoming' ? 'text-[#ffd700] bg-orange-500/15 border-orange-500/40 shadow-[0_4px_12px_rgba(255,153,0,0.2)] before:content-[""] before:absolute before:bottom-[-2px] before:inset-x-0 before:h-1 before:bg-linear-to-r before:from-[#ff4444] before:via-[#ff9900] before:to-[#ffd700] before:shadow-[0_0_16px_rgba(255,153,0,0.7)]' : 'text-white/65 cursor-pointer hover:text-[#ff9900] hover:bg-orange-500/10 hover:border-orange-500/25 hover:-translate-y-0.5'}`}
                  onClick={() => setScheduleTab('upcoming')}
                >
                  UPCOMING
                </button>
                <button
                  className={`px-7 py-3 bg-white/3 backdrop-blur-md border border-white/10 border-b-0 rounded-t-xl text-xs font-bold uppercase tracking-widest transition-all duration-400 cubic-bezier(0.4,0,0.2,1) relative ${scheduleTab === 'recent' ? 'text-[#ffd700] bg-orange-500/15 border-orange-500/40 shadow-[0_4px_12px_rgba(255,153,0,0.2)] before:content-[""] before:absolute before:bottom-[-2px] before:inset-x-0 before:h-1 before:bg-linear-to-r before:from-[#ff4444] before:via-[#ff9900] before:to-[#ffd700] before:shadow-[0_0_16px_rgba(255,153,0,0.7)]' : 'text-white/65 cursor-pointer hover:text-[#ff9900] hover:bg-orange-500/10 hover:border-orange-500/25 hover:-translate-y-0.5'}`}
                  onClick={() => setScheduleTab('recent')}
                >
                  RECENT
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {scheduleData.map((match, index) => (
                  <div
                    key={match.id}
                    className="group bg-white/4 backdrop-blur-2xl border border-white/10 rounded-xl p-4.5 transition-all duration-500 cubic-bezier(0.4,0,0.2,1) shadow-[0_3px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] animate-in-fade-up opacity-0 relative before:content-[''] before:absolute before:top-0 before:inset-x-0 before:h-0.5 before:bg-linear-to-r before:from-transparent before:via-orange-500/50 before:to-transparent before:opacity-0 hover:before:opacity-100 after:content-[''] after:absolute after:left-0 after:top-1/2 after:-translate-y-1/2 after:w-0 after:h-3/5 after:bg-linear-to-b after:from-[#ff4444] after:to-[#ff9900] after:rounded-r after:transition-[width] after:duration-400 hover:translate-x-1.5 hover:shadow-[0_10px_24px_rgba(255,68,68,0.2),0_0_0_1px_rgba(255,153,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)] hover:border-orange-500/40 hover:bg-white/6 hover:after:w-1"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                  >
                    <div className="flex flex-col gap-3">
                      <p className="text-[11px] text-white/65 m-0 leading-relaxed">
                        {match.matchNumber}, {match.group}, {match.venue} <span className="text-[#ff9900] font-bold transition-colors duration-300 group-hover:text-[#ffd700]">{match.date}</span>
                      </p>
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                          <Image
                            src={match.team1Flag}
                            alt={match.team1}
                            width={20}
                            height={20}
                            className="rounded border border-orange-500/30 shadow-md"
                          />
                          <span className="text-sm font-bold text-[#f8f8f8] text-shadow-sm">{match.team1}</span>
                        </div>
                        <div className="flex items-center gap-3 transition-transform duration-300 hover:translate-x-1">
                          <Image
                            src={match.team2Flag}
                            alt={match.team2}
                            width={20}
                            height={20}
                            className="rounded border border-orange-500/30 shadow-md"
                          />
                          <span className="text-sm font-bold text-[#f8f8f8] text-shadow-sm">{match.team2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
              <Image
                src="/images/swadeshi-ad.jpg"
                alt="Advertisement"
                fill
                className="object-cover"
              />
              <span className="absolute top-3 right-3 bg-black/80 text-white/75 px-3 py-1.5 text-[10px] rounded-md backdrop-blur-md font-semibold tracking-wider">Advertisement</span>
            </div>

            <div className="bg-white/4 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="bg-linear-to-br from-[#003a70] to-[#00509e] p-4 text-center relative after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-0.5 after:bg-linear-to-r after:from-transparent after:via-orange-500/60 after:to-transparent">
                <h3 className="text-sm font-extrabold text-white m-0 tracking-wider uppercase text-shadow-md">ICC MENS T20 WORLD CUP POINTS TABLE</h3>
              </div>

              <div className="grid grid-cols-[2fr_repeat(6,1fr)] gap-2.5 p-3.5 bg-linear-to-br from-[#003a70] to-[#00509e] border-b-2 border-orange-500/40">
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-shadow-sm">TEAMS</span>
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center text-shadow-sm">M</span>
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center text-shadow-sm">W</span>
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center text-shadow-sm">L</span>
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center text-shadow-sm">NR</span>
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center text-shadow-sm">NRR</span>
                <span className="text-[11px] font-extrabold text-white uppercase tracking-wider text-center text-shadow-sm">PTS</span>
              </div>

              {Object.entries(pointsTableData).map(([groupKey, teams], groupIndex) => (
                <div key={groupKey} className="border-b border-white/10 last:border-none">
                  <div className="bg-linear-to-r from-blue-900/50 to-transparent p-2 text-[10px] font-black text-[#ff9900] tracking-widest pl-4 uppercase">
                    GROUP {String.fromCharCode(65 + groupIndex)}
                  </div>
                  {teams.map((team, index) => (
                    <div key={team.team} className="grid grid-cols-[2fr_repeat(6,1fr)] gap-2.5 p-3.5 border-b border-white/5 last:border-none transition-colors duration-200 hover:bg-white/5">
                      <span className="text-[11px] font-extrabold text-[#ffd700] tracking-wider">{team.team}</span>
                      <span className="text-[11px] font-bold text-white/80 text-center">{team.m}</span>
                      <span className="text-[11px] font-bold text-white/80 text-center">{team.w}</span>
                      <span className="text-[11px] font-bold text-white/80 text-center">{team.l}</span>
                      <span className="text-[11px] font-bold text-white/80 text-center">{team.nr}</span>
                      <span className="text-[11px] font-bold text-white/80 text-center">{team.nrr}</span>
                      <span className="text-[11px] font-bold text-white/80 text-center">{team.pts}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default T20WorldCupSection;
