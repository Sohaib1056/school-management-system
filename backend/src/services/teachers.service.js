import { query } from '../config/db.js';

export const list = async ({ page = 1, pageSize = 50, q }) => {
  const offset = (page - 1) * pageSize;
  const params = [];
  const where = [];
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    where.push(`(LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows: countRows } = await query(`SELECT COUNT(*)::int AS count FROM teachers ${whereSql}`, params);
  const total = countRows[0]?.count || 0;

  const { rows } = await query(
    `SELECT id, name, email, phone, subject, salary, status, avatar FROM teachers ${whereSql} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, pageSize, offset]
  );
  return { rows, total, page, pageSize };
};

export const getById = async (id) => {
  const { rows } = await query('SELECT id, name, email, phone, subject, salary, status, avatar FROM teachers WHERE id = $1', [id]);
  return rows[0] || null;
};

export const getSchedule = async (id) => {
  const { rows } = await query(
    'SELECT id, day_of_week AS "dayOfWeek", start_time AS "startTime", end_time AS "endTime", class, section, subject FROM teacher_schedules WHERE teacher_id = $1 ORDER BY day_of_week, start_time',
    [id]
  );
  return rows;
};

export const create = async ({ name, email, phone, subject, salary = 0, status = 'active', avatar = null }) => {
  const { rows } = await query(
    'INSERT INTO teachers (name, email, phone, subject, salary, status, avatar) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, name, email, phone, subject, salary, status, avatar',
    [name, email, phone || null, subject || null, salary, status, avatar]
  );
  return rows[0];
};

export const update = async (id, data) => {
  const fields = [];
  const values = [];
  const map = { name: 'name', email: 'email', phone: 'phone', subject: 'subject', salary: 'salary', status: 'status', avatar: 'avatar' };
  Object.entries(data || {}).forEach(([k, v]) => {
    if (map[k] !== undefined) { values.push(v); fields.push(`${map[k]} = $${values.length}`); }
  });
  if (!fields.length) return await getById(id);
  values.push(id);
  const { rowCount } = await query(`UPDATE teachers SET ${fields.join(', ')} WHERE id = $${values.length}`, values);
  if (!rowCount) return null;
  return await getById(id);
};

export const remove = async (id) => {
  const { rowCount } = await query('DELETE FROM teachers WHERE id = $1', [id]);
  return rowCount > 0;
};
