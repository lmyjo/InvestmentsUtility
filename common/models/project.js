var async = require('async');
var Linker = require('../lib/linker');

module.exports = function(Project) {

  Project.observe('before save', function setCreatedDate (ctx, next) {
    if (ctx.instance) {
      ctx.instance.created = new Date();
    }
    next();
  });

  Project.observe('before save', function setLastModifiedDate (ctx, next) {
    if (ctx.instance) {
      ctx.instance.lastModification = new Date();
    } else {
      ctx.data.lastModification = new Date();
    }
    next();
  });

  Project.observe('loaded', function setLink (context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToInstance(Project, 'projects', data);
    next();
  });

  Project.observe('after save', function setLink (context, next){
    var data = context.instance || context.data;
    Linker.addLinksToInstance(Project, 'projects', data);
    next();
  });

  Project.remoteMethod('lastEval', {
    http: {
      path: '/:id/evaluaciones/last',
      verb: 'get'
    },
    accepts: {
      arg: 'id',
      type: 'string',
      required: true
    },
    returns : {
      arg: 'result',
      type: 'object'
    },
    description: 'Get the last evaluation for the project'
  });

  Project.lastEval = function getLastEval (id, callback) {
    var Evaluacion = Project.app.models.Evaluacion;
    var Operacion = Project.app.models.Operacion;

    async.series([
      function (callb) {
        var query = {
          where: {project_id: id},
          order: 'created DESC',
          limit: 1
        };
        Evaluacion.find(query, function findLastEvalCallback (err, evaluations) {
          if (err) return callb(err);
          callb(null, evaluations[0] || null);
        });
      },
      function (callb) {
        Project.findById(id, function findById (err, project) {
          if (err) return callb(err);
          if (project) {
            callb(null, project.lastModification);
          } else {
            callb(null, null);
          }
        });
      },
      function (callb) {
        var query = {
          where: {project_id: id}
        };
        Operacion.find(query, function findOperationCallback (err, operations) {
          if (err) return callb(err);
          callb(null, operations);
        });
      }
    ],
    function lastCallback(err, result){
      if (err) {
        console.log(err);
        return callback(err);
      }
      var resultObject = {
        evaluacion: result[0],
        lastModification: result[1],
        operaciones: result[2]
      };
      return callback(null, resultObject);
    });
  };


  Project.disableRemoteMethod('find', true);
  Project.disableRemoteMethod('create', true);
  Project.disableRemoteMethod('upsert', true);
};
