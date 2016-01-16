var lmyjoType = require('lmyjo-type');
var error = require('../lib/error');
var Linker = require('../lib/linker');

function validatePeriodic (dataSet, tipoFactor, next) {
  if (tipoFactor === 'periodico' || tipoFactor === 'gradiente') {
    if (!dataSet.duracion) {
      return next(error.getOptionalNotPresentError('duracion'));
    }
  }
  if (tipoFactor === 'gradiente') {
    if (!dataSet.incremento) {
      return next(error.getOptionalNotPresentError('incremento'));
    }
  }
  next();
}

module.exports = function(Operacion) {

  Operacion.observe('before save', function tipoOperacionValidation (ctx, next) {
    var tipoOperacion = (ctx.instance)? ctx.instance.tipo_operacion : ctx.data.tipo_operacion;
    if (tipoOperacion) {
      var type = lmyjoType.getTipoMovimiento(tipoOperacion);
      if (type === null) {
        return next(error.getUnsuportedValueError('tipo_operacion'));
      }
    }
    next();
  });

  Operacion.observe('before save', function tipoFactorValidation (ctx, next) {
    var tipoFactor = (ctx.instance)? ctx.instance.tipo_factor : ctx.data.tipo_factor;
    if (tipoFactor) {
      var type = lmyjoType.getTipoFactor(tipoFactor);
      if (type === null) {
        return next(error.getUnsuportedValueError('tipo_factor'));
      }
    }
    next();
  });

  Operacion.observe('before save', function unidadTiempoValidation (ctx, next) {
    var unidadTiempo = (ctx.instance)? ctx.instance.unidad_tiempo : ctx.data.unidad_tiempo;
    if (unidadTiempo) {
      var type = lmyjoType.getUnidadTiempo(unidadTiempo);
      if (type === null) {
        return next(error.getUnsuportedValueError('unidad_tiempo'));
      }
    }
    next();
  });

  Operacion.observe('before save', function periodicValidation (ctx, next) {
    var tipoFactor = (ctx.instance)? ctx.instance.tipo_factor : ctx.data.tipo_factor;
    var dataSet = ctx.instance || ctx.data;

    validatePeriodic(dataSet, tipoFactor, next);
  });

  Operacion.observe('before save', function setFechaCreacion (ctx, next) {
    if (ctx.instance) {
      ctx.instance.fecha_creacion = new Date();
    }
    next();
  });

  Operacion.observe('before save', function setFechaModifcacion (ctx, next) {
    if (ctx.instance) {
      ctx.instance.fecha_modificacion = new Date();
    }
    else {
      ctx.data.fecha_modificacion = new Date();
    }
    next();
  });

  Operacion.observe('before save', function updateFechaModificacion (ctx, next) {
    var dataSet = ctx.instance || ctx.data;

    if (dataSet.project_id) {
      var Project = Operacion.app.models.Project;

      var projectId = dataSet.project_id;
      Project.findById(projectId, function (err, project) {
        if (err) {
          console.log(error);
          return next(err);
        }
        if (project) {
          project.lastModification = new Date();
          Project.upsert(project, function (err) {
            if(err) {
              console.log(error);
              return next(err);
            }
            return next();
          });
        } else return next();
      });
    } else {
      return next();
    }
  });

  Operacion.observe('loaded', function setLink (context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToChildInstance('operaciones', data);
    next();
  });

  Operacion.observe('after save', function setLink (context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToChildInstance('operaciones', data);
    next();
  });

};
