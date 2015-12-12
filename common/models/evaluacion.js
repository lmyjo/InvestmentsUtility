var lmyjoType = require('lmyjo-type');

module.exports = function(Evaluacion) {
  Evaluacion.observe('before save', function setCreatedDate (ctx, next) {
    if (ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.status = lmyjoType.getEstadoEvaluacion('evaluation_pending');
    }
    next();
  });
};
