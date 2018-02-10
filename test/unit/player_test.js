const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const app = require('../../server');
const Player = require('../../server/models/Player');
const Location = require('../../server/models/Location');
chai.should();
chai.use(chaiHttp);

describe('Player', () => {
  xit('should not fail', () => {});
});
