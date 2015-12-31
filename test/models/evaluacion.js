const assert = require('assert');
const helper = require('../testHelper');
const lmyjoType = require('lmyjo-type');

var accessToken;

describe('Evaluaciones', function () {
  describe('POST /api/projects/:id/evaluaciones', function () {
    it('should deny the creation of eval with 401 Unathorized', function (done) {
      helper.inject('post', '/api/projects/1/evaluaciones')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should allow the creation of evals with 200 Ok', function (done) {
      helper.inject('post', '/api/owners/login')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200, function (err, res) {
          var loginResponse = res.body;
          accessToken = loginResponse.id;
          helper.inject('post', '/api/projects/1/evaluaciones')
            .set('Authorization', accessToken)
            .expect(200, function (err, res) {
              evalInstance = res.body;
              assert(res.statusCode === 200);
              assert(evalInstance.links, 'must have links');
              assert(Array.isArray(evalInstance.links));
              assert(evalInstance.id === 1);
              done();
            });
        });
    });
  });

  describe('GET /api/projects/:project_id/evaluaciones', function () {
    it('should deny getting all the evaluations of a project', function (done) {
      helper.inject('get', '/api/projects/1/evaluaciones')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should allow getting all the evaluations of a project', function (done) {
      helper.inject('get', '/api/projects/1/evaluaciones')
        .set('Authorization', accessToken)
        .expect(200, function (err, res) {
          assert(res.statusCode === 200);
          assert(Array.isArray(res.body));
          assert(res.body.length > 0);
          done();
      });
    });
  });

  describe('GET /api/projects/:project_id/evaluaciones/:id', function () {
    it('should deny getting the eval with 401 Unathorized', function (done) {
      helper.inject('get', '/api/projects/1/evaluaciones/1')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should allow getting the eval specified by id with 200 Ok', function (done) {
      helper.inject('get', '/api/projects/1/evaluaciones/1')
        .set('Authorization', accessToken)
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

  describe('PUT /api/projects/:project_id/evaluaciones/:id', function () {
    it('should deny the modification of the eval with 401 Unathorized', function (done) {
      helper.inject('put', '/api/projects/1/evaluaciones/1')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should allow the modification of evals with 200 Ok', function (done) {
      helper.inject('put', '/api/projects/1/evaluaciones/1')
        .set('Authorization', accessToken)
        .send({
          eval: {
            vpn: 100,
            tir: 0.05,
            bc: 1.5
          },
          status: lmyjoType.getEstadoEvaluacion('evaluation_complete')
        })
        .expect(200, function (err, res) {
          evalInstance = res.body;
          console.log(res.body);
          assert(res.statusCode === 200);
          assert(evalInstance.links, 'must have links');
          assert(Array.isArray(evalInstance.links));
          assert(evalInstance.id === 1);
          done();
        });
    });
  });

  describe('GET /api/projects/:project_id/evaluaciones/last', function () {
    it('should deny getting the last eval of a project', function (done) {
      helper.inject('get', '/api/projects/1/evaluaciones/last')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should get the last eval of a project', function (done) {
      helper.inject('get', '/api/projects/1/evaluaciones/last')
        .set('Authorization', accessToken)
        .expect(200, function (err, res) {
          var lastInstance = res.body;
          assert(res.statusCode === 200);
          assert(lastInstance.result, 'must have result');
          assert(lastInstance.result.evaluacion, 'must have evaluacion');
          assert(lastInstance.result.lastModification, 'must have lastModification');
          assert(lastInstance.result.operaciones, 'must have operaciones');
          done();
        });
    });
  });
});
