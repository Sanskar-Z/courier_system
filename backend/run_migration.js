const fs = require('fs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'courier_system',
        multipleStatements: true
    });

    try {
        console.log('Reading schema.sql...');
        const schemaRaw = fs.readFileSync('../database/schema.sql', 'utf8');
        console.log('Reading seed.sql...');
        const seedRaw = fs.readFileSync('../database/seed.sql', 'utf8');

        // Split standard queries vs delimited queries
        const runQueryBlock = async (rawSql) => {
            let inDelimiter = false;
            let currentBlock = '';
            const lines = rawSql.split('\n');
            let batch = [];

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i].trim();
                
                if (line.startsWith('DELIMITER //')) {
                    if (currentBlock.trim() !== '') {
                        batch.push(currentBlock);
                        currentBlock = '';
                    }
                    inDelimiter = true;
                    continue;
                }
                if (line.startsWith('DELIMITER ;')) {
                    if (currentBlock.trim() !== '') {
                        batch.push(currentBlock);
                        currentBlock = '';
                    }
                    inDelimiter = false;
                    continue;
                }

                if (inDelimiter) {
                    currentBlock += line + '\n';
                    if (line.endsWith('//')) {
                        batch.push(currentBlock.replace(/\s*\/\/\s*$/, ''));
                        currentBlock = '';
                    }
                } else {
                    currentBlock += line + '\n';
                    if (line.endsWith(';')) {
                        batch.push(currentBlock);
                        currentBlock = '';
                    }
                }
            }
            if (currentBlock.trim() !== '') batch.push(currentBlock);

            for (const q of batch) {
                if (q.trim() === '') continue;
                try {
                    await pool.query(q);
                } catch (err) {
                    // Ignore DROP warnings
                    if (!q.toUpperCase().includes('DROP DATABASE')) {
                         console.error('Error in query:', q.substring(0, 100), '...', err.message);
                         throw err;
                    }
                }
            }
        };

        console.log('Executing schema...');
        await runQueryBlock(schemaRaw);
        console.log('Executing seed...');
        await runQueryBlock(seedRaw);
        console.log('Migration Completed Successfully!');
        process.exit(0);

    } catch (e) {
        console.error('MIGRATION FAILED:', e);
        process.exit(1);
    }
}

runMigration();
