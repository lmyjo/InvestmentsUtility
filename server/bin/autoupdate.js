var app = require('../server');

// Carga la Base de datos investments
var dataSource = app.dataSources.investments;

// Hace el update de la tabla Operacion 
dataSource.autoupdate('Operacion', function(err) {
  if (err) throw err;

  //Imprime la información del modelo actualizado
  dataSource.discoverModelProperties('Operacion', function (err, props) {
    console.log(props);
  });
  
});

// Hace el update de la tabla Owner 
dataSource.autoupdate('Owner', function(err) {
  if (err) throw err;

  //Imprime la información del modelo actualizado
  dataSource.discoverModelProperties('Owner', function (err, props) {
    console.log(props);
  });
  
});

// Hace el update de la tabla project 
dataSource.autoupdate('project', function(err) {
  if (err) throw err;

  //Imprime la información del modelo actualizado
  dataSource.discoverModelProperties('project', function (err, props) {
    console.log(props);
    dataSource.disconnect();
  });
  
});
