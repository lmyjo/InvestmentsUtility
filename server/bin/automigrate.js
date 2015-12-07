var app = require('../server');

// Carga la Base de datos investments
var dataSource = app.dataSources.investments;

// Hace la creación de la tabla Operacion 
dataSource.automigrate('Operacion', function(err) {
  if (err) throw err;

  //Imprime la información del modelo creado
  dataSource.discoverModelProperties('Operacion', function (err, props) {
    console.log(props);
  });
  
});

// Hace la creación de la tabla Owner 
dataSource.automigrate('Owner', function(err) {
  if (err) throw err;

  //Imprime la información del modelo creado
  dataSource.discoverModelProperties('Owner', function (err, props) {
    console.log(props);
  });
  
});

// Hace la creación de la tabla project 
dataSource.automigrate('project', function(err) {
  if (err) throw err;

  //Imprime la información del modelo creado
  dataSource.discoverModelProperties('project', function (err, props) {
    console.log(props);
    dataSource.disconnect();
  });
  
});
