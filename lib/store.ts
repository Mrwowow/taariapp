// Database-backed store for TAARi platform — replaces the old in-memory store.
// All functions are async and query MySQL via the connection pool.

import pool from './db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// Normalize a date input for MySQL DATE / DATETIME columns.
// Accepts "YYYY-MM-DD", ISO 8601 ("2026-03-31T23:00:00.000Z"), or Date-like.
// Returns "YYYY-MM-DD HH:MM:SS" in UTC, or null if invalid/empty.
function toMysqlDate(input: unknown): string | null {
  if (input == null || input === '') return null;
  const s = typeof input === 'string' ? input : String(input);
  // Already in MySQL form
  if (/^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/.test(s)) return s;
  // Plain date
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

// ── Types ────────────────────────────────────────────────────────────────────

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
  isFeatured: boolean;
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

export interface Submission {
  id: string;
  name: string;
  email: string;
  country: string;
  state: string;
  city: string;
  summary: string;
  videoLink: string;
  socialHandles: string;
  imageUrls: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason: string;
  submittedAt: string;
}

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

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
  badge: string;
  sortOrder: number;
  active: boolean;
}

export interface ChangeMaker {
  id: string;
  name: string;
  slug: string;
  title: string;
  bio: string;
  photo: string;
  category: string;
  city: string;
  year: number;
  featured: boolean;
  videoUrl: string;
  publishedAt: string;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

interface CityRow extends RowDataPacket {
  id: number; name: string; slug: string; hero_image: string; description: string; story_count: number;
}

interface AuthorRow extends RowDataPacket {
  id: number; name: string; slug: string; avatar: string; bio: string;
}

interface SocialLinkRow extends RowDataPacket {
  platform: string; url: string;
}

interface ArticleRow extends RowDataPacket {
  id: number; title: string; slug: string; featured_image: string; excerpt: string;
  body: string; author_id: number; city_id: number; categories: string;
  is_sponsored: number; is_featured: number; published_at: string; read_time: number;
}

interface GalleryRow extends RowDataPacket {
  image_url: string;
}

interface InterviewRow extends RowDataPacket {
  id: number; title: string; slug: string; portrait: string; name: string; bio: string;
  city_id: number; one_liner: string; questions: string; published_at: string;
}

interface ReelRow extends RowDataPacket {
  id: number; title: string; caption: string; thumbnail: string;
  city_id: number; published_at: string;
}

interface SponsorRow extends RowDataPacket {
  id: number; name: string; logo: string; tagline: string; url: string;
}

interface SubmissionRow extends RowDataPacket {
  id: number; name: string; email: string; country: string; state: string; city: string; summary: string;
  video_link: string; social_handles: string; image_urls: string;
  status: string; rejection_reason: string | null; submitted_at: string;
}

interface UserRow extends RowDataPacket {
  id: number; name: string; email: string; role: string; status: string;
  city: string; avatar: string; joined_at: string;
}

interface ChangeMakerRow extends RowDataPacket {
  id: number; name: string; slug: string; title: string; bio: string; photo: string;
  category: string; city: string; year: number; featured: number;
  video_url: string | null; published_at: string;
}

function rowToCity(row: CityRow): City & { id: string } {
  return { id: String(row.id), name: row.name, slug: row.slug, heroImage: row.hero_image, description: row.description, storyCount: row.story_count };
}

async function getCityById(id: number): Promise<City> {
  const [rows] = await pool.execute<CityRow[]>('SELECT * FROM cities WHERE id = ?', [id]);
  return rowToCity(rows[0]);
}

async function getAuthorById(id: number): Promise<Author> {
  const [rows] = await pool.execute<AuthorRow[]>('SELECT * FROM authors WHERE id = ?', [id]);
  const r = rows[0];
  const [links] = await pool.execute<SocialLinkRow[]>('SELECT platform, url FROM author_social_links WHERE author_id = ?', [id]);
  return { name: r.name, slug: r.slug, avatar: r.avatar, bio: r.bio, socialLinks: links.map(l => ({ platform: l.platform, url: l.url })) };
}

// ── Cities ───────────────────────────────────────────────────────────────────

export async function getCities(): Promise<City[]> {
  const [rows] = await pool.execute<CityRow[]>('SELECT * FROM cities ORDER BY name');
  return Promise.all(rows.map(rowToCity));
}

export async function getCityBySlug(slug: string): Promise<City | undefined> {
  const [rows] = await pool.execute<CityRow[]>('SELECT * FROM cities WHERE slug = ?', [slug]);
  if (rows.length === 0) return undefined;
  return rowToCity(rows[0]);
}

export async function getCityByIdPublic(id: string): Promise<(City & { id: string }) | undefined> {
  const [rows] = await pool.execute<CityRow[]>('SELECT * FROM cities WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToCity(rows[0]);
}

export async function createCity(data: { name: string; slug: string; heroImage: string; description: string }): Promise<City & { id: string }> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO cities (name, slug, hero_image, description, story_count) VALUES (?, ?, ?, ?, 0)',
    [data.name, data.slug, data.heroImage, data.description]
  );
  return (await getCityByIdPublic(String(result.insertId)))!;
}

export async function updateCity(id: string, data: Partial<{ name: string; slug: string; heroImage: string; description: string }>): Promise<(City & { id: string }) | null> {
  const [existing] = await pool.execute<CityRow[]>('SELECT id FROM cities WHERE id = ?', [id]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
  if (data.heroImage !== undefined) { fields.push('hero_image = ?'); values.push(data.heroImage); }
  if (data.description !== undefined) { fields.push('description = ?'); values.push(data.description); }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE cities SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return (await getCityByIdPublic(id)) ?? null;
}

export async function deleteCity(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM cities WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ── Articles ─────────────────────────────────────────────────────────────────

async function rowToArticle(row: ArticleRow): Promise<Article> {
  const author = await getAuthorById(row.author_id);
  const city = await getCityById(row.city_id);
  const [gallery] = await pool.execute<GalleryRow[]>(
    'SELECT image_url FROM article_gallery WHERE article_id = ? ORDER BY sort_order', [row.id]
  );
  const body = typeof row.body === 'string' ? JSON.parse(row.body) : row.body;
  const categories = typeof row.categories === 'string' ? JSON.parse(row.categories) : row.categories;
  return {
    title: row.title, slug: row.slug, featuredImage: row.featured_image,
    gallery: gallery.map(g => g.image_url), excerpt: row.excerpt, body, author, city, categories,
    isSponsored: !!row.is_sponsored, isFeatured: !!row.is_featured,
    publishedAt: row.published_at, readTime: row.read_time,
  };
}

export async function getArticles(): Promise<Article[]> {
  const [rows] = await pool.execute<ArticleRow[]>('SELECT * FROM articles ORDER BY published_at DESC');
  return Promise.all(rows.map(rowToArticle));
}

export async function getFeaturedArticles(): Promise<Article[]> {
  try {
    const [rows] = await pool.execute<ArticleRow[]>(
      'SELECT * FROM articles WHERE is_featured = 1 ORDER BY published_at DESC'
    );
    return Promise.all(rows.map(rowToArticle));
  } catch (err: unknown) {
    // is_featured column may not exist yet (pre-migration). Fail soft.
    if (
      err && typeof err === 'object' && 'code' in err &&
      ((err as { code: string }).code === 'ER_BAD_FIELD_ERROR' ||
       (err as { code: string }).code === 'ER_NO_SUCH_TABLE')
    ) {
      return [];
    }
    throw err;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const [rows] = await pool.execute<ArticleRow[]>('SELECT * FROM articles WHERE slug = ?', [slug]);
  if (rows.length === 0) return undefined;
  return rowToArticle(rows[0]);
}

export async function getArticlesByCity(citySlug: string): Promise<Article[]> {
  const [rows] = await pool.execute<ArticleRow[]>(
    'SELECT a.* FROM articles a JOIN cities c ON a.city_id = c.id WHERE c.slug = ? ORDER BY a.published_at DESC',
    [citySlug]
  );
  return Promise.all(rows.map(rowToArticle));
}

export async function createArticle(data: Article): Promise<Article> {
  const [authorRows] = await pool.execute<AuthorRow[]>('SELECT id FROM authors WHERE slug = ?', [data.author?.slug ?? '']);
  const [cityRows] = await pool.execute<CityRow[]>('SELECT id FROM cities WHERE slug = ?', [data.city?.slug ?? '']);
  const authorId = authorRows[0]?.id ?? 1;
  const cityId = cityRows[0]?.id ?? 1;

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO articles (title, slug, featured_image, excerpt, body, author_id, city_id, categories, is_sponsored, is_featured, published_at, read_time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.title, data.slug, data.featuredImage, data.excerpt, JSON.stringify(data.body),
     authorId, cityId, JSON.stringify(data.categories), data.isSponsored ? 1 : 0,
     data.isFeatured ? 1 : 0,
     toMysqlDate(data.publishedAt), data.readTime]
  );

  if (data.gallery?.length) {
    for (let i = 0; i < data.gallery.length; i++) {
      await pool.execute('INSERT INTO article_gallery (article_id, image_url, sort_order) VALUES (?, ?, ?)',
        [result.insertId, data.gallery[i], i]);
    }
  }

  return (await getArticleBySlug(data.slug))!;
}

export async function updateArticle(slug: string, data: Partial<Article>): Promise<Article | null> {
  const [existing] = await pool.execute<ArticleRow[]>('SELECT id FROM articles WHERE slug = ?', [slug]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
  if (data.featuredImage !== undefined) { fields.push('featured_image = ?'); values.push(data.featuredImage); }
  if (data.excerpt !== undefined) { fields.push('excerpt = ?'); values.push(data.excerpt); }
  if (data.body !== undefined) { fields.push('body = ?'); values.push(JSON.stringify(data.body)); }
  if (data.categories !== undefined) { fields.push('categories = ?'); values.push(JSON.stringify(data.categories)); }
  if (data.isSponsored !== undefined) { fields.push('is_sponsored = ?'); values.push(data.isSponsored ? 1 : 0); }
  if (data.isFeatured !== undefined) { fields.push('is_featured = ?'); values.push(data.isFeatured ? 1 : 0); }
  if (toMysqlDate(data.publishedAt) !== undefined) { fields.push('published_at = ?'); values.push(toMysqlDate(data.publishedAt)); }
  if (data.readTime !== undefined) { fields.push('read_time = ?'); values.push(data.readTime); }

  if (fields.length > 0) {
    values.push(slug);
    await pool.execute(`UPDATE articles SET ${fields.join(', ')} WHERE slug = ?`, values);
  }

  const newSlug = data.slug ?? slug;
  return (await getArticleBySlug(newSlug)) ?? null;
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM articles WHERE slug = ?', [slug]);
  return result.affectedRows > 0;
}

// ── Interviews ───────────────────────────────────────────────────────────────

async function rowToInterview(row: InterviewRow): Promise<Interview> {
  const city = await getCityById(row.city_id);
  const questions = typeof row.questions === 'string' ? JSON.parse(row.questions) : row.questions;
  return {
    title: row.title, slug: row.slug, portrait: row.portrait, name: row.name,
    bio: row.bio, city, oneLiner: row.one_liner, questions, publishedAt: row.published_at,
  };
}

export async function getInterviews(): Promise<Interview[]> {
  const [rows] = await pool.execute<InterviewRow[]>('SELECT * FROM interviews ORDER BY published_at DESC');
  return Promise.all(rows.map(rowToInterview));
}

export async function getInterviewBySlug(slug: string): Promise<Interview | undefined> {
  const [rows] = await pool.execute<InterviewRow[]>('SELECT * FROM interviews WHERE slug = ?', [slug]);
  if (rows.length === 0) return undefined;
  return rowToInterview(rows[0]);
}

export async function getInterviewsByCity(citySlug: string): Promise<Interview[]> {
  const [rows] = await pool.execute<InterviewRow[]>(
    'SELECT i.* FROM interviews i JOIN cities c ON i.city_id = c.id WHERE c.slug = ? ORDER BY i.published_at DESC',
    [citySlug]
  );
  return Promise.all(rows.map(rowToInterview));
}

export async function createInterview(data: Interview): Promise<Interview> {
  const [cityRows] = await pool.execute<CityRow[]>('SELECT id FROM cities WHERE slug = ?', [data.city?.slug ?? '']);
  const cityId = cityRows[0]?.id ?? 1;

  await pool.execute<ResultSetHeader>(
    `INSERT INTO interviews (title, slug, portrait, name, bio, city_id, one_liner, questions, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.title, data.slug, data.portrait, data.name, data.bio, cityId,
     data.oneLiner, JSON.stringify(data.questions), toMysqlDate(data.publishedAt)]
  );

  return (await getInterviewBySlug(data.slug))!;
}

export async function updateInterview(slug: string, data: Partial<Interview>): Promise<Interview | null> {
  const [existing] = await pool.execute<InterviewRow[]>('SELECT id FROM interviews WHERE slug = ?', [slug]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
  if (data.portrait !== undefined) { fields.push('portrait = ?'); values.push(data.portrait); }
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.bio !== undefined) { fields.push('bio = ?'); values.push(data.bio); }
  if (data.oneLiner !== undefined) { fields.push('one_liner = ?'); values.push(data.oneLiner); }
  if (data.questions !== undefined) { fields.push('questions = ?'); values.push(JSON.stringify(data.questions)); }
  if (toMysqlDate(data.publishedAt) !== undefined) { fields.push('published_at = ?'); values.push(toMysqlDate(data.publishedAt)); }

  if (fields.length > 0) {
    values.push(slug);
    await pool.execute(`UPDATE interviews SET ${fields.join(', ')} WHERE slug = ?`, values);
  }

  const newSlug = data.slug ?? slug;
  return (await getInterviewBySlug(newSlug)) ?? null;
}

export async function deleteInterview(slug: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM interviews WHERE slug = ?', [slug]);
  return result.affectedRows > 0;
}

// ── Reels ────────────────────────────────────────────────────────────────────

async function rowToReel(row: ReelRow): Promise<Reel> {
  const city = await getCityById(row.city_id);
  return {
    id: String(row.id), title: row.title, caption: row.caption,
    thumbnail: row.thumbnail, city, publishedAt: row.published_at,
  };
}

export async function getReels(): Promise<Reel[]> {
  const [rows] = await pool.execute<ReelRow[]>('SELECT * FROM reels ORDER BY published_at DESC');
  return Promise.all(rows.map(rowToReel));
}

export async function getReelById(id: string): Promise<Reel | undefined> {
  const [rows] = await pool.execute<ReelRow[]>('SELECT * FROM reels WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToReel(rows[0]);
}

export async function getReelsByCity(citySlug: string): Promise<Reel[]> {
  const [rows] = await pool.execute<ReelRow[]>(
    'SELECT r.* FROM reels r JOIN cities c ON r.city_id = c.id WHERE c.slug = ? ORDER BY r.published_at DESC',
    [citySlug]
  );
  return Promise.all(rows.map(rowToReel));
}

export async function createReel(data: Reel): Promise<Reel> {
  const [cityRows] = await pool.execute<CityRow[]>('SELECT id FROM cities WHERE slug = ?', [data.city?.slug ?? '']);
  const cityId = cityRows[0]?.id ?? 1;

  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO reels (title, caption, thumbnail, city_id, published_at) VALUES (?, ?, ?, ?, ?)',
    [data.title, data.caption, data.thumbnail, cityId, toMysqlDate(data.publishedAt)]
  );

  return (await getReelById(String(result.insertId)))!;
}

export async function updateReel(id: string, data: Partial<Reel>): Promise<Reel | null> {
  const [existing] = await pool.execute<ReelRow[]>('SELECT id FROM reels WHERE id = ?', [id]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.caption !== undefined) { fields.push('caption = ?'); values.push(data.caption); }
  if (data.thumbnail !== undefined) { fields.push('thumbnail = ?'); values.push(data.thumbnail); }
  if (toMysqlDate(data.publishedAt) !== undefined) { fields.push('published_at = ?'); values.push(toMysqlDate(data.publishedAt)); }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE reels SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return (await getReelById(id)) ?? null;
}

export async function deleteReel(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM reels WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ── Sponsors ─────────────────────────────────────────────────────────────────

function rowToSponsor(row: SponsorRow): Sponsor & { id: string } {
  return { id: String(row.id), name: row.name, logo: row.logo, tagline: row.tagline, url: row.url };
}

export async function getSponsors(): Promise<(Sponsor & { id: string })[]> {
  const [rows] = await pool.execute<SponsorRow[]>('SELECT * FROM sponsors ORDER BY id');
  return rows.map(rowToSponsor);
}

export async function getSponsorById(id: string): Promise<(Sponsor & { id: string }) | undefined> {
  const [rows] = await pool.execute<SponsorRow[]>('SELECT * FROM sponsors WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToSponsor(rows[0]);
}

export async function createSponsor(data: Sponsor & { id?: string }): Promise<Sponsor & { id: string }> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO sponsors (name, logo, tagline, url) VALUES (?, ?, ?, ?)',
    [data.name, data.logo, data.tagline, data.url]
  );
  return { id: String(result.insertId), name: data.name, logo: data.logo, tagline: data.tagline, url: data.url };
}

export async function updateSponsor(id: string, data: Partial<Sponsor>): Promise<(Sponsor & { id: string }) | null> {
  const [existing] = await pool.execute<SponsorRow[]>('SELECT id FROM sponsors WHERE id = ?', [id]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.logo !== undefined) { fields.push('logo = ?'); values.push(data.logo); }
  if (data.tagline !== undefined) { fields.push('tagline = ?'); values.push(data.tagline); }
  if (data.url !== undefined) { fields.push('url = ?'); values.push(data.url); }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE sponsors SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return (await getSponsorById(id)) ?? null;
}

export async function deleteSponsor(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM sponsors WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ── Submissions ──────────────────────────────────────────────────────────────

function rowToSubmission(row: SubmissionRow): Submission {
  const imageUrls = typeof row.image_urls === 'string' ? JSON.parse(row.image_urls) : (row.image_urls ?? []);
  return {
    id: String(row.id), name: row.name, email: row.email,
    country: row.country ?? '', state: row.state ?? '', city: row.city,
    summary: row.summary, videoLink: row.video_link ?? '',
    socialHandles: row.social_handles ?? '', imageUrls,
    status: row.status as Submission['status'],
    rejectionReason: row.rejection_reason ?? '',
    submittedAt: row.submitted_at,
  };
}

export async function getSubmissions(): Promise<Submission[]> {
  const [rows] = await pool.execute<SubmissionRow[]>('SELECT * FROM submissions ORDER BY submitted_at DESC');
  return rows.map(rowToSubmission);
}

export async function getSubmissionById(id: string): Promise<Submission | undefined> {
  const [rows] = await pool.execute<SubmissionRow[]>('SELECT * FROM submissions WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToSubmission(rows[0]);
}

export async function createSubmission(data: {
  name: string; email: string; country?: string; state?: string; city: string; summary: string;
  videoLink?: string; socialHandles?: string; imageUrls?: string[];
}): Promise<Submission> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO submissions (name, email, country, state, city, summary, video_link, social_handles, image_urls)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.name, data.email, data.country ?? '', data.state ?? '', data.city, data.summary,
     data.videoLink ?? '', data.socialHandles ?? '', JSON.stringify(data.imageUrls ?? [])]
  );
  return (await getSubmissionById(String(result.insertId)))!;
}

export async function getSubmissionsByEmail(email: string): Promise<Submission[]> {
  const [rows] = await pool.execute<SubmissionRow[]>(
    'SELECT * FROM submissions WHERE email = ? ORDER BY submitted_at DESC', [email]
  );
  return rows.map(rowToSubmission);
}

export async function updateSubmissionStatus(
  id: string,
  status: Submission['status'],
  rejectionReason?: string,
): Promise<Submission | null> {
  const reasonToPersist = status === 'rejected' ? (rejectionReason ?? '') : null;
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE submissions SET status = ?, rejection_reason = ? WHERE id = ?',
    [status, reasonToPersist, id]
  );
  if (result.affectedRows === 0) return null;
  return (await getSubmissionById(id)) ?? null;
}

// ── Users ────────────────────────────────────────────────────────────────────

function rowToUser(row: UserRow): User {
  return {
    id: String(row.id), name: row.name, email: row.email,
    role: row.role as User['role'], status: row.status as User['status'],
    city: row.city ?? '', joinedAt: row.joined_at, avatar: row.avatar ?? '',
  };
}

export async function getUsers(): Promise<User[]> {
  const [rows] = await pool.execute<UserRow[]>('SELECT * FROM users ORDER BY joined_at DESC');
  return rows.map(rowToUser);
}

export async function getUserById(id: string): Promise<User | undefined> {
  const [rows] = await pool.execute<UserRow[]>('SELECT * FROM users WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToUser(rows[0]);
}

export async function createUser(data: User): Promise<User> {
  const [result] = await pool.execute<ResultSetHeader>(
    'INSERT INTO users (name, email, role, status, city, avatar) VALUES (?, ?, ?, ?, ?, ?)',
    [data.name, data.email, data.role, data.status ?? 'active', data.city ?? '', data.avatar ?? '']
  );
  return (await getUserById(String(result.insertId)))!;
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | null> {
  const [existing] = await pool.execute<UserRow[]>('SELECT id FROM users WHERE id = ?', [id]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
  if (data.role !== undefined) { fields.push('role = ?'); values.push(data.role); }
  if (data.status !== undefined) { fields.push('status = ?'); values.push(data.status); }
  if (data.city !== undefined) { fields.push('city = ?'); values.push(data.city); }
  if (data.avatar !== undefined) { fields.push('avatar = ?'); values.push(data.avatar); }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return (await getUserById(id)) ?? null;
}

export async function deleteUser(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ── Change Makers ───────────────────────────────────────────────────────────

function rowToChangeMaker(row: ChangeMakerRow): ChangeMaker {
  return {
    id: String(row.id), name: row.name, slug: row.slug,
    title: row.title, bio: row.bio,
    photo: row.photo, category: row.category, city: row.city,
    year: row.year, featured: !!row.featured,
    videoUrl: row.video_url ?? '',
    publishedAt: row.published_at,
  };
}

function slugifyName(s: string): string {
  return s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

async function generateUniqueChangeMakerSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugifyName(name) || 'change-maker';
  let slug = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const [rows] = excludeId
      ? await pool.execute<ChangeMakerRow[]>(
          'SELECT id FROM change_makers WHERE slug = ? AND id != ?', [slug, excludeId]
        )
      : await pool.execute<ChangeMakerRow[]>(
          'SELECT id FROM change_makers WHERE slug = ?', [slug]
        );
    if (rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function getChangeMakers(): Promise<ChangeMaker[]> {
  const [rows] = await pool.execute<ChangeMakerRow[]>('SELECT * FROM change_makers ORDER BY year DESC, name');
  return rows.map(rowToChangeMaker);
}

export async function getChangeMakerById(id: string): Promise<ChangeMaker | undefined> {
  const [rows] = await pool.execute<ChangeMakerRow[]>('SELECT * FROM change_makers WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToChangeMaker(rows[0]);
}

export async function getChangeMakerBySlug(slug: string): Promise<ChangeMaker | undefined> {
  const [rows] = await pool.execute<ChangeMakerRow[]>('SELECT * FROM change_makers WHERE slug = ?', [slug]);
  if (rows.length === 0) return undefined;
  return rowToChangeMaker(rows[0]);
}

export async function createChangeMaker(data: Omit<ChangeMaker, 'id' | 'slug'> & { slug?: string }): Promise<ChangeMaker> {
  const slug = data.slug?.trim() || await generateUniqueChangeMakerSlug(data.name);
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO change_makers (name, slug, title, bio, photo, category, city, year, featured, video_url, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.name, slug, data.title, data.bio, data.photo, data.category, data.city,
     data.year, data.featured ? 1 : 0, data.videoUrl?.trim() || null,
     toMysqlDate(data.publishedAt)]
  );
  return (await getChangeMakerById(String(result.insertId)))!;
}

export async function updateChangeMaker(id: string, data: Partial<ChangeMaker>): Promise<ChangeMaker | null> {
  const [existing] = await pool.execute<ChangeMakerRow[]>('SELECT id FROM change_makers WHERE id = ?', [id]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?'); values.push(data.name);
    // Re-slug when name changes and caller didn't supply an explicit slug
    if (data.slug === undefined) {
      const newSlug = await generateUniqueChangeMakerSlug(data.name, id);
      fields.push('slug = ?'); values.push(newSlug);
    }
  }
  if (data.slug !== undefined) { fields.push('slug = ?'); values.push(data.slug); }
  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.bio !== undefined) { fields.push('bio = ?'); values.push(data.bio); }
  if (data.photo !== undefined) { fields.push('photo = ?'); values.push(data.photo); }
  if (data.category !== undefined) { fields.push('category = ?'); values.push(data.category); }
  if (data.city !== undefined) { fields.push('city = ?'); values.push(data.city); }
  if (data.year !== undefined) { fields.push('year = ?'); values.push(data.year); }
  if (data.featured !== undefined) { fields.push('featured = ?'); values.push(data.featured ? 1 : 0); }
  if (data.videoUrl !== undefined) { fields.push('video_url = ?'); values.push(data.videoUrl.trim() || null); }
  if (toMysqlDate(data.publishedAt) !== undefined) { fields.push('published_at = ?'); values.push(toMysqlDate(data.publishedAt)); }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE change_makers SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return (await getChangeMakerById(id)) ?? null;
}

export async function deleteChangeMaker(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM change_makers WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ── Banners ──────────────────────────────────────────────────────────────────

interface BannerRow extends RowDataPacket {
  id: number; title: string; subtitle: string | null; image: string;
  cta_label: string | null; cta_url: string | null; badge: string | null;
  sort_order: number; active: number;
}

function rowToBanner(row: BannerRow): Banner {
  return {
    id: String(row.id),
    title: row.title,
    subtitle: row.subtitle ?? '',
    image: row.image,
    ctaLabel: row.cta_label ?? '',
    ctaUrl: row.cta_url ?? '',
    badge: row.badge ?? '',
    sortOrder: row.sort_order,
    active: !!row.active,
  };
}

export async function getBanners(): Promise<Banner[]> {
  const [rows] = await pool.execute<BannerRow[]>('SELECT * FROM banners ORDER BY sort_order ASC, id ASC');
  return rows.map(rowToBanner);
}

export async function getActiveBanners(): Promise<Banner[]> {
  try {
    const [rows] = await pool.execute<BannerRow[]>('SELECT * FROM banners WHERE active = 1 ORDER BY sort_order ASC, id ASC');
    return rows.map(rowToBanner);
  } catch (err: unknown) {
    // Table may not exist yet (pre-migration). Fail soft so hero can fall back.
    if (err && typeof err === 'object' && 'code' in err && (err as { code: string }).code === 'ER_NO_SUCH_TABLE') {
      return [];
    }
    throw err;
  }
}

export async function getBannerById(id: string): Promise<Banner | undefined> {
  const [rows] = await pool.execute<BannerRow[]>('SELECT * FROM banners WHERE id = ?', [id]);
  if (rows.length === 0) return undefined;
  return rowToBanner(rows[0]);
}

export async function createBanner(data: Partial<Banner>): Promise<Banner> {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO banners (title, subtitle, image, cta_label, cta_url, badge, sort_order, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title ?? '',
      data.subtitle ?? '',
      data.image ?? '',
      data.ctaLabel ?? '',
      data.ctaUrl ?? '',
      data.badge ?? '',
      data.sortOrder ?? 0,
      data.active === false ? 0 : 1,
    ],
  );
  return (await getBannerById(String(result.insertId)))!;
}

export async function updateBanner(id: string, data: Partial<Banner>): Promise<Banner | null> {
  const [existing] = await pool.execute<BannerRow[]>('SELECT id FROM banners WHERE id = ?', [id]);
  if (existing.length === 0) return null;

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.subtitle !== undefined) { fields.push('subtitle = ?'); values.push(data.subtitle); }
  if (data.image !== undefined) { fields.push('image = ?'); values.push(data.image); }
  if (data.ctaLabel !== undefined) { fields.push('cta_label = ?'); values.push(data.ctaLabel); }
  if (data.ctaUrl !== undefined) { fields.push('cta_url = ?'); values.push(data.ctaUrl); }
  if (data.badge !== undefined) { fields.push('badge = ?'); values.push(data.badge); }
  if (data.sortOrder !== undefined) { fields.push('sort_order = ?'); values.push(data.sortOrder); }
  if (data.active !== undefined) { fields.push('active = ?'); values.push(data.active ? 1 : 0); }

  if (fields.length > 0) {
    values.push(id);
    await pool.execute(`UPDATE banners SET ${fields.join(', ')} WHERE id = ?`, values);
  }

  return (await getBannerById(id)) ?? null;
}

export async function deleteBanner(id: string): Promise<boolean> {
  const [result] = await pool.execute<ResultSetHeader>('DELETE FROM banners WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

// ── Newsletter ───────────────────────────────────────────────────────────────

export async function addNewsletterSubscriber(email: string): Promise<boolean> {
  try {
    await pool.execute('INSERT INTO newsletter_subscribers (email) VALUES (?)', [email]);
    return true;
  } catch {
    return false; // duplicate
  }
}
