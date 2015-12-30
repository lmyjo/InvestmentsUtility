var Linker = require('../lib/linker');

module.exports = function(Owner) {
  Owner.observe('loaded', function setLink(context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToInstance(Owner, 'owners', data);
    next();
  });

  Owner.observe('after save', function setLink(context, next) {
    var data = context.instance || context.data;
    Linker.addLinksToInstance(Owner, 'owners', data);
    next();
  });
};
