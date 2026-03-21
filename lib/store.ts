// Server-side in-memory mutable store seeded from lib/data.ts
// This lives in the Node.js module cache for the lifetime of the dev server process.

import {
  articles as seedArticles,
  interviews as seedInterviews,
  reels as seedReels,
  sponsors as seedSponsors,
  cities,
} from './data';

import type { Article, Interview, Reel, Sponsor, City } from './data';

export type { Article, Interview, Reel, Sponsor, City };

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'contributor' | 'reader';
  status: 'active' | 'suspended';
  city: string;
  joinedAt: string;
  avatar: string;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  city: string;
  summary: string;
  videoLink: string;
  socialHandles: string;
  imageUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

// ── Mutable store ────────────────────────────────────────────────────────────

const store: {
  articles: Article[];
  interviews: Interview[];
  reels: Reel[];
  sponsors: Sponsor[];
  submissions: Submission[];
  users: User[];
} = {
  articles: [...seedArticles],
  interviews: [...seedInterviews],
  reels: [...seedReels],
  sponsors: [...seedSponsors],
  users: [
    {
      id: 'u1',
      name: 'Amara Okafor',
      email: 'amara@taarimag.com',
      role: 'admin',
      status: 'active',
      city: 'London',
      joinedAt: '2025-09-01T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&q=80',
    },
    {
      id: 'u2',
      name: 'David Williams',
      email: 'david@taarimag.com',
      role: 'editor',
      status: 'active',
      city: 'Houston',
      joinedAt: '2025-10-15T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&q=80',
    },
    {
      id: 'u3',
      name: 'Kemi Mensah',
      email: 'kemi@taarimag.com',
      role: 'contributor',
      status: 'active',
      city: 'New York',
      joinedAt: '2025-11-02T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80',
    },
    {
      id: 'u4',
      name: 'James Adeyemi',
      email: 'james@taarimag.com',
      role: 'contributor',
      status: 'active',
      city: 'Toronto',
      joinedAt: '2025-11-20T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80',
    },
    {
      id: 'u5',
      name: 'Zara Nkosi',
      email: 'zara@example.com',
      role: 'reader',
      status: 'active',
      city: 'Atlanta',
      joinedAt: '2026-01-10T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=128&q=80',
    },
    {
      id: 'u6',
      name: 'Emeka Obi',
      email: 'emeka@example.com',
      role: 'reader',
      status: 'suspended',
      city: 'London',
      joinedAt: '2026-02-03T00:00:00Z',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&q=80',
    },
  ],
  submissions: [
    {
      id: '1',
      name: 'Imani Osei',
      email: 'imani@example.com',
      city: 'Atlanta',
      summary: "I want to share the story of my grandmother's textile business that she built from scratch after immigrating from Ghana in the 1980s.",
      videoLink: 'https://youtube.com/watch?v=example1',
      socialHandles: '@imaniosei',
      imageUrls: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80'],
      status: 'pending',
      submittedAt: '2026-03-10T14:22:00Z',
    },
    {
      id: '2',
      name: 'Tariq Mensah',
      email: 'tariq@example.com',
      city: 'London',
      summary: 'A documentary short about second-generation Ghanaians navigating identity between Accra and Peckham.',
      videoLink: 'https://youtube.com/watch?v=example2',
      socialHandles: '@tariqmensah',
      imageUrls: [],
      status: 'approved',
      submittedAt: '2026-03-08T09:15:00Z',
    },
    {
      id: '3',
      name: 'Adaeze Nwosu',
      email: 'adaeze@example.com',
      city: 'Toronto',
      summary: 'My journey launching a natural hair care brand rooted in Igbo beauty traditions.',
      videoLink: '',
      socialHandles: '@adaezebeauty',
      imageUrls: [],
      status: 'pending',
      submittedAt: '2026-03-12T18:45:00Z',
    },
    {
      id: '4',
      name: 'Kofi Asare',
      email: 'kofi@example.com',
      city: 'New York',
      summary: 'Hip-hop meets highlife: how I fuse both worlds in my music production.',
      videoLink: 'https://soundcloud.com/example',
      socialHandles: '@kofiasare',
      imageUrls: [],
      status: 'rejected',
      submittedAt: '2026-03-05T11:00:00Z',
    },
    {
      id: '5',
      name: 'Lola Abiodun',
      email: 'lola@example.com',
      city: 'Houston',
      summary: "A photo essay on the Afrobeats nightlife scene transforming Houston's Third Ward.",
      videoLink: '',
      socialHandles: '@lolaabiodun',
      imageUrls: [],
      status: 'pending',
      submittedAt: '2026-03-14T20:30:00Z',
    },
  ],
};

// ── Articles ─────────────────────────────────────────────────────────────────

export function getArticles(): Article[] {
  return store.articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return store.articles.find((a) => a.slug === slug);
}

export function createArticle(data: Article): Article {
  store.articles.unshift(data);
  return data;
}

export function updateArticle(slug: string, data: Partial<Article>): Article | null {
  const idx = store.articles.findIndex((a) => a.slug === slug);
  if (idx === -1) return null;
  store.articles[idx] = { ...store.articles[idx], ...data };
  return store.articles[idx];
}

export function deleteArticle(slug: string): boolean {
  const len = store.articles.length;
  store.articles = store.articles.filter((a) => a.slug !== slug);
  return store.articles.length < len;
}

// ── Interviews ───────────────────────────────────────────────────────────────

export function getInterviews(): Interview[] {
  return store.interviews;
}

export function getInterviewBySlug(slug: string): Interview | undefined {
  return store.interviews.find((i) => i.slug === slug);
}

export function createInterview(data: Interview): Interview {
  store.interviews.unshift(data);
  return data;
}

export function updateInterview(slug: string, data: Partial<Interview>): Interview | null {
  const idx = store.interviews.findIndex((i) => i.slug === slug);
  if (idx === -1) return null;
  store.interviews[idx] = { ...store.interviews[idx], ...data };
  return store.interviews[idx];
}

export function deleteInterview(slug: string): boolean {
  const len = store.interviews.length;
  store.interviews = store.interviews.filter((i) => i.slug !== slug);
  return store.interviews.length < len;
}

// ── Reels ────────────────────────────────────────────────────────────────────

export function getReels(): Reel[] {
  return store.reels;
}

export function getReelById(id: string): Reel | undefined {
  return store.reels.find((r) => r.id === id);
}

export function createReel(data: Reel): Reel {
  store.reels.unshift(data);
  return data;
}

export function updateReel(id: string, data: Partial<Reel>): Reel | null {
  const idx = store.reels.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  store.reels[idx] = { ...store.reels[idx], ...data };
  return store.reels[idx];
}

export function deleteReel(id: string): boolean {
  const len = store.reels.length;
  store.reels = store.reels.filter((r) => r.id !== id);
  return store.reels.length < len;
}

// ── Sponsors ─────────────────────────────────────────────────────────────────

export function getSponsors(): Sponsor[] {
  return store.sponsors;
}

export function getSponsorById(id: string): (Sponsor & { id: string }) | undefined {
  return (store.sponsors as (Sponsor & { id?: string })[]).find(
    (s) => (s as Sponsor & { id: string }).id === id,
  ) as (Sponsor & { id: string }) | undefined;
}

export function createSponsor(data: Sponsor & { id: string }): Sponsor & { id: string } {
  store.sponsors.unshift(data);
  return data;
}

export function updateSponsor(id: string, data: Partial<Sponsor>): (Sponsor & { id: string }) | null {
  const idx = store.sponsors.findIndex((s) => (s as Sponsor & { id?: string }).id === id);
  if (idx === -1) return null;
  store.sponsors[idx] = { ...store.sponsors[idx], ...data };
  return store.sponsors[idx] as Sponsor & { id: string };
}

export function deleteSponsor(id: string): boolean {
  const len = store.sponsors.length;
  store.sponsors = store.sponsors.filter((s) => (s as Sponsor & { id?: string }).id !== id);
  return store.sponsors.length < len;
}

// ── Submissions ──────────────────────────────────────────────────────────────

export function getSubmissions(): Submission[] {
  return store.submissions;
}

export function getSubmissionById(id: string): Submission | undefined {
  return store.submissions.find((s) => s.id === id);
}

export function updateSubmissionStatus(
  id: string,
  status: Submission['status'],
): Submission | null {
  const idx = store.submissions.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  store.submissions[idx] = { ...store.submissions[idx], status };
  return store.submissions[idx];
}

// ── Users ─────────────────────────────────────────────────────────────────────

export function getUsers(): User[] {
  return store.users;
}

export function getUserById(id: string): User | undefined {
  return store.users.find((u) => u.id === id);
}

export function createUser(data: User): User {
  store.users.unshift(data);
  return data;
}

export function updateUser(id: string, data: Partial<Omit<User, 'id'>>): User | null {
  const idx = store.users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  store.users[idx] = { ...store.users[idx], ...data };
  return store.users[idx];
}

export function deleteUser(id: string): boolean {
  const len = store.users.length;
  store.users = store.users.filter((u) => u.id !== id);
  return store.users.length < len;
}

// Export cities for convenience
export { cities };
