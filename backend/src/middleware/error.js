export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = {
    message: err.message || 'Internal Server Error',
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  if (err.errors) payload.errors = err.errors;
  res.status(status).json(payload);
};
