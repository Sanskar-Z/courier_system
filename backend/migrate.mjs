import fs from 'fs';
import mysql from 'mysql2/promise';
import 'dotenv/config';

async function runMigration() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'courier_system',
        multipleStatements: true
    });

    try {
        console.log('Running migration...');

        // Read schema
        const schemaRaw = fs.readFileSync('../database/schema.sql', 'utf8');
        const seedRaw = fs.readFileSync('../database/seed.sql', 'utf8');

        // Split and execute
        const schemaBlocks = schemaRaw.split('DELIMITER //');
        const seedBlocks = seedRaw.split('DELIMITER //');

        // Execute schema
        for (let i = 0; i < schemaBlocks.length; i++) {
            const block = schemaBlocks[i].trim();
            if (block) {
                console.log(`Executing schema block ${i + 1}...`);
                await pool.query(block);
            }
        }

        // Execute seed
        for (let i = 0; i < seedBlocks.length; i++) {
            const block = seedBlocks[i].trim();
            if (block) {
                console.log(`Executing seed block ${i + 1}...`);
                await pool.query(block);
            }
        }

        console.log('Migration completed successfully!');
        await pool.end();
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
}

runMigration();