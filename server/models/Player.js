const mongoose = require('mongoose');
const LocationSchema = require('./Location');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const PlayerSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Player ID is required.'],
  },
  createdAt: Date,
  updatedAt: Date,
  itinary: {
    destination: {
      type: ObjectId,
      ref: 'location',
    },
    origin: {
      type: ObjectId,
      ref: 'location',
    },
    departureTime: Date,
    arrivalTime: Date,
  },
});

PlayerSchema.virtual('isTraveling').get(function() {
  return (
    this.itinary.arrivalTime < Date.now() &&
    this.itinary.departureTime > Date.now()
  );
});

PlayerSchema.virtual('location')
  .get(function() {
    return this.itinary.destination;
  })
  .set(function(locationId) {
    this.itinary.origin = this.itinary.destination;
    this.itinary.destination = locationId;
  });

PlayerSchema.pre('save', function(next) {
  if (this.isNew) {
    // If new assign to a starter planet
    this.createdAt = this.updatedAt = Date.now();
    const Location = mongoose.model('location');
    Location.findOne({ starterPlanet: true })
      .then(planet => {
        if (planet) {
          this.itinary = {
            destination: planet._id,
            origin: planet._id,
            arrivalTime: Date.now(),
            departureTime: Date.now(),
          };
        }
        next();
      })
      .catch(err => next);
  }
  this.updatedAt = Date.now();
  next();
});

PlayerSchema.post('save', function(player) {
  const Location = mongoose.model('location');
  Location.update(
    { _id: player.itinary.destination },
    {
      $push: { players: player._id },
    }
  ).then(result => result); // ".then" is just to fullfil the promise
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;
