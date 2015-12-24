function generateLink (linkArray, plural, url) {
  var link = {
    rel: plural,
    uri: url
  };
  linkArray.push(link);
}

function generateLinksFromRelation (linkArray, model, baseUrl) {
  var relations = model.relations
  for (relatedModel in relations) {
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

      generateLinksFromRelation(linkArray, model, baseUrl);

      instance.links = linkArray;
    }
  }
}
