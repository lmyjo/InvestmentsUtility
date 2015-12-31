const assert = require('assert');
const helper = require('../testHelper');

var accessToken;

describe('Projects', function () {
  describe('POST /api/owners/:id/projects', function () {
    it('should deny the creation of projects with 401 Unathorized', function (done) {
      helper.inject('post', '/api/owners/1/projects')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should create a new project', function (done) {
      helper.inject('post', '/api/owners/login')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200, function (err, res){
          var loginResponse = res.body;
          accessToken = loginResponse.id;
          var userId = loginResponse.userId;
          helper.inject('post', '/api/owners/' + userId + '/projects')
            .set('Authorization', accessToken)
            .send({
              name: 'Example project',
              startingDate: '2016-01-01',
              description: 'This is an example project'
            })
            .expect(200, function (err, res) {
              projectInstance = res.body;
              assert(res.statusCode === 200);
              assert(projectInstance.links, 'must have links');
              assert(Array.isArray(projectInstance.links));
              done();
            });
        });
    });
  });

  describe('GET /api/projects/:id', function () {
    it('should deny getting the project with 401 Unathorized', function (done) {
      helper.inject('get', '/api/projects/1')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should get the project with the specified id', function (done) {
      helper.inject('get', '/api/projects/1')
        .set('Authorization', accessToken)
        .expect(200, function (err, res) {
          projectInstance = res.body;
          assert(res.statusCode === 200);
          assert(projectInstance.links, 'must have links');
          assert(Array.isArray(projectInstance.links));
          assert(projectInstance.name === 'Example project');
          done();
        });
    });
  });

  describe('PUT /api/projects/:id', function () {
    it('should deny the modification of the project with 401 Unathorized', function (done) {
      helper.inject('put', '/api/projects/1')
        .send({
          name: 'Unsuccessful modification'
        })
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should modify the project with 200 Ok', function (done) {
      helper.inject('put', '/api/projects/1')
        .set('Authorization', accessToken)
        .send({
          name: 'Successful project modification'
        })
        .expect(200, function (err, res) {
          projectInstance = res.body;
          assert(res.statusCode === 200);
          assert(projectInstance.links, 'must have links');
          assert(Array.isArray(projectInstance.links));
          assert(projectInstance.name === 'Successful project modification');
          done();
        });
    });
  });

  describe('DELETE /api/projects/:id', function () {
    it('should deny the deletion with 401 Unathorized', function (done) {
      helper.inject('delete', '/api/projects/1')
        .expect(401, function (err, res) {
          assert(res.statusCode === 401);
          done();
        });
    });

    it('should delete the resource with 200 Ok', function (done) {
      helper.inject('post', '/api/owners/login')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200, function (err, res){
          var loginResponse = res.body;
          accessToken = loginResponse.id;
          var userId = loginResponse.userId;
          helper.inject('post', '/api/owners/' + userId + '/projects')
            .set('Authorization', accessToken)
            .send({
              name: 'Example project 2',
              startingDate: '2016-01-01',
              description: 'This is an example project for deletion'
            })
            .expect(200, function (err, res) {
              projectInstance = res.body;
              var idProject = projectInstance.id;
              helper.inject('delete', '/api/projects/' + idProject)
                .set('Authorization', accessToken)
                .expect(200, function (err, res) {
                  assert(res.statusCode === 200);
                  assert(res.body.count === 1);
                  done();
                });
            });
        });
    });
  });
});
