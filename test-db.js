const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://oancestral:oancestral_dev_2024@localhost:5433/oancestral?schema=public',
});

console.log('Connecting...');
client.connect()
  .then(() => {
    console.log('Connected successfully!');
    return client.query('SELECT NOW()');
  })
  .then(res => {
    console.log('Query result:', res.rows[0]);
    return client.end();
  })
  .catch(err => {
    console.error('Connection failed:', err);
    process.exit(1);
  });
