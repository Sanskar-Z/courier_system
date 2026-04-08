import mysql from 'mysql2/promise';
import 'dotenv/config';

async function testLogin() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'courier_system',
        });

        console.log('Testing database connection...');

        // Check if admin user exists
        const [users] = await pool.query('SELECT id, username, role, password_hash FROM users WHERE username = ?', ['admin1']);
        if (users.length === 0) {
            console.log('Admin user not found. Creating...');

            // Create admin user
            const bcrypt = await import('bcrypt');
            const hash = await bcrypt.default.hash('password123', 10);

            await pool.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', ['admin1', hash, 'admin']);
            console.log('Admin user created successfully!');
        } else {
            console.log('Admin user exists:', users[0]);
        }

        await pool.end();
    } catch (err) {
        console.error('Database error:', err.message);
    }
}

testLogin();