const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const expect = chai.expect;
const app = require('../../server');
const Location = require('../../server/models/Location');
chai.should();
chai.use(chaiHttp);

describe('The locations controller', () => {
  it('handles a POST request to /api/location', done => {
    Location.count().then(count => {
      chai
        .request(app)
        .post('/api/location')
        .send({
          name: 'Earth',
          type: 'planet',
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
    Location.create({ name: 'Earth', type: 'planet' }).then(location => {
      chai
        .request(app)
        .put(`/api/location/${location._id}`)
        .send({ name: 'Mars' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Location.findById(location._id)
            .then(updatedLocation => {
              updatedLocation.name.should.equal('Mars');
              updatedLocation.type.should.equal('planet');
              done();
            })
            .catch(err => done(err));
        });
    });
  });
  it('handles a DELETE request to /api/location/:id', done => {
    Location.create({ name: 'Earth', type: 'planet' }).then(location => {
      chai
        .request(app)
        .delete(`/api/location/${location._id}`)
        .end((err, res) => {
          if (err) {
            return done(err);
          }

          Location.findById(location._id)
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
      name: 'Earth',
      type: 'planet',
    });
    const marsLocation = new Location({ name: 'Mars', type: 'planet' });
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
});
