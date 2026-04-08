import mysql from 'mysql2/promise';
import 'dotenv/config';

async function checkDB() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'courier_system',
        });

        console.log('Checking database...');

        // Check if users table exists and has admin user
        const [users] = await pool.query('SELECT username, role FROM users WHERE username = ?', ['admin1']);
        console.log('Admin user found:', users);

        // Check if SLA table exists
        const [sla] = await pool.query('SELECT service_type FROM sla');
        console.log('SLA entries:', sla);

        await pool.end();
    } catch (err) {
        console.error('Database error:', err.message);
    }
}

checkDB();