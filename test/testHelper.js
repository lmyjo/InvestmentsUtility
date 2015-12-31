const supertest = require('supertest');
const app = require('../server/server');

module.exports = {
  inject: function json (verb, url) {
    return supertest(app)[verb](url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
  }
};
