const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const app = require('../../server');
const Location = require('../../server/models/Location');
chai.should();
chai.use(chaiHttp);

describe('Location REST controller', () => {
  it('handles a POST request to /api/location', done => {
    Location.count().then(count => {
      chai
        .request(app)
        .post('/api/location')
        .send({
          id: '2',
          name: 'Earth',
          type: 'planet',
          kind: 'celestial',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Location.count()
            .then(newCount => {
              newCount.should.equal(count + 1);
              done();
            })
            .catch(err => done(err));
        });
    });
  });
  it('handles a PUT request to /api/location/:id', done => {
    Location.create({
      name: 'Earth',
      type: 'planet',
      id: 2,
      kind: 'celestial',
    }).then(location => {
      chai
        .request(app)
        .put(`/api/location/${location.id}`)
        .send({
          name: 'Mars',
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Location.findOne({ id: location.id })
            .then(updatedLocation => {
              updatedLocation.id.should.equal(2);
              updatedLocation.name.should.equal('Mars');
              updatedLocation.type.should.equal('planet');
              updatedLocation.kind.should.equal('celestial');
              done();
            })
            .catch(err => done(err));
        });
    });
  });
  it('handles a DELETE request to /api/location/:id', done => {
    Location.create({
      name: 'Earth',
      type: 'planet',
      id: 2,
      kind: 'celestial',
    }).then(location => {
      chai
        .request(app)
        .delete(`/api/location/${location.id}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Location.findOne({ id: location.id })
            .then(deletedLocation => {
              expect(deletedLocation).to.be.null;
              done();
            })
            .catch(err => done(err));
        });
    });
  });
  it('handles a GET request to /api/location', done => {
    const earthLocation = new Location({
      id: '2',
      name: 'Earth',
      type: 'planet',
      kind: 'celestial',
    });
    const marsLocation = new Location({
      name: 'Mars',
      type: 'planet',
      id: 3,
      kind: 'celestial',
    });
    Promise.all([earthLocation.save(), marsLocation.save()])
      .then(locations => {
        chai
          .request(app)
          .get('/api/location')
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            res.body.length.should.equal(2);
            done();
          });
      })
      .catch(err => done(err));
  });
  it('handles a GET request to /api/location/:id', done => {
    Location.create({
      id: '2',
      name: 'Earth',
      type: 'planet',
      kind: 'celestial',
    })
      .then(location => {
        chai
          .request(app)
          .get(`/api/location/${location.id}`)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            res.body.id.should.equal(2);
            res.body.name.should.equal('Earth');
            res.body.type.should.equal('planet');
            res.body.kind.should.equal('celestial');
            done();
          });
      })
      .catch(err => done(err));
  });
});
