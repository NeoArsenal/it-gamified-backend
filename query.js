import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  connectionString: 'postgresql://postgres.eajhmgpcncjfjaknwsqr:edcmvrlim26@aws-0-us-east-1.pooler.supabase.com:5432/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
  console.log('Tables in public schema:', res.rows.map(r => r.table_name));

  const table = res.rows.find(r => r.table_name.toLowerCase().includes('ticket'))?.table_name;
  if (table) {
    const tickets = await client.query(`SELECT id, titulo, estado FROM "${table}"`);
    console.log(`Tickets in ${table}:`, tickets.rows.length);
    console.log(tickets.rows);
  }

  await client.end();
}

run().catch(console.error);
