import * as students from '../services/students.service.js';

export const list = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 50, q, class: cls, section } = req.query;
    const result = await students.list({ page: Number(page), pageSize: Number(pageSize), q, class: cls, section });
    return res.json(result);
  } catch (e) { next(e); }
};

export const getById = async (req, res, next) => {
  try {
    const student = await students.getById(Number(req.params.id));
    if (!student) return res.status(404).json({ message: 'Student not found' });
    return res.json(student);
  } catch (e) { next(e); }
};

export const create = async (req, res, next) => {
  try {
    const created = await students.create(req.body);
    return res.status(201).json(created);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const updated = await students.update(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    return res.json(updated);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    const ok = await students.remove(Number(req.params.id));
    if (!ok) return res.status(404).json({ message: 'Student not found' });
    return res.json({ success: true });
  } catch (e) { next(e); }
};
