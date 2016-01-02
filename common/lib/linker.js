function generateLink (linkArray, plural, url) {
  var link = {
    rel: plural,
    uri: url
  };
  linkArray.push(link);
}

function generateLinksFromRelation (linkArray, model, baseUrl) {
  var relations = model.relations;
  for (var relatedModel in relations) {
    if (relations[relatedModel].type !== 'belongsTo') {
      var uri = baseUrl + '/' + relatedModel;
      generateLink(linkArray, relatedModel, uri);
    }
  }

}

module.exports = {
  addLinksToInstance: function generateLinks (model, plural, instance) {
    if (instance) {
      var linkArray = new Array();
      var baseUrl = '/api/' + plural + '/' + instance.id;
      var apiModels = 'projects owners';

      if (~apiModels.indexOf(plural))
        generateLink(linkArray, plural, baseUrl);

      if (plural === 'owners')
        generateLink(linkArray, 'login', '/api/owners/login');

      generateLinksFromRelation(linkArray, model, baseUrl);

      instance.links = linkArray;
    }
  },
  addLinksToChildInstance: function generateLinkForChild (plural, instance) {
    if (instance) {
      var linkArray = new Array();
      var baseUrl = '/api/projects/' + instance.project_id + '/' + plural;
      baseUrl += '/' + instance.id;
      generateLink(linkArray, plural, baseUrl);
      instance.links = linkArray;
    }
  }
}
