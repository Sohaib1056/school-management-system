import { query } from '../config/db.js';

export const list = async ({ page = 1, pageSize = 50, q }) => {
  const offset = (page - 1) * pageSize;
  const params = [];
  const where = [];
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    where.push(`(LOWER(title) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const { rows: countRows } = await query(`SELECT COUNT(*)::int AS count FROM assignments ${whereSql}`, params);
  const total = countRows[0]?.count || 0;

  const { rows } = await query(
    `SELECT id, title, description, due_date AS "dueDate", class, section, created_by AS "createdBy" FROM assignments ${whereSql} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, pageSize, offset]
  );
  return { rows, total, page, pageSize };
};

export const getById = async (id) => {
  const { rows } = await query('SELECT id, title, description, due_date AS "dueDate", class, section, created_by AS "createdBy" FROM assignments WHERE id = $1', [id]);
  return rows[0] || null;
};

export const create = async ({ title, description, dueDate, class: cls, section }, user) => {
  const { rows } = await query(
    'INSERT INTO assignments (title, description, due_date, class, section, created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, title, description, due_date AS "dueDate", class, section, created_by AS "createdBy"',
    [title, description || null, dueDate || null, cls || null, section || null, user?.id || null]
  );
  return rows[0];
};

export const update = async (id, data) => {
  const fields = [];
  const values = [];
  const map = { title: 'title', description: 'description', dueDate: 'due_date', class: 'class', section: 'section' };
  Object.entries(data || {}).forEach(([k, v]) => { if (map[k] !== undefined) { values.push(v); fields.push(`${map[k]} = $${values.length}`); } });
  if (!fields.length) return await getById(id);
  values.push(id);
  const { rowCount } = await query(`UPDATE assignments SET ${fields.join(', ')} WHERE id = $${values.length}`, values);
  if (!rowCount) return null;
  return await getById(id);
};

export const remove = async (id) => {
  const { rowCount } = await query('DELETE FROM assignments WHERE id = $1', [id]);
  return rowCount > 0;
};

export const submitWork = async (assignmentId, studentId, { content }) => {
  const { rows } = await query(
    'INSERT INTO assignment_submissions (assignment_id, student_id, content) VALUES ($1,$2,$3) RETURNING id, assignment_id AS "assignmentId", student_id AS "studentId", content, submitted_at AS "submittedAt"',
    [assignmentId, studentId, content]
  );
  return rows[0];
};
