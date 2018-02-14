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
  xit('should be able to view all celestials in the same system', () => {});
  xit("should be able to see what celestial he's on", () => {});
  xit('should be able build a route to another celestial', () => {});
  xit('should be able to use a cached route', () => {});
  xit('should be able embark on a voyage towards another celestial', () => {});
  xit('should be on a route and not be on any planet while voyaging', () => {});
  xit('should be on the target planet he embarked towards once travel duration expires', () => {});
});
