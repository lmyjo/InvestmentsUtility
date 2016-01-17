const assert = require('assert');
const helper = require('../testHelper');

var accessToken;

describe('Operaciones', function () {
  describe('POST /api/projects/:id/operaciones', function () {
    it('should deny the creation of operations with 401 Unathorized', function (done) {
      helper.inject('post', '/api/projects/1/operaciones')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should allow the creation of operations with 200 Ok', function (done) {
      helper.inject('post', '/api/owners/login')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200, function (err, res) {
          var loginResponse = res.body;
          accessToken = loginResponse.id;
          helper.inject('post', '/api/projects/1/operaciones')
            .set('Authorization', accessToken)
            .send({
              nombre:'Example operation',
              tipo_operacion: 'ingreso',
              unidad_tiempo: 'año',
              tipo_factor: 'simple',
              cantidad_monetaria: 200,
              tasa_interes: 14,
              periodo_inicial: 1
            })
            .expect(200, function (err, res) {
              operationInstance = res.body;
              assert(res.statusCode === 200);
              assert(operationInstance.links, 'must have links');
              assert(Array.isArray(operationInstance.links));
              assert(operationInstance.id === 1);
              done();
            });
        });
    });

    it('should answer with 422 for incorrect values', function (done) {
      helper.inject('post', '/api/projects/1/operaciones')
        .set('Authorization', accessToken)
        .send({
          nombre:'Example operation 2',
          tipo_operacion: '1',
          unidad_tiempo: 'año',
          tipo_factor: 'periodico',
          cantidad_monetaria: 200,
          tasa_interes: 14,
          periodo_inicial: 1
        })
        .expect(422, function (err, res) {
          assert(res.statusCode === 422);
          var error = {
              error: helper.errors.getUnsuportedValueError('tipo_operacion')
          };
          assert.deepEqual(res.body, error);
          done();
        });
    });

    describe('POST tipo_factor = periodico', function (done) {
      it('should answer with 422 for incomplete parameters when creating periodic', function (done) {
        helper.inject('post', '/api/projects/1/operaciones')
          .set('Authorization', accessToken)
          .send({
            nombre:'Example operation 2',
            tipo_operacion: 'ingreso',
            unidad_tiempo: 'año',
            tipo_factor: 'periodico',
            cantidad_monetaria: 200,
            tasa_interes: 14,
            periodo_inicial: 1
          })
          .expect(422, function (err, res) {
            assert(res.statusCode === 422);
            var presenceError = {
                error: helper.errors.getOptionalNotPresentError('duracion')
            };
            assert.deepEqual(res.body, presenceError);
            done();
          });
      });

      it('should create a periodic operation', function (done) {
        helper.inject('post', '/api/projects/1/operaciones')
          .set('Authorization', accessToken)
          .send({
            nombre:'Example operation 2',
            tipo_operacion: 'ingreso',
            unidad_tiempo: 'año',
            tipo_factor: 'periodico',
            cantidad_monetaria: 200,
            tasa_interes: 14,
            periodo_inicial: 1,
            periodicidad: 4,
            duracion: 3
          })
          .expect(200, function (err, res){
            operationInstance = res.body;
            assert(res.statusCode === 200);
            assert(operationInstance.links, 'must have links');
            assert(Array.isArray(operationInstance.links));
            assert(operationInstance.id === 2);
            done();
          });
      });
    });

    describe('POST tipo_factor = gradiente', function (done) {
      it('should answer with 422 for incomplete parameters when creating periodic', function (done) {
        helper.inject('post', '/api/projects/1/operaciones')
          .set('Authorization', accessToken)
          .send({
            nombre:'Example operation 3',
            tipo_operacion: 'ingreso',
            unidad_tiempo: 'año',
            tipo_factor: 'gradiente',
            cantidad_monetaria: 200,
            tasa_interes: 14,
            periodo_inicial: 1,
            duracion: 10,
            periodicidad: 1
          })
          .expect(422, function (err, res) {
            assert(res.statusCode === 422);
            var presenceError = {
                error: helper.errors.getOptionalNotPresentError('incremento')
            };
            assert.deepEqual(res.body, presenceError);
            done();
          });
      });

      it('should create a periodic operation', function (done) {
        helper.inject('post', '/api/projects/1/operaciones')
          .set('Authorization', accessToken)
          .send({
            nombre:'Example operation 3',
            tipo_operacion: 'ingreso',
            unidad_tiempo: 'año',
            tipo_factor: 'gradiente',
            cantidad_monetaria: 200,
            tasa_interes: 14,
            periodo_inicial: 1,
            periodicidad: 4,
            duracion: 3,
            incremento: 100
          })
          .expect(200, function (err, res){
            operationInstance = res.body;
            assert(res.statusCode === 200);
            assert(operationInstance.links, 'must have links');
            assert(Array.isArray(operationInstance.links));
            assert(operationInstance.id === 3);
            done();
          });
      });
    });

  });

  describe('GET /api/projects/:id/operaciones', function () {
    it('should deny the access to the operations without access token', function (done) {
      helper.inject('get', '/api/projects/1/operaciones')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should get the operations of the project', function (done) {
      helper.inject('get', '/api/projects/1/operaciones')
        .set('Authorization', accessToken)
        .expect(200, function (err, res) {
          assert(res.statusCode === 200);
          assert(Array.isArray(res.body));
          assert(res.body.length > 0);
          done();
        });
    });
  });

  describe('GET /api/projects/:project_id/operaciones/:id', function () {
    it('should deny the access to the operation without access token', function (done) {
      helper.inject('get', '/api/projects/1/operaciones/1')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should get the operation with the id', function (done) {
      helper.inject('get', '/api/projects/1/operaciones/1')
        .set('Authorization', accessToken)
        .expect(200, function (err, res) {
          var operationInstance = res.body;
          assert(res.statusCode === 200);
          assert(operationInstance.links, 'must have links');
          assert(Array.isArray(operationInstance.links));
          assert(operationInstance.id === 1);
          done();
        });
    });
  });
});
