var Linker = require('../lib/linker');
var lmyjoType = require('lmyjo-type');

module.exports = function(Evaluacion) {
  Evaluacion.observe('before save', function setDefaultValues (ctx, next) {
    if (ctx.instance) {
      ctx.instance.created = new Date();
      var evalObject = {
        vpn: 0,
        tir: 0,
        bc: 0
      };
      ctx.instance.eval = evalObject;
      ctx.instance.status = lmyjoType.getEstadoEvaluacion('evaluation_pending');
    }
    next();
  });

  Evaluacion.observe('loaded', function setLink(context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToChildInstance('evaluaciones', data);
    next();
  });

  Evaluacion.observe('after save', function setLink(context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToChildInstance('evaluaciones', data);
    next();
  });
};
