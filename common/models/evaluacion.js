var Linker = require('../lib/linker');
var lmyjoType = require('lmyjo-type');

module.exports = function(Evaluacion) {
  Evaluacion.observe('before save', function setCreatedDate (ctx, next) {
    if (ctx.instance) {
      ctx.instance.created = new Date();
      ctx.instance.status = lmyjoType.getEstadoEvaluacion('evaluation_pending');
    }
    next();
  });

  Evaluacion.observe('loaded', function setLink(context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToInstance(Evaluacion, 'evaluaciones', data);
    next();
  });

  Evaluacion.observe('after save', function setLink(context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToInstance(Evaluacion, 'evaluaciones', data);
    next();
  });
};
