/**
 * Database seed script — populates all tables with initial data.
 * Run with: npx tsx scripts/seed.ts
 */
import 'dotenv/config';
import pool from '../lib/db';
import { cities, authors, articles, interviews, reels, sponsors } from '../lib/data';

async function seed() {
  const conn = await pool.getConnection();
  console.log('Connected to MySQL. Seeding data…');

  try {
    // ── Cities ──────────────────────────────────────────────────────
    for (const city of cities) {
      await conn.execute(
        `INSERT INTO cities (name, slug, hero_image, description, story_count)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), hero_image=VALUES(hero_image), description=VALUES(description), story_count=VALUES(story_count)`,
        [city.name, city.slug, city.heroImage, city.description, city.storyCount]
      );
    }
    console.log(`✓ ${cities.length} cities`);

    // ── Authors ─────────────────────────────────────────────────────
    for (const author of authors) {
      await conn.execute(
        `INSERT INTO authors (name, slug, avatar, bio)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), avatar=VALUES(avatar), bio=VALUES(bio)`,
        [author.name, author.slug, author.avatar, author.bio]
      );

      // Get author id
      const [rows] = await conn.execute('SELECT id FROM authors WHERE slug = ?', [author.slug]);
      const authorId = (rows as { id: number }[])[0].id;

      // Delete existing social links and re-insert
      await conn.execute('DELETE FROM author_social_links WHERE author_id = ?', [authorId]);
      for (const link of author.socialLinks) {
        await conn.execute(
          'INSERT INTO author_social_links (author_id, platform, url) VALUES (?, ?, ?)',
          [authorId, link.platform, link.url]
        );
      }
    }
    console.log(`✓ ${authors.length} authors`);

    // ── Articles ────────────────────────────────────────────────────
    for (const article of articles) {
      // Look up author_id and city_id
      const [authorRows] = await conn.execute('SELECT id FROM authors WHERE slug = ?', [article.author.slug]);
      const authorId = (authorRows as { id: number }[])[0].id;

      const [cityRows] = await conn.execute('SELECT id FROM cities WHERE slug = ?', [article.city.slug]);
      const cityId = (cityRows as { id: number }[])[0].id;

      await conn.execute(
        `INSERT INTO articles (title, slug, featured_image, excerpt, body, author_id, city_id, categories, is_sponsored, published_at, read_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), featured_image=VALUES(featured_image), excerpt=VALUES(excerpt), body=VALUES(body),
           author_id=VALUES(author_id), city_id=VALUES(city_id), categories=VALUES(categories), is_sponsored=VALUES(is_sponsored),
           published_at=VALUES(published_at), read_time=VALUES(read_time)`,
        [
          article.title, article.slug, article.featuredImage, article.excerpt,
          JSON.stringify(article.body), authorId, cityId,
          JSON.stringify(article.categories), article.isSponsored,
          article.publishedAt, article.readTime,
        ]
      );

      // Gallery images
      const [artRows] = await conn.execute('SELECT id FROM articles WHERE slug = ?', [article.slug]);
      const articleId = (artRows as { id: number }[])[0].id;

      await conn.execute('DELETE FROM article_gallery WHERE article_id = ?', [articleId]);
      for (let i = 0; i < article.gallery.length; i++) {
        await conn.execute(
          'INSERT INTO article_gallery (article_id, image_url, sort_order) VALUES (?, ?, ?)',
          [articleId, article.gallery[i], i]
        );
      }
    }
    console.log(`✓ ${articles.length} articles`);

    // ── Interviews ──────────────────────────────────────────────────
    for (const interview of interviews) {
      const [cityRows] = await conn.execute('SELECT id FROM cities WHERE slug = ?', [interview.city.slug]);
      const cityId = (cityRows as { id: number }[])[0].id;

      await conn.execute(
        `INSERT INTO interviews (title, slug, portrait, name, bio, city_id, one_liner, questions, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), portrait=VALUES(portrait), name=VALUES(name), bio=VALUES(bio),
           city_id=VALUES(city_id), one_liner=VALUES(one_liner), questions=VALUES(questions), published_at=VALUES(published_at)`,
        [
          interview.title, interview.slug, interview.portrait, interview.name,
          interview.bio, cityId, interview.oneLiner,
          JSON.stringify(interview.questions), interview.publishedAt,
        ]
      );
    }
    console.log(`✓ ${interviews.length} interviews`);

    // ── Reels ───────────────────────────────────────────────────────
    for (const reel of reels) {
      const [cityRows] = await conn.execute('SELECT id FROM cities WHERE slug = ?', [reel.city.slug]);
      const cityId = (cityRows as { id: number }[])[0].id;

      await conn.execute(
        `INSERT INTO reels (title, caption, thumbnail, city_id, published_at)
         VALUES (?, ?, ?, ?, ?)`,
        [reel.title, reel.caption, reel.thumbnail, cityId, reel.publishedAt]
      );
    }
    console.log(`✓ ${reels.length} reels`);

    // ── Sponsors ────────────────────────────────────────────────────
    for (const sponsor of sponsors) {
      await conn.execute(
        `INSERT INTO sponsors (name, logo, tagline, url)
         VALUES (?, ?, ?, ?)`,
        [sponsor.name, sponsor.logo, sponsor.tagline, sponsor.url]
      );
    }
    console.log(`✓ ${sponsors.length} sponsors`);

    // ── Seed users ──────────────────────────────────────────────────
    const seedUsers = [
      { name: 'Amara Okafor', email: 'amara@taarimag.com', role: 'admin', city: 'London', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=128&q=80' },
      { name: 'David Williams', email: 'david@taarimag.com', role: 'editor', city: 'Houston', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=128&q=80' },
      { name: 'Kemi Mensah', email: 'kemi@taarimag.com', role: 'contributor', city: 'New York', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&q=80' },
      { name: 'James Adeyemi', email: 'james@taarimag.com', role: 'contributor', city: 'Toronto', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&q=80' },
      { name: 'Zara Nkosi', email: 'zara@example.com', role: 'reader', city: 'Atlanta', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=128&q=80' },
      { name: 'Emeka Obi', email: 'emeka@example.com', role: 'reader', city: 'London', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&q=80' },
    ];

    for (const u of seedUsers) {
      await conn.execute(
        `INSERT INTO users (name, email, role, city, avatar)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), role=VALUES(role), city=VALUES(city), avatar=VALUES(avatar)`,
        [u.name, u.email, u.role, u.city, u.avatar]
      );
    }
    console.log(`✓ ${seedUsers.length} users`);

    // ── Seed submissions ────────────────────────────────────────────
    const seedSubmissions = [
      { name: 'Imani Osei', email: 'imani@example.com', city: 'Atlanta', summary: "I want to share the story of my grandmother's textile business.", videoLink: 'https://youtube.com/watch?v=example1', socialHandles: '@imaniosei', imageUrls: ['https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80'], status: 'pending' },
      { name: 'Tariq Mensah', email: 'tariq@example.com', city: 'London', summary: 'A documentary short about second-generation Ghanaians navigating identity.', videoLink: 'https://youtube.com/watch?v=example2', socialHandles: '@tariqmensah', imageUrls: [], status: 'approved' },
      { name: 'Adaeze Nwosu', email: 'adaeze@example.com', city: 'Toronto', summary: 'My journey launching a natural hair care brand rooted in Igbo beauty traditions.', videoLink: '', socialHandles: '@adaezebeauty', imageUrls: [], status: 'pending' },
      { name: 'Kofi Asare', email: 'kofi@example.com', city: 'New York', summary: 'Hip-hop meets highlife: how I fuse both worlds in my music production.', videoLink: 'https://soundcloud.com/example', socialHandles: '@kofiasare', imageUrls: [], status: 'rejected' },
      { name: 'Lola Abiodun', email: 'lola@example.com', city: 'Houston', summary: "A photo essay on the Afrobeats nightlife scene transforming Houston's Third Ward.", videoLink: '', socialHandles: '@lolaabiodun', imageUrls: [], status: 'pending' },
    ];

    for (const s of seedSubmissions) {
      await conn.execute(
        `INSERT INTO submissions (name, email, city, summary, video_link, social_handles, image_urls, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [s.name, s.email, s.city, s.summary, s.videoLink, s.socialHandles, JSON.stringify(s.imageUrls), s.status]
      );
    }
    console.log(`✓ ${seedSubmissions.length} submissions`);

    console.log('\n✅ Database seeded successfully!');
  } finally {
    conn.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
