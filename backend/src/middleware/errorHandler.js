// Manejador global de errores para devolver respuestas uniformes en español.
const errorHandler = (err, req, res, next) => {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({
    mensaje: err.message || 'Error interno del servidor',
    detalle: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};

export default errorHandler;
