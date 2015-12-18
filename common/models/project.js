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
      arg: 'last',
      type: 'object'
    },
    description: 'Get the last evaluation for the project'
  });

  Project.lastEval = function getLastEval (id, callback) {
    var Evaluacion = Project.app.models.Evaluacion;

    var query = {
      where: {
        project_id: id
      },
      order: 'created DESC',
      limit: 1
    };

    Evaluacion.find(query, function findCallback (err, evaluation) {
      if (err) {
        console.log(err);
        return callback(err);
      }
      return callback(null, evaluation[0] || null);
    });
  }


  Project.disableRemoteMethod('find', true);
  Project.disableRemoteMethod('create', true);
  Project.disableRemoteMethod('upsert', true);
};
