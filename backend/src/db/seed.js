import bcrypt from 'bcryptjs';
import { pool, query } from '../config/db.js';
import { loadEnv } from '../config/env.js';

loadEnv();

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create demo users if not exists
    const usersToSeed = [
      { email: 'admin@mindspire.com', role: 'admin', name: 'Admin User', password: 'password123' },
      { email: 'teacher@mindspire.com', role: 'teacher', name: 'Teacher Ali', password: 'password123' },
      { email: 'student@mindspire.com', role: 'student', name: 'Student Ahmed', password: 'password123' },
      { email: 'driver@mindspire.com', role: 'driver', name: 'Driver Umar', password: 'password123' },
    ];
    for (const u of usersToSeed) {
      const { rows: existing } = await client.query('SELECT id FROM users WHERE email = $1', [u.email]);
      if (!existing.length) {
        const hash = await bcrypt.hash(u.password, 10);
        await client.query('INSERT INTO users (email, password_hash, role, name) VALUES ($1,$2,$3,$4)', [u.email, hash, u.role, u.name]);
        console.log('Seeded user:', u.email, 'password:', u.password);
      } else {
        console.log('User already exists:', u.email);
      }
    }

    // Seed a teacher
    const { rows: teacher } = await client.query(
      `INSERT INTO teachers (name, email, phone, subject, salary, status) VALUES ('Teacher Ali','teacher@mindspire.com','+92 300 1111111','Math',80000,'active')
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`
    );
    if (teacher[0]) {
      const tid = teacher[0].id;
      await client.query(
        `INSERT INTO teacher_schedules (teacher_id, day_of_week, start_time, end_time, class, section, subject)
         VALUES ($1,1,'08:00','09:00','10','A','Math')
         ON CONFLICT DO NOTHING`,
        [tid]
      );
    }

    // Seed a student
    await client.query(
      `INSERT INTO students (name, email, roll_number, class, section, rfid_tag, attendance, fee_status, bus_number, bus_assigned, parent_name, parent_phone, status)
       VALUES ('Student Ahmed','student@mindspire.com','STD001','10','A','RFID-001',95.5,'paid','101',true,'Khan Sahab','+92 300 1234567','active')
       ON CONFLICT DO NOTHING`
    );

    await client.query('COMMIT');
    console.log('Seed completed.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
