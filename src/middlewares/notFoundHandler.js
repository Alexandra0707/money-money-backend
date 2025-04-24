import createError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Route not found'));
};

export default notFoundHandler;