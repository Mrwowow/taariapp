// Mock data layer for TAARi prototype
// In production, this would be replaced with Sanity CMS queries

export interface City {
  name: string;
  slug: string;
  heroImage: string;
  description: string;
  storyCount: number;
}

export interface Author {
  name: string;
  slug: string;
  avatar: string;
  bio: string;
  socialLinks: { platform: string; url: string }[];
}

export interface Article {
  title: string;
  slug: string;
  featuredImage: string;
  gallery: string[];
  excerpt: string;
  body: string[];
  author: Author;
  city: City;
  categories: string[];
  isSponsored: boolean;
  publishedAt: string;
  readTime: number;
}

export interface Interview {
  title: string;
  slug: string;
  portrait: string;
  name: string;
  bio: string;
  city: City;
  oneLiner: string;
  questions: { question: string; answer: string }[];
  publishedAt: string;
}

export interface Reel {
  id: string;
  title: string;
  caption: string;
  thumbnail: string;
  city: City;
  publishedAt: string;
}

export interface Sponsor {
  name: string;
  logo: string;
  tagline: string;
  url: string;
}

// --- CITIES ---
export const cities: City[] = [
  {
    name: "Atlanta",
    slug: "atlanta",
    heroImage: "https://images.unsplash.com/photo-1575917649111-0cee4245f818?w=1920&q=80",
    description: "Atlanta has long been the heartbeat of Black culture in America. From the corridors of Spelman and Morehouse to the studios of Trap Music Museum, the city pulses with creative energy that reverberates across the globe.",
    storyCount: 12,
  },
  {
    name: "Houston",
    slug: "houston",
    heroImage: "https://images.unsplash.com/photo-1530089711124-9ca31fb9e863?w=1920&q=80",
    description: "Houston's Third Ward and beyond — a sprawling metropolis where African, Caribbean, and Southern cultures converge to create something entirely new.",
    storyCount: 8,
  },
  {
    name: "Toronto",
    slug: "toronto",
    heroImage: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1920&q=80",
    description: "From Little Jamaica to the vibrant arts scene of Queen West, Toronto's diaspora community is redefining what it means to be African in the North.",
    storyCount: 15,
  },
  {
    name: "London",
    slug: "london",
    heroImage: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1920&q=80",
    description: "From Peckham to Brixton, London's African and Caribbean communities have shaped the cultural landscape of the city for generations — and a new wave is rising.",
    storyCount: 10,
  },
  {
    name: "New York",
    slug: "new-york",
    heroImage: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&q=80",
    description: "Harlem, Brooklyn, the Bronx — New York's diaspora communities are the beating heart of a city that never sleeps, driving art, music, and culture forward.",
    storyCount: 20,
  },
];

// --- AUTHORS ---
export const authors: Author[] = [
  {
    name: "Amara Okafor",
    slug: "amara-okafor",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&q=80",
    bio: "Writer & photographer based in London. Covering diaspora culture since 2019.",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
  },
  {
    name: "David Williams",
    slug: "david-williams",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&q=80",
    bio: "Houston-born storyteller exploring identity, community, and resilience across the diaspora.",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
  },
  {
    name: "Kemi Mensah",
    slug: "kemi-mensah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80",
    bio: "Art critic and cultural journalist based in New York. Former editor at Afropunk.",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
  },
  {
    name: "James Adeyemi",
    slug: "james-adeyemi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80",
    bio: "Toronto-based journalist and filmmaker documenting immigrant experiences across Canada.",
    socialLinks: [
      { platform: "Instagram", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
  },
];

// --- ARTICLES ---
export const articles: Article[] = [
  {
    title: "The Sound of the New South",
    slug: "the-sound-of-the-new-south",
    featuredImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
      "https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&q=80",
    ],
    excerpt: "A visual journey through Atlanta's creative pulse and musical heritage that continues to shape global culture.",
    body: [
      "The rhythm of Atlanta carries through every corner of the city, from the underground venues of East Atlanta Village to the grand stages of the Fox Theatre. It's a sound that's both deeply rooted and constantly evolving.",
      "For generations, Atlanta has been the crucible where African American musical traditions meet innovation. The city that gave us Outkast, T.I., and a generation of trap pioneers continues to push boundaries.",
      "Walking through the streets of Old Fourth Ward, you can hear the future being composed in home studios, barbershops, and community centers. The sound is unmistakable — it's Atlanta.",
      "\"Music here isn't just sound — it's a language of survival and celebration,\" says local producer Marcus Cole, whose studio has become a gathering place for emerging artists from across the diaspora.",
      "The city's creative infrastructure has grown exponentially, with new venues, labels, and collectives emerging every month. But what makes Atlanta special isn't just the industry — it's the community that sustains it.",
    ],
    author: authors[0],
    city: cities[0],
    categories: ["Culture", "Music"],
    isSponsored: false,
    publishedAt: "2026-03-01",
    readTime: 8,
  },
  {
    title: "Bridging Continents: London's Diaspora Rewrites Culture",
    slug: "bridging-continents-londons-diaspora",
    featuredImage: "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=1920&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1514999037859-b1164c4e0a00?w=1200&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
    ],
    excerpt: "From Peckham to Brixton, a new generation is building bridges between cultures and redefining what it means to be African in London.",
    body: [
      "London has always been a city of convergence, but the latest generation of African and Caribbean creatives is taking that legacy to new heights.",
      "In the studios of Peckham, the galleries of Brixton, and the stages of Shoreditch, a cultural revolution is quietly unfolding — one that bridges the gap between heritage and innovation.",
      "\"We're not just preserving culture,\" says curator Adeola Bankole. \"We're creating something entirely new.\"",
    ],
    author: authors[0],
    city: cities[3],
    categories: ["Culture", "Art"],
    isSponsored: true,
    publishedAt: "2026-02-25",
    readTime: 6,
  },
  {
    title: "Market Stories: Kensington's Hidden Gems",
    slug: "market-stories-kensingtons-hidden-gems",
    featuredImage: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=1920&q=80",
    gallery: [],
    excerpt: "Inside the vibrant market stalls and food vendors that make Toronto's Kensington Market a diaspora crossroads.",
    body: [
      "Kensington Market is Toronto's cultural heartbeat — a maze of vintage shops, Caribbean bakeries, and African spice merchants that tells the story of the city's immigrant past and present.",
      "Every stall has a story. Every vendor carries generations of knowledge. This is where the diaspora doesn't just survive — it thrives.",
    ],
    author: authors[3],
    city: cities[2],
    categories: ["Food", "Community"],
    isSponsored: false,
    publishedAt: "2026-02-20",
    readTime: 5,
  },
  {
    title: "Third Ward Renaissance",
    slug: "third-ward-renaissance",
    featuredImage: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1920&q=80",
    gallery: [],
    excerpt: "Houston's historic Third Ward is experiencing a cultural rebirth, led by a new generation of artists and entrepreneurs.",
    body: [
      "The Third Ward is more than a neighborhood — it's a movement. Once the heart of Houston's Black community, it's now at the center of a creative renaissance.",
      "Young entrepreneurs are opening galleries, studios, and cafes that honor the neighborhood's history while pushing it forward.",
    ],
    author: authors[1],
    city: cities[1],
    categories: ["Community", "Art"],
    isSponsored: false,
    publishedAt: "2026-02-15",
    readTime: 5,
  },
  {
    title: "Harlem's New Art Wave",
    slug: "harlems-new-art-wave",
    featuredImage: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1920&q=80",
    gallery: [],
    excerpt: "A new generation of artists is transforming Harlem's galleries and streets into a canvas for diaspora expression.",
    body: [
      "Harlem has always been synonymous with Black art and culture. But the latest wave of creators is pushing the boundaries of what that means.",
      "From immersive installations to street art that tells the stories of migration and identity, Harlem's art scene is more vibrant than ever.",
    ],
    author: authors[2],
    city: cities[4],
    categories: ["Art", "Culture"],
    isSponsored: false,
    publishedAt: "2026-02-10",
    readTime: 7,
  },
  {
    title: "Diaspora Kitchen: Flavors Without Borders",
    slug: "diaspora-kitchen-flavors-without-borders",
    featuredImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80",
    gallery: [],
    excerpt: "How chefs across the diaspora are fusing traditional African flavors with global culinary techniques.",
    body: [
      "In kitchens from Atlanta to London, a new generation of chefs is reimagining African cuisine for the global palate.",
      "These aren't fusion experiments — they're acts of cultural preservation, innovation, and love.",
    ],
    author: authors[1],
    city: cities[0],
    categories: ["Food", "Culture"],
    isSponsored: false,
    publishedAt: "2026-02-05",
    readTime: 6,
  },
];

// --- INTERVIEWS ---
export const interviews: Interview[] = [
  {
    title: "A Conversation with Kwame Asante",
    slug: "kwame-asante",
    portrait: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    name: "Kwame Asante",
    bio: "Visual artist, community builder, and founder of The Bridge Collective in Atlanta's Old Fourth Ward.",
    city: cities[0],
    oneLiner: "Building bridges through art",
    questions: [
      {
        question: "What drew you to Atlanta as a creative base?",
        answer: "Atlanta has this energy that's hard to find anywhere else. There's a community here that lifts you up while pushing you forward. When I moved from Accra, I was looking for a place that felt like home but also challenged me to grow. Atlanta was that place."
      },
      {
        question: "How does the Diaspora influence your work?",
        answer: "Every piece I create is a conversation with my ancestors. I use traditional Kente patterns in my installations, but I reinterpret them through the lens of the American South. It's about bridging two worlds that are actually one."
      },
      {
        question: "What's next for The Bridge Collective?",
        answer: "We're launching a residency program for artists from the continent to come work in Atlanta for three months. The exchange goes both ways — our local artists will travel to Accra, Lagos, and Nairobi."
      },
    ],
    publishedAt: "2026-02-28",
  },
  {
    title: "A Conversation with Fatou Diallo",
    slug: "fatou-diallo",
    portrait: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80",
    name: "Fatou Diallo",
    bio: "Fashion designer and founder of Maison Fatou, blending Senegalese textiles with London streetwear.",
    city: cities[3],
    oneLiner: "Fashion is my language of protest",
    questions: [
      {
        question: "How did growing up between Dakar and London shape your aesthetic?",
        answer: "I grew up wearing my mother's hand-dyed fabrics to school in South London. Kids would laugh, then a few years later, those same prints were on the runway. That taught me that our culture is always ahead — the world just takes time to catch up."
      },
      {
        question: "What role does fashion play in the diaspora experience?",
        answer: "Fashion is identity made visible. When I design, I'm not just making clothes — I'm making armor. Every piece tells the wearer: you belong here, and you carry something powerful with you."
      },
    ],
    publishedAt: "2026-02-20",
  },
  {
    title: "A Conversation with Nia Thompson",
    slug: "nia-thompson",
    portrait: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    name: "Nia Thompson",
    bio: "Tech entrepreneur and founder of DiasporaTech, a startup incubator for Black-owned tech companies in Toronto.",
    city: cities[2],
    oneLiner: "The tech scene needs our voices",
    questions: [
      {
        question: "Why did you start DiasporaTech?",
        answer: "I was tired of being the only Black woman in the room. The tech scene in Toronto is booming, but it doesn't reflect the diversity of the city. DiasporaTech is about changing that — not just getting seats at the table, but building our own tables."
      },
      {
        question: "What challenges do diaspora founders face?",
        answer: "Access to capital is the biggest barrier. But it's also about networks. When you're first-generation, you don't have the same connections. That's what we're building — a community that opens doors for each other."
      },
    ],
    publishedAt: "2026-02-15",
  },
  {
    title: "A Conversation with Marcus Cole",
    slug: "marcus-cole",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    name: "Marcus Cole",
    bio: "Music producer and founder of Southside Studios, Atlanta's premier recording space for independent artists.",
    city: cities[0],
    oneLiner: "Every beat tells a story",
    questions: [
      {
        question: "How has Atlanta's music scene evolved?",
        answer: "The sound has always been here, but the infrastructure has changed. When I started, you had to go to a major label. Now, artists are building empires from their bedrooms. The democratization of music production has been revolutionary for the diaspora."
      },
    ],
    publishedAt: "2026-02-10",
  },
];

// --- REELS ---
export const reels: Reel[] = [
  {
    id: "1",
    title: "Street Sounds",
    caption: "The rhythm of Auburn Avenue at golden hour",
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
    city: cities[0],
    publishedAt: "2026-03-02",
  },
  {
    id: "2",
    title: "Kitchen Culture",
    caption: "Jollof wars: a friendly rivalry between nations",
    thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    city: cities[3],
    publishedAt: "2026-03-01",
  },
  {
    id: "3",
    title: "Studio Sessions",
    caption: "Inside the creative process with emerging artists",
    thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&q=80",
    city: cities[2],
    publishedAt: "2026-02-28",
  },
  {
    id: "4",
    title: "Market Day",
    caption: "Saturday mornings at the diaspora market",
    thumbnail: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=400&q=80",
    city: cities[1],
    publishedAt: "2026-02-27",
  },
  {
    id: "5",
    title: "Night Moves",
    caption: "The after-dark culture of Harlem's music scene",
    thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80",
    city: cities[4],
    publishedAt: "2026-02-26",
  },
  {
    id: "6",
    title: "Faith & Community",
    caption: "Sunday service and the bonds that hold us together",
    thumbnail: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&q=80",
    city: cities[0],
    publishedAt: "2026-02-25",
  },
  {
    id: "7",
    title: "Barbershop Chronicles",
    caption: "Stories, debates, and brotherhood under one roof",
    thumbnail: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&q=80",
    city: cities[3],
    publishedAt: "2026-02-24",
  },
  {
    id: "8",
    title: "Dance Roots",
    caption: "Traditional meets contemporary on Toronto's stages",
    thumbnail: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=400&q=80",
    city: cities[2],
    publishedAt: "2026-02-23",
  },
];

// --- SPONSORS ---
export const sponsors: Sponsor[] = [
  {
    name: "Shea Moisture",
    logo: "/images/sponsor-placeholder.svg",
    tagline: "Beauty rooted in tradition",
    url: "#",
  },
  {
    name: "Afrobeats Radio",
    logo: "/images/sponsor-placeholder.svg",
    tagline: "The sound of the diaspora",
    url: "#",
  },
  {
    name: "Diaspora Ventures",
    logo: "/images/sponsor-placeholder.svg",
    tagline: "Investing in our future",
    url: "#",
  },
];

// --- HELPER FUNCTIONS ---
export function getArticlesByCity(citySlug: string): Article[] {
  return articles.filter((a) => a.city.slug === citySlug);
}

export function getInterviewsByCity(citySlug: string): Interview[] {
  return interviews.filter((i) => i.city.slug === citySlug);
}

export function getReelsByCity(citySlug: string): Reel[] {
  return reels.filter((r) => r.city.slug === citySlug);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getInterviewBySlug(slug: string): Interview | undefined {
  return interviews.find((i) => i.slug === slug);
}
