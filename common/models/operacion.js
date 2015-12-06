module.exports = function(Operacion) {

  Operacion.observe('before save', function setFechaCreacion (ctx, next) {
    if (ctx.instance) {
      ctx.instance.fecha_creacion = new Date();
    }
    next();
  });

};
