import mysql from 'mysql2/promise';
import 'dotenv/config';

async function checkUsers() {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'courier_system',
        });

        console.log('Checking users table...');

        // Check all users
        const [users] = await pool.query('SELECT id, username, role FROM users');
        console.log('Users in database:', users);

        // Check admin user specifically
        const [admin] = await pool.query('SELECT id, username, role, password_hash FROM users WHERE username = ?', ['admin1']);
        if (admin.length > 0) {
            console.log('Admin user found:', {
                id: admin[0].id,
                username: admin[0].username,
                role: admin[0].role,
                password_hash_length: admin[0].password_hash.length
            });
        } else {
            console.log('Admin user NOT found');
        }

        await pool.end();
    } catch (err) {
        console.error('Database error:', err.message);
    }
}

checkUsers();