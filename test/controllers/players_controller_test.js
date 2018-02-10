const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const app = require('../../server');
const Player = require('../../server/models/Player');
chai.should();
chai.use(chaiHttp);

describe('The players controller', () => {
  it('handles a POST request to /api/location', done => {
    done();
  });
});
