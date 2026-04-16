/**
 * Database migration script — creates all tables for the TAARi platform.
 * Run with: npx tsx scripts/migrate.ts
 */
import 'dotenv/config';
import type { RowDataPacket } from 'mysql2';
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
        is_featured BOOLEAN DEFAULT FALSE,
        published_at DATE NOT NULL,
        read_time INT DEFAULT 5,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE,
        FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ articles');

    // Ensure is_featured column exists on older installs
    const [featuredCol] = await conn.execute<RowDataPacket[]>(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'articles' AND COLUMN_NAME = 'is_featured'"
    );
    if ((featuredCol as unknown[]).length === 0) {
      await conn.execute('ALTER TABLE articles ADD COLUMN is_featured BOOLEAN DEFAULT FALSE AFTER is_sponsored');
      console.log('✓ articles.is_featured (added)');
    }

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
        rejection_reason TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ submissions');

    // Ensure rejection_reason column exists on older installs
    const [rejectionCol] = await conn.execute<RowDataPacket[]>(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'submissions' AND COLUMN_NAME = 'rejection_reason'"
    );
    if ((rejectionCol as unknown[]).length === 0) {
      await conn.execute('ALTER TABLE submissions ADD COLUMN rejection_reason TEXT AFTER status');
      console.log('✓ submissions.rejection_reason (added)');
    }

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

    // ── Change Makers ───────────────────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS change_makers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(250) NOT NULL UNIQUE,
        title VARCHAR(300) NOT NULL,
        bio TEXT,
        photo TEXT,
        category VARCHAR(100),
        city VARCHAR(100),
        year INT NOT NULL,
        featured TINYINT(1) DEFAULT 0,
        video_url TEXT,
        published_at DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ change_makers');

    // Ensure video_url column exists on older installs
    const [videoUrlCol] = await conn.execute<RowDataPacket[]>(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'change_makers' AND COLUMN_NAME = 'video_url'"
    );
    if ((videoUrlCol as unknown[]).length === 0) {
      await conn.execute('ALTER TABLE change_makers ADD COLUMN video_url TEXT AFTER featured');
      console.log('✓ change_makers.video_url (added)');
    }

    // Ensure slug column exists + is backfilled + unique
    const [slugCol] = await conn.execute<RowDataPacket[]>(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'change_makers' AND COLUMN_NAME = 'slug'"
    );
    if ((slugCol as unknown[]).length === 0) {
      await conn.execute('ALTER TABLE change_makers ADD COLUMN slug VARCHAR(250) NULL AFTER name');
      console.log('✓ change_makers.slug (added)');
    }

    // Backfill NULL slugs from name; disambiguate duplicates by appending -<id>
    const [needsBackfill] = await conn.execute<RowDataPacket[]>(
      "SELECT id, name FROM change_makers WHERE slug IS NULL OR slug = ''"
    );
    const toSlug = (s: string) => s.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    for (const row of needsBackfill as Array<{ id: number; name: string }>) {
      const base = toSlug(row.name) || `change-maker-${row.id}`;
      let slug = base;
      let n = 2;
      // Ensure uniqueness
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const [dup] = await conn.execute<RowDataPacket[]>(
          'SELECT id FROM change_makers WHERE slug = ? AND id != ?', [slug, row.id]
        );
        if ((dup as unknown[]).length === 0) break;
        slug = `${base}-${n++}`;
      }
      await conn.execute('UPDATE change_makers SET slug = ? WHERE id = ?', [slug, row.id]);
    }
    if ((needsBackfill as unknown[]).length > 0) {
      console.log(`✓ change_makers.slug backfilled (${(needsBackfill as unknown[]).length} rows)`);
    }

    // Enforce NOT NULL + UNIQUE once data is clean
    const [slugNullable] = await conn.execute<RowDataPacket[]>(
      "SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'change_makers' AND COLUMN_NAME = 'slug'"
    );
    if ((slugNullable as Array<{ IS_NULLABLE: string }>)[0]?.IS_NULLABLE === 'YES') {
      await conn.execute('ALTER TABLE change_makers MODIFY slug VARCHAR(250) NOT NULL');
      console.log('✓ change_makers.slug NOT NULL');
    }
    const [slugIdx] = await conn.execute<RowDataPacket[]>(
      "SELECT INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'change_makers' AND COLUMN_NAME = 'slug' AND NON_UNIQUE = 0"
    );
    if ((slugIdx as unknown[]).length === 0) {
      await conn.execute('ALTER TABLE change_makers ADD UNIQUE KEY uniq_change_makers_slug (slug)');
      console.log('✓ change_makers.slug UNIQUE');
    }

    // ── Banners (home hero slider) ──────────────────────────────────
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS banners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(300) NOT NULL,
        subtitle TEXT,
        image TEXT NOT NULL,
        cta_label VARCHAR(100),
        cta_url VARCHAR(500),
        badge VARCHAR(100),
        sort_order INT DEFAULT 0,
        active TINYINT(1) DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ banners');

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
