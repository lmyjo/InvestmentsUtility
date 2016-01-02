const assert = require('assert');
const helper = require('../testHelper');

describe('Owners', function () {
  describe('POST /api/owners', function () {
    it('should create a new owner and return the links', function (done) {
      helper.inject('post', '/api/owners')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200)
        .end(function (err, res){
          var ownerInstance = res.body;
          assert(typeof ownerInstance === 'object');
          assert(ownerInstance.links, 'must have links');
          assert(Array.isArray(ownerInstance.links));
          done();
        });
    });
  });

  describe('POST /api/owners/login', function () {
    it('should get a 200 Ok for the login action', function (done) {
      helper.inject('post', '/api/owners/login')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200, function (err, res){
          var loginResponse = res.body;
          assert(typeof loginResponse === 'object');
          assert(loginResponse.id, 'must have id');
          done();
        });
    });
  });

  describe('GET /api/owners/:id/projects', function () {
    it('should get a 401 Unathorized', function (done) {
      helper.inject('get', '/api/owners/1/projects')
        .expect(401, function (err, res) {
          done();
        });
    });

    it('should get a 200 Ok', function (done) {
      helper.inject('post', '/api/owners/login')
        .send({
          email: 'test@email.com',
          password: 'passwordExample'
        })
        .expect(200, function (err, res){
          var loginResponse = res.body;
          var accessToken = loginResponse.id;
          var userId = loginResponse.userId;
          helper.inject('get', '/api/owners/' + userId + '/projects')
            .set('Authorization', accessToken)
            .expect(200, function (err, res) {
              var emptyProjects = res.body;
              assert(Array.isArray(emptyProjects));
              assert(emptyProjects.length === 0);
              done();
            });
        });
    });
  });
});
