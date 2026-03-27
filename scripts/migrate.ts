/**
 * Database migration script — creates all tables for the TAARi platform.
 * Run with: npx tsx scripts/migrate.ts
 */
import 'dotenv/config';
import pool from '../lib/db';

async function migrate() {
  const conn = await pool.getConnection();
  console.log('Connected to MySQL. Running migrations…');

  try {
    // ── Cities ──────────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS cities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        hero_image TEXT NOT NULL,
        description TEXT NOT NULL,
        story_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ cities');

    // ── Authors ─────────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(200) NOT NULL UNIQUE,
        avatar TEXT NOT NULL,
        bio TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ authors');

    // ── Author social links ─────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS author_social_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        author_id INT NOT NULL,
        platform VARCHAR(50) NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ author_social_links');

    // ── Articles ────────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS articles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        featured_image TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        body JSON NOT NULL,
        author_id INT NOT NULL,
        city_id INT NOT NULL,
        categories JSON NOT NULL,
        is_sponsored BOOLEAN DEFAULT FALSE,
        published_at DATE NOT NULL,
        read_time INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ articles');

    // ── Article gallery images ──────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS article_gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        article_id INT NOT NULL,
        image_url TEXT NOT NULL,
        sort_order INT DEFAULT 0,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ article_gallery');

    // ── Interviews ──────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS interviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL UNIQUE,
        portrait TEXT NOT NULL,
        name VARCHAR(200) NOT NULL,
        bio TEXT NOT NULL,
        city_id INT NOT NULL,
        one_liner VARCHAR(500) NOT NULL,
        questions JSON NOT NULL,
        published_at DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ interviews');

    // ── Reels ───────────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS reels (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        caption TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        city_id INT NOT NULL,
        published_at DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ reels');

    // ── Sponsors ────────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS sponsors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        logo TEXT NOT NULL,
        tagline VARCHAR(500) NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ sponsors');

    // ── Submissions ─────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(300) NOT NULL,
        city VARCHAR(100) NOT NULL,
        summary TEXT NOT NULL,
        video_link TEXT,
        social_handles VARCHAR(500),
        image_urls JSON,
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ submissions');

    // ── Users ───────────────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(300) NOT NULL UNIQUE,
        role ENUM('admin','editor','contributor','reader') DEFAULT 'reader',
        status ENUM('active','suspended') DEFAULT 'active',
        city VARCHAR(100),
        avatar TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ users');

    // ── Newsletter subscribers ──────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(300) NOT NULL UNIQUE,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ newsletter_subscribers');

    console.log('\n✅ All tables created successfully!');
  } finally {
    conn.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
