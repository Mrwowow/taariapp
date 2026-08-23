import mysql from 'mysql2/promise';

/**
 * The database is remote, so idle TCP connections get reaped by the network
 * path (NAT/firewall) long before MySQL's own wait_timeout. Keep the pool's
 * idle window short and probe aggressively so we notice before handing out a
 * dead socket; `withDb` below retries the ones that still slip through.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT) || 5,
  queueLimit: 0,
  idleTimeout: 30000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
  connectTimeout: 20000,
});

/** Errors that mean "this pooled socket is dead", not "this query is wrong". */
const RETRYABLE = new Set([
  'ECONNRESET',
  'EPIPE',
  'ETIMEDOUT',
  'ECONNREFUSED',
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_SEQUENCE_TIMEOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
]);

function isRetryable(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code;
  return !!code && RETRYABLE.has(code);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Run a database operation, retrying once per stale connection. A reset socket
 * is discarded by mysql2 on failure, so the next attempt gets a fresh one.
 * Only connection-level failures retry — real SQL errors surface immediately.
 */
export async function withDb<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      if (!isRetryable(err)) throw err;
      lastError = err;
      if (i < attempts - 1) await sleep(100 * 2 ** i);
    }
  }
  throw lastError;
}

export default pool;
