const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const app = require('../../server');
const Player = require('../../server/models/Player');
const Location = require('../../server/models/Location');
chai.should();
chai.use(chaiHttp);

describe('The players controller', () => {
  let planets, player;

  beforeEach(done => {
    const names = ['Mercury', 'Venus', 'Earth', 'Mars'];
    const newPlanets = names.map(name => {
      return { name, type: 'planet' };
    });
    newPlanets[2].starterPlanet = true;
    Promise.all([Location.create(newPlanets), Player.create({ id: 1 })]).then(
      results => {
        planets = results[0];
        player = results[1];
        done();
      }
    );
  });

  it('handles a POST request to /api/player/', done => {
    chai
      .request(app)
      .post(`/api/player/`)
      .send({ id: 2 })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.id).to.equal(2);
        done();
      });
  });
  it('handles a PUT request to /api/player/:id', done => {
    chai
      .request(app)
      .put(`/api/player/${player._id}`)
      .send({ location: planets[0]._id })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.location).to.equal(planets[0]._id.toString());
        done();
      });
  });
  xit('handles a DELETE request to /api/player/:id', () => {});
  xit('handles a GET request to /api/player/', () => {});
  xit('handles a GET request to /api/player/:id', () => {});
  xit('handles a GET request to /api/player/:id/locations', () => {});
  xit('handles a POST request to /api/player/travel', () => {});
});
