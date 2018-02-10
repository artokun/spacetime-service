const mongoose = require('mongoose');
const LocationSchema = require('./Location');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ItinarySchema = new Schema({
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
});

const PlayerSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Player ID is required.'],
  },
  location: {
    type: ObjectId,
    ref: 'location',
  },
  createdAt: Date,
  updatedAt: Date,
  itinary: ItinarySchema,
});

PlayerSchema.virtual('isTraveling').get(function() {
  return (
    this.itinary.arrivalTime < Date.now() &&
    this.itinary.departureTime > Date.now()
  );
});

PlayerSchema.pre('save', function(next) {
  if (this.isNew) {
    // If new assign to a starter planet
    this.createdAt = this.updatedAt = Date.now();
    const Location = mongoose.model('location');
    Location.findOne({ starterPlanet: true })
      .then(planet => {
        this.location = planet._id;
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
    { _id: player.location },
    {
      $push: { players: player._id },
    }
  );
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;
