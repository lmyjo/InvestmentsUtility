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

var tipo_operacion = [
  {
    descripcion: 'Ingreso'
  },
  {
    descripcion: 'Costo'
  }
];

// Hace la creación de la tabla TipoOperacion 
dataSource.automigrate('TipoOperacion', function(err) {
  if (err) throw err;

  // Carga el modelo TipoOperacion
  var TipoOperacion = app.models.TipoOperacion;
  var count = tipo_operacion.length;
  tipo_operacion.forEach(function(nuevo_tipo) {
     // Inserta el nuevo elemento en la tabla Usuario
     TipoOperacion.create(nuevo_tipo, function(err, record) {
      if (err) return console.log(err);

      console.log('Registro almacenado:', record);

      count--;

      if (count === 0) {
        console.log('Terminada la carga de TipoOperacion');
        //dataSource.disconnect();
      }
    });
  });
  
});

var unidad_tiempo = [
  {
    descripcion: 'Diario'
  },
  {
    descripcion: 'Semanal'
  },
  {
    descripcion: 'Mensual'
  },
  {
    descripcion: 'Anual'
  }
];


// Hace la creación de la tabla UnidadTiempo 
dataSource.automigrate('UnidadTiempo', function(err) {
  if (err) throw err;

  // Carga el modelo UnidadTiempo
  var UnidadTiempo = app.models.UnidadTiempo;
  var count = unidad_tiempo.length;
  unidad_tiempo.forEach(function(nueva_unidad) {
     // Inserta el nuevo elemento en la tabla Usuario
     UnidadTiempo.create(nueva_unidad, function(err, record) {
      if (err) return console.log(err);

      console.log('Registro almacenado:', record);

      count--;

      if (count === 0) {
        console.log('Terminada la carga de UnidadTiempo');
        dataSource.disconnect();
      }
    });
  });
  
});


