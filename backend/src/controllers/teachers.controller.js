import * as teachers from '../services/teachers.service.js';

export const list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 50, q } = req.query;
    const result = await teachers.list({ page: Number(page), pageSize: Number(pageSize), q });
    return res.json(result);
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const teacher = await teachers.getById(Number(req.params.id));
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    return res.json(teacher);
  } catch (e) { next(e); }
};

export const getSchedule = async (req, res, next) => {
  try {
    const schedule = await teachers.getSchedule(Number(req.params.id));
    return res.json(schedule);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const created = await teachers.create(req.body);
    return res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const updated = await teachers.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Teacher not found' });
    return res.json(updated);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const ok = await teachers.remove(Number(req.params.id));
    if (!ok) return res.status(404).json({ message: 'Teacher not found' });
    return res.json({ success: true });
  } catch (e) { next(e); }
};
