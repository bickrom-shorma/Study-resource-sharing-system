const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();


const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Main pool targetting the specific database
let pool = null;

async function initDB() {
  try {
    // 1. Connect without DB selected to ensure DB exists
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    const dbName = process.env.DB_NAME || 'study_resource_db';
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await tempConnection.end();

    // 2. Initialize connection pool
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName
    });

    // 3. Execute schema.sql to ensure tables and seed data exist
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const stmt of statements) {
        try {
          await pool.query(stmt);
        } catch (err) {
          // Ignore table already exists or duplicate seed errors gracefully
        }
      }
    }

    console.log(`[Database] Connected successfully to MySQL database "${dbName}".`);
  } catch (error) {
    console.error('[Database Warning] Connection failed or MySQL not running:', error.message);
    console.error('[Database Warning] Ensure MySQL is running on', dbConfig.host, 'and credentials in .env are correct.');
    
    // Create fallback pool object to prevent app crash on startup
    pool = mysql.createPool({
      ...dbConfig,
      database: process.env.DB_NAME || 'study_resource_db'
    });
  }
}

// Immediately trigger DB initialization
initDB();

module.exports = {
  getPool: () => pool,
  query: async (sql, params) => {
    if (!pool) {
      throw new Error('Database pool has not been initialized yet.');
    }
    return pool.query(sql, params);
  }
};
