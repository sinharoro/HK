import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function seed() {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hustisyakonek',
  });

  const hash = await bcrypt.hash('password123', 12);

  await conn.query(`DELETE FROM audit_logs`);
  await conn.query(`DELETE FROM notifications`);
  await conn.query(`DELETE FROM attendance`);
  await conn.query(`DELETE FROM summons`);
  await conn.query(`DELETE FROM filing_reports`);
  await conn.query(`DELETE FROM case_assignments`);
  await conn.query(`DELETE FROM hearings`);
  await conn.query(`DELETE FROM cases`);
  await conn.query(`DELETE FROM users`);

  await conn.query(
    `INSERT INTO users (email, username, password, name, role, contact, address) VALUES
     ('secretary@hustisyakonek.com', 'secretary', ?, 'Maria Santos', 'secretary', '09171234567', 'Barangay Hall, Napolan, Pagadian City'),
     ('chairman@hustisyakonek.com', 'chairman', ?, 'Roberto Reyes', 'lupon_chairman', '09171234568', 'Purok 1, Napolan, Pagadian City'),
     ('member1@hustisyakonek.com', 'member1', ?, 'Elena Cruz', 'lupon_member', '09171234569', 'Purok 2, Napolan, Pagadian City'),
     ('member2@hustisyakonek.com', 'member2', ?, 'Pedro Dimagiba', 'lupon_member', '09171234570', 'Purok 3, Napolan, Pagadian City'),
     ('member3@hustisyakonek.com', 'member3', ?, 'Luisa Gonzales', 'lupon_member', '09171234571', 'Purok 4, Napolan, Pagadian City'),
     ('complainant@hustisyakonek.com', 'complainant', ?, 'Juan dela Cruz', 'complainant', '09171234572', 'Purok 5, Napolan, Pagadian City'),
     ('respondent@hustisyakonek.com', 'respondent', ?, 'Maria Clara', 'respondent', '09171234573', 'Purok 6, Napolan, Pagadian City')`,
    [hash, hash, hash, hash, hash, hash, hash]
  );

  console.log('Seed data inserted successfully!');
  console.log('All accounts have password: password123');
  await conn.end();
}

seed().catch(console.error);
