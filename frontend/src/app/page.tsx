"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Navbar from "./Components/Common/Navbar/Navbar";
import HeroBanner from "./Components/Home/HeroBanner/HeroBanner";
import LatestNews from "./Components/Home/LatestNewsSection/LatestNews";
import Sports from "./Components/Home/SportsNewsSection/SportsNews";
import Entertainment from "./Components/Home/EntertainmentNewsSection/EntertainmentNews";
import Footer from "./Components/Common/Footer/Footer";
import NewsCards from "./Components/Common/NewsCard/NewsCard";
import { stateNewsData } from "@/Data/NewsCardData/NewsCardData";
import SocialShare from "./Components/Common/SocialShare/SocialShare";

// Lazy-load heavy sections
const VideosSection = dynamic(() => import("./Components/Common/VideosSection/VideosSection").then(mod => mod.VideosSection), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl m-8" />,
  ssr: false
});

const LifestyleSection = dynamic(() => import("./Components/Home/Lifestyle/LifestyleSection"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-xl m-8" />,
  ssr: false
});

export default function Home() {
  return (
    <>
      <HeroBanner />

      <LatestNews />

      <Sports />
      <Entertainment />

      <VideosSection />

      <LifestyleSection />

      <SocialShare
        url={typeof window !== 'undefined' ? window.location.href : 'https://www.timecybermedia.com'}
        title="Time Cyber Media - Latest Breaking News, Tech & Global Excellence Awards"
        description="Stay updated with Time Cyber Media (Time Media / Cyber Media) for real-time news, political analysis, business insights, and global excellence awards."
        image="/logo.png"
        isArticle={false}
      />
    </>
  );
}
