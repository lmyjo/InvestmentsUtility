var app = require('../server');

// Carga la Base de datos investments
var dataSource = app.dataSources.investments;

// Hace el update de la tabla Operacion 
dataSource.autoupdate('Operacion', function(err) {
  if (err) throw err;

  //Imprime la información del modelo creado
  dataSource.discoverModelProperties('Operacion', function (err, props) {
    console.log(props);
  });
  
});

// Hace la creación de la tabla TipoOperacion 
dataSource.autoupdate('TipoOperacion', function(err) {
  if (err) throw err;

  //Imprime la información del modelo creado
  dataSource.discoverModelProperties('TipoOperacion', function (err, props) {
    console.log(props);
  });
  
});

// Hace el update de la tabla UnidadTiempo 
dataSource.autoupdate('UnidadTiempo', function(err) {
  if (err) throw err;

  //Imprime la información del modelo creado
  dataSource.discoverModelProperties('UnidadTiempo', function (err, props) {
    console.log(props);
    dataSource.disconnect();
  });
  
});
