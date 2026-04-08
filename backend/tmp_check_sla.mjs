import db from './config/db.js';

try {
  const [rows] = await db.query('SELECT service_type FROM sla');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
