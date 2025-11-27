import { query } from '../config/db.js';

export const list = async ({ page = 1, pageSize = 50, q, class: cls, section }) => {
  const offset = (page - 1) * pageSize;
  const where = [];
  const params = [];
  if (q) {
    params.push(`%${q.toLowerCase()}%`);
    where.push(`(LOWER(name) LIKE $${params.length} OR LOWER(roll_number) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(rfid_tag) LIKE $${params.length})`);
  }
  if (cls) {
    params.push(cls);
    where.push(`class = $${params.length}`);
  }
  if (section) {
    params.push(section);
    where.push(`section = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const countSql = `SELECT COUNT(*)::int AS count FROM students ${whereSql}`;
  const { rows: countRows } = await query(countSql, params);
  const total = countRows[0]?.count || 0;

  const dataSql = `SELECT id, name, email, roll_number AS "rollNumber", class, section, rfid_tag AS "rfidTag", attendance, fee_status AS "feeStatus", bus_number AS "busNumber", bus_assigned AS "busAssigned", parent_name AS "parentName", parent_phone AS "parentPhone", status, admission_date AS "admissionDate", avatar FROM students ${whereSql} ORDER BY id DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  const { rows } = await query(dataSql, [...params, pageSize, offset]);
  return { rows, total, page, pageSize };
};

export const getById = async (id) => {
  const { rows } = await query(
    'SELECT id, name, email, roll_number AS "rollNumber", class, section, rfid_tag AS "rfidTag", attendance, fee_status AS "feeStatus", bus_number AS "busNumber", bus_assigned AS "busAssigned", parent_name AS "parentName", parent_phone AS "parentPhone", status, admission_date AS "admissionDate", avatar FROM students WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

export const create = async (data) => {
  const {
    name, email, rollNumber, class: cls, section, rfidTag, attendance, feeStatus,
    busNumber, busAssigned, parentName, parentPhone, status = 'active', admissionDate, avatar
  } = data;
  const { rows } = await query(
    `INSERT INTO students (name, email, roll_number, class, section, rfid_tag, attendance, fee_status, bus_number, bus_assigned, parent_name, parent_phone, status, admission_date, avatar)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING id, name, email, roll_number AS "rollNumber", class, section, rfid_tag AS "rfidTag", attendance, fee_status AS "feeStatus", bus_number AS "busNumber", bus_assigned AS "busAssigned", parent_name AS "parentName", parent_phone AS "parentPhone", status, admission_date AS "admissionDate", avatar`,
    [name, email || null, rollNumber || null, cls || null, section || null, rfidTag || null, attendance || 0, feeStatus || 'paid', busNumber || null, busAssigned ?? false, parentName || null, parentPhone || null, status, admissionDate || new Date(), avatar || null]
  );
  return rows[0];
};

export const update = async (id, data) => {
  // Build dynamic update
  const fields = [];
  const values = [];
  const map = {
    name: 'name', email: 'email', rollNumber: 'roll_number', class: 'class', section: 'section', rfidTag: 'rfid_tag', attendance: 'attendance', feeStatus: 'fee_status', busNumber: 'bus_number', busAssigned: 'bus_assigned', parentName: 'parent_name', parentPhone: 'parent_phone', status: 'status', admissionDate: 'admission_date', avatar: 'avatar'
  };
  Object.entries(data || {}).forEach(([k, v]) => {
    if (map[k] !== undefined) {
      values.push(v);
      fields.push(`${map[k]} = $${values.length}`);
    }
  });
  if (!fields.length) return await getById(id);
  values.push(id);
  const { rowCount } = await query(`UPDATE students SET ${fields.join(', ')} WHERE id = $${values.length}`, values);
  if (!rowCount) return null;
  return await getById(id);
};

export const remove = async (id) => {
  const { rowCount } = await query('DELETE FROM students WHERE id = $1', [id]);
  return rowCount > 0;
};
