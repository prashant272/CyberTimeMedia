const newsSources = [

    // ═══════════════════════════════════════════════
    // HOME (Top Stories - India)
    // ═══════════════════════════════════════════════
    {
        name: "NDTV - Top Stories",
        url: "https://feeds.feedburner.com/ndtvnews-top-stories",
        category: "home",
    },
    {
        name: "The Hindu - Front Page",
        url: "https://www.thehindu.com/feeder/default.rss",
        category: "home",
    },
    {
        name: "Times of India - Top Stories",
        url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
        category: "home",
    },
    {
        name: "Hindustan Times - India",
        url: "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml",
        category: "home",
    },
    {
        name: "India Today - Top",
        url: "https://news.google.com/rss/search?q=site:indiatoday.in&hl=en-IN&gl=IN&ceid=IN:en",
        category: "home",
    },

    // ═══════════════════════════════════════════════
    // INDIA (National News)
    // ═══════════════════════════════════════════════
    {
        name: "The Hindu - National",
        url: "https://www.thehindu.com/news/national/feeder/default.rss",
        category: "india",
    },
    {
        name: "NDTV - India News",
        url: "https://feeds.feedburner.com/ndtvnews-india-news",
        category: "india",
    },
    {
        name: "India Today - India",
        url: "https://news.google.com/rss/search?q=india+politics+government+site:indiatoday.in&hl=en-IN&gl=IN&ceid=IN:en",
        category: "india",
    },
    {
        name: "Wire - India",
        url: "https://thewire.in/rss",
        category: "india",
    },
    {
        name: "Press Trust of India",
        url: "https://news.google.com/rss/search?q=india+news+site:ptinews.com&hl=en-IN&gl=IN&ceid=IN:en",
        category: "india",
    },
    {
        name: "Mint - India Policy",
        url: "https://www.livemint.com/rss/government-policy",
        category: "india",
    },

    // ═══════════════════════════════════════════════
    // SPORTS
    // ═══════════════════════════════════════════════
    {
        name: "ESPN - International Sports",
        url: "https://www.espn.com/espn/rss/news",
        category: "sports",
    },
    {
        name: "Cricbuzz - Cricket",
        url: "https://news.google.com/rss/search?q=cricket+IPL+ICC+BCCI&hl=en-IN&gl=IN&ceid=IN:en",
        category: "sports",
    },
    {
        name: "NDTV Sports",
        url: "https://feeds.feedburner.com/ndtvnews-sports",
        category: "sports",
    },
    {
        name: "The Hindu - Sports",
        url: "https://www.thehindu.com/sport/feeder/default.rss",
        category: "sports",
    },
    {
        name: "BBC Sport",
        url: "http://feeds.bbci.co.uk/sport/rss.xml",
        category: "sports",
    },
    {
        name: "Sky Sports - Latest",
        url: "https://news.google.com/rss/search?q=football+tennis+f1+sports+site:skysports.com",
        category: "sports",
    },

    // ═══════════════════════════════════════════════
    // BUSINESS
    // ═══════════════════════════════════════════════
    {
        name: "Bloomberg - Business",
        url: "https://news.google.com/rss/search?q=business+markets+economy+site:bloomberg.com",
        category: "business",
    },
    {
        name: "Reuters - Business",
        url: "https://feeds.reuters.com/reuters/businessNews",
        category: "business",
    },
    {
        name: "Financial Times",
        url: "https://news.google.com/rss/search?q=economy+finance+markets+site:ft.com",
        category: "business",
    },
    {
        name: "Mint - Markets",
        url: "https://www.livemint.com/rss/markets",
        category: "business",
    },
    {
        name: "Economic Times - Economy",
        url: "https://economictimes.indiatimes.com/rssfeedstopstories.cms",
        category: "business",
    },
    {
        name: "CNBC - Business",
        url: "https://https://news.google.com/rss/search?q=stocks+markets+economy+site:cnbc.com",
        category: "business",
    },
    {
        name: "Business Standard",
        url: "https://news.google.com/rss/search?q=india+business+economy+site:business-standard.com&hl=en-IN&gl=IN&ceid=IN:en",
        category: "business",
    },

    // ═══════════════════════════════════════════════
    // ENTERTAINMENT
    // ═══════════════════════════════════════════════
    {
        name: "Variety - Entertainment",
        url: "https://variety.com/feed/",
        category: "entertainment",
    },
    {
        name: "The Hollywood Reporter",
        url: "https://www.hollywoodreporter.com/feed/",
        category: "entertainment",
    },
    {
        name: "Deadline - Hollywood",
        url: "https://deadline.com/feed/",
        category: "entertainment",
    },
    {
        name: "Bollywood Hungama",
        url: "https://news.google.com/rss/search?q=bollywood+movies+OTT+celebrities&hl=en-IN&gl=IN&ceid=IN:en",
        category: "entertainment" ,
    },
    {
        name: "Filmfare - Bollywood",
        url: "https://news.google.com/rss/search?q=site:filmfare.com+bollywood&hl=en-IN&gl=IN&ceid=IN:en",
        category: "entertainment",
    },
    {
        name: "Entertainment Weekly",
        url: "https://news.google.com/rss/search?q=movies+TV+shows+celebrities+entertainment",
        category: "entertainment",
    },

    // ═══════════════════════════════════════════════
    // LIFESTYLE / FASHION
    // ═══════════════════════════════════════════════
    {
        name: "Vogue - Fashion",
        url: "https://www.vogue.com/feed/rss",
        category: "lifestyle",
    },
    {
        name: "GQ - Style",
        url: "https://www.gq.com/feed/rss",
        category: "lifestyle",
    },
    {
        name: "Harper's Bazaar",
        url: "https://news.google.com/rss/search?q=fashion+style+beauty+lifestyle+site:harpersbazaar.com",
        category: "lifestyle",
    },
    {
        name: "Elle - Fashion",
        url: "https://news.google.com/rss/search?q=fashion+style+beauty+lifestyle+site:elle.com",
        category: "lifestyle",
    },
    {
        name: "Femina India",
        url: "https://news.google.com/rss/search?q=fashion+lifestyle+beauty+india+site:femina.in&hl=en-IN&gl=IN&ceid=IN:en",
        category: "lifestyle",
    },

    // ═══════════════════════════════════════════════
    // WORLD - Europe
    // ═══════════════════════════════════════════════
    {
        name: "BBC News - Europe",
        url: "http://feeds.bbci.co.uk/news/world/europe/rss.xml",
        category: "world",
        subCategory: "Europe",
    },
    {
        name: "Reuters - Europe",
        url: "https://news.google.com/rss/search?q=europe+news+politics&hl=en&gl=GB&ceid=GB:en",
        category: "world",
        subCategory: "Europe",
    },
    {
        name: "Euronews",
        url: "https://news.google.com/rss/search?q=europe+news+site:euronews.com",
        category: "world",
        subCategory: "Europe",
    },

    // ═══════════════════════════════════════════════
    // WORLD - USA
    // ═══════════════════════════════════════════════
    {
        name: "AP News - USA",
        url: "https://rsshub.app/apnews/topics/apf-topnews",
        category: "world",
        subCategory: "USA",
    },
    {
        name: "CNN - USA",
        url: "http://rss.cnn.com/rss/edition_us.rss",
        category: "world",
        subCategory: "USA",
    },
    {
        name: "Washington Post",
        url: "https://news.google.com/rss/search?q=usa+america+white+house+trump+site:washingtonpost.com",
        category: "world",
        subCategory: "USA",
    },
    {
        name: "New York Times - World",
        url: "https://news.google.com/rss/search?q=usa+politics+news+site:nytimes.com",
        category: "world",
        subCategory: "USA",
    },

    // ═══════════════════════════════════════════════
    // WORLD - Africa
    // ═══════════════════════════════════════════════
    {
        name: "BBC Africa",
        url: "http://feeds.bbci.co.uk/news/world/africa/rss.xml",
        category: "world",
        subCategory: "Africa",
    },
    {
        name: "Al Jazeera - Africa",
        url: "https://news.google.com/rss/search?q=africa+news+site:aljazeera.com",
        category: "world",
        subCategory: "Africa",
    },
    {
        name: "Reuters - Africa",
        url: "https://news.google.com/rss/search?q=africa+news+economy",
        category: "world",
        subCategory: "Africa",
    },

    // ═══════════════════════════════════════════════
    // WORLD - Asia
    // ═══════════════════════════════════════════════
    {
        name: "BBC Asia",
        url: "http://feeds.bbci.co.uk/news/world/asia/rss.xml",
        category: "world",
        subCategory: "Asia",
    },
    {
        name: "Reuters - Asia",
        url: "https://news.google.com/rss/search?q=asia+news+china+japan+korea",
        category: "world",
        subCategory: "Asia",
    },
    {
        name: "South China Morning Post",
        url: "https://news.google.com/rss/search?q=asia+china+site:scmp.com",
        category: "world",
        subCategory: "Asia",
    },

    // ═══════════════════════════════════════════════
    // WORLD - Middle East
    // ═══════════════════════════════════════════════
    {
        name: "Al Jazeera - Middle East",
        url: "https://www.aljazeera.com/xml/rss/all.xml",
        category: "world",
        subCategory: "Middle East",
    },
    {
        name: "BBC - Middle East",
        url: "http://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
        category: "world",
        subCategory: "Middle East",
    },
    {
        name: "Reuters - Middle East",
        url: "https://news.google.com/rss/search?q=middle+east+iran+israel+palestine+news",
        category: "world",
        subCategory: "Middle East",
    },

    // ═══════════════════════════════════════════════
    // WORLD - General (India's angle)
    // ═══════════════════════════════════════════════
    {
        name: "United Nations News",
        url: "https://news.un.org/feed/subscribe/en/news/all/rss.xml",
        category: "world",
    },
    {
        name: "The Hindu - World",
        url: "https://www.thehindu.com/news/international/feeder/default.rss",
        category: "world",
    },
    {
        name: "Aaj Tak - Latest",
        url: "https://www.aajtak.in/rss/news-update",
        category: "india",
    },
    {
        name: "Zee News - India",
        url: "https://zeenews.india.com/rss/india-national-news.xml",
        category: "india",
    },
    {
        name: "News18 - India",
        url: "https://www.news18.com/rss/india.xml",
        category: "india",
    },
    {
        name: "WION - World",
        url: "https://www.wionews.com/rss-feeds",
        category: "world",
    },
    {
        name: "Firstpost - Latest",
        url: "https://www.firstpost.com/rss/news.xml",
        category: "home",
    },
    {
        name: "Deccan Herald - National",
        url: "https://www.deccanherald.com/national/feeder/default.rss",
        category: "india",
    }
];

module.exports = newsSources;
