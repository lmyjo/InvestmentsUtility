const supertest = require('supertest');
const app = require('../server/server');
const error = require('../common/lib/error');

module.exports = {
  inject: function json (verb, url) {
    return supertest(app)[verb](url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/);
  },
  errors: error
};
