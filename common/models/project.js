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

  Project.disableRemoteMethod('find', true);
  Project.disableRemoteMethod('create', true);
  Project.disableRemoteMethod('upsert', true);
};
