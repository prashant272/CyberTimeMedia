import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Common/Navbar/Navbar";
import Footer from "./Components/Common/Footer/Footer";
import WhatsAppButton from "./Components/Common/WhatsAppButton/WhatsAppButton";
import { NewsProvider } from "./context/NewsContext";
import { UserProvider } from "./Dashboard/Context/ManageUserContext";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";

import ConditionalLayout from "./Components/Common/ConditionalLayout";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.timecybermedia.com"),
  title: {
    default: "Time Cyber Media - Latest Breaking News, Global Updates & Excellence Awards",
    template: "%s | Time Cyber Media",
  },
  description: "Time Cyber Media is Asia's leading media house, providing trusted news coverage in politics, business, technology, and entertainment. We are also known for organizing prestigious corporate and healthcare awards.",
  keywords: [
    "Time Cyber Media",
    "Time Media",
    "Cyber Media",
    "Time Cyber",
    "Cyber Time",
    "Time Media Cyber",
    "Media Cyber Time",
    "TC Media",
    "Time Cyber News",
    "Cyber News Portal",
    "Time News Network",
    "International Healthcare Awards",
    "Corporate Excellence Awards India",
    "Asia Leading Media House",
    "Breaking News India",
    "Latest Global News Today",
    "Business and Tech Updates",
    "International Education Awards",
    "India Brand Icon Awards",
    "News Portal India",
    "Real-time News Coverage",
    "Time Cyber Media Awards",
    "Digital Media Asia",
    "timecybermedia.com",
    "www.timecybermedia.com",
  ],
  authors: [{ name: "Time Cyber Media Editorial Team" }],
  publisher: "Time Cyber Media Pvt. Ltd.",
  category: "news",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Time Cyber Media - Asia's Leading News & Awards Platform",
    description: "Your trusted destination for live breaking news and global award ceremonies. Stay informed with Time Cyber Media.",
    url: "https://www.timecybermedia.com/",
    siteName: "Time Cyber Media",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Time Cyber Media - Truth in Every Story",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Time Cyber Media - Global News & Excellence Awards",
    description: "Stay updated with the latest in politics, business, and prestige awards only on Time Cyber Media.",
    images: ["/og-image.jpg"],
    site: "@TimeCyberMedia",
  },
  alternates: {
    canonical: "https://www.timecybermedia.com",
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.timecybermedia.com/#website",
        "url": "https://www.timecybermedia.com",
        "name": "Time Cyber Media",
        "description": "Asia's leading media house and awards organization.",
        "publisher": {
          "@id": "https://www.timecybermedia.com/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.timecybermedia.com/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        },
        "inLanguage": "en-IN"
      },
      {
        "@type": "NewsMediaOrganization",
        "@id": "https://www.timecybermedia.com/#organization",
        "name": "Time Cyber Media",
        "alternateName": "Time Cyber News",
        "url": "https://www.timecybermedia.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.timecybermedia.com/logo.png",
          "width": 192,
          "height": 192
        },
        "sameAs": [
          "https://www.facebook.com/TimeCyberMedia/",
          "https://twitter.com/timecybermedia"
        ],
        "description": "Providing trusted news and organizing prestigious global excellence awards.",
        "foundingDate": "2020",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "C-31, Nawada Housing Complex",
          "addressLocality": "New Delhi",
          "postalCode": "110059",
          "addressCountry": "IN"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "editorial",
          "email": "info@timecybermedia.com",
          "url": "https://www.timecybermedia.com/Contact"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.timecybermedia.com/#webpage",
        "url": "https://www.timecybermedia.com",
        "name": "Time Cyber Media - News & Excellence Awards",
        "isPartOf": {
          "@id": "https://www.timecybermedia.com/#website"
        },
        "description": "Latest breaking news and information about international awards.",
        "breadcrumb": {
          "@id": "https://www.timecybermedia.com/#breadcrumb"
        },
        "inLanguage": "en-IN",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": [
              "https://www.timecybermedia.com"
            ]
          }
        ]
      }
    ]
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5571209076881303" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#f8fafc] text-[#0f172a] min-h-screen transition-colors duration-300`}
      >
        <ThemeProvider>
          <NewsProvider>
            <UserProvider>
              <ToastContainer />
              <ConditionalLayout>
                <main>
                  {children}
                </main>
              </ConditionalLayout>
            </UserProvider>
          </NewsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
