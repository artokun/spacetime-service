const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const app = require('../../server');
const Player = require('../../server/models/Player');
const Location = require('../../server/models/Location');
chai.should();
chai.use(chaiHttp);

describe('Player REST controller', () => {
  let planets, player;

  beforeEach(done => {
    const names = [
      { name: 'Mercury', distanceFromCenter: 0.39 },
      { name: 'Venus', distanceFromCenter: 0.72 },
      { name: 'Earth', distanceFromCenter: 1.0, starterPlanet: true },
      { name: 'Mars', distanceFromCenter: 1.54 },
    ];
    const newPlanets = names.map((planet, index) => {
      return { ...planet, id: index, kind: 'celestial', type: 'planet' };
    });
    Location.create(newPlanets).then(createdPlanets => {
      planets = createdPlanets;
      Player.create({ id: 1 }).then(createdPlayer => {
        player = createdPlayer;
        done();
      });
    });
  });

  it('handles a POST request to /api/player/', done => {
    chai
      .request(app)
      .post(`/api/player/`)
      .send({ id: 2 })
      .end((err, res) => {
        if (err) return done(err);
        Player.findOne({ id: res.body.id }).then(fetchedPlayer => {
          Location.findOne({ players: fetchedPlayer._id }).then(
            fetchedLocation => {
              expect(res.body.id).to.equal(2);
              expect(fetchedPlayer.id).to.equal(2);
              expect(fetchedLocation.id).to.equal(2);
              done();
            }
          );
        });
      });
  });
  it('handles a PUT request to /api/player/:id', done => {
    chai
      .request(app)
      .put(`/api/player/${player.id}`)
      .send({ id: 5 })
      .end((err, res) => {
        if (err) return done(err);

        Player.find({}).then(players => {
          expect(players.length).to.equal(1);
          done();
        });
      });
  });
  it('handles a DELETE request to /api/player/:id', done => {
    chai
      .request(app)
      .delete(`/api/player/${player.id}`)
      .end(() => {
        Player.findOne({ id: player.id }).then(fetchedPlayer => {
          Location.find({ players: player._id }).then(fetchedLocation => {
            expect(fetchedPlayer).to.be.null;
            expect(fetchedLocation).to.be.empty;
            done();
          });
        });
      });
  });
  it('handles a GET request to /api/player/', done => {
    Player.create({ id: 2 }).then(() => {
      chai
        .request(app)
        .get('/api/player')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.length).to.equal(2);
          done();
        });
    });
  });
  it('handles a GET request to /api/player/:id', done => {
    Player.create({ id: 2 }).then(() => {
      chai
        .request(app)
        .get(`/api/player/${player.id}`)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.id).to.equal(1);
          done();
        });
    });
  });
  it('handles a GET request to /api/player/:id/currentLocation', done => {
    chai
      .request(app)
      .get(`/api/player/${player.id}/currentLocation`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.name).to.equal('Earth');
        done();
      });
  });
  it('handles a GET request to /api/player/:id/celestials', done => {
    chai
      .request(app)
      .get(`/api/player/${player.id}/celestials`)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(3);
        const planets = res.body.map(planet => planet.name);
        expect(planets).to.contain('Mars', 'Venus', 'Mercury');
        expect(planets).to.not.contain('Earth');
        done();
      });
  });
  it('handles a POST request to /api/player/travelTo', done => {
    chai
      .request(app)
      .post('/api/player/travelTo')
      .send({ id: player.id, destination: planets[3].id }) //currently on planets[2]
      .end((err, res) => {
        if (err) return done(err);
        Player.findOne({ id: player.id }).then(fetchedPlayer => {
          Location.find({
            players: fetchedPlayer._id,
          }).then(fetchedLocations => {
            expect(fetchedPlayer.itinary.destination.toString()).to.equal(
              planets[3]._id.toString()
            );
            expect(fetchedPlayer.itinary.origin.toString()).to.equal(
              planets[2]._id.toString()
            );
            expect(fetchedLocations.length).to.equal(1);
            expect(fetchedLocations[0]._id.toString()).to.equal(
              planets[3]._id.toString()
            );
            done();
          });
        });
      });
  });
});
