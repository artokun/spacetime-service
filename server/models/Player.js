const mongoose = require('mongoose');
const LocationSchema = require('./Location');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ItinarySchema = {
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
};

const PlayerSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Player ID is required.'],
  },
  createdAt: Date,
  updatedAt: Date,
  itinary: ItinarySchema,
});

PlayerSchema.virtual('isTraveling').get(function() {
  return this.itinary.arrivalTime < Date.now() > this.itinary.departureTime;
});

PlayerSchema.virtual('location')
  .get(function() {
    return this.itinary.destination;
  })
  .set(function(locationId) {
    this.itinary.origin = this.itinary.destination;
    this.itinary.destination = locationId;
  });

PlayerSchema.pre('validate', async function(next) {
  if (this.isNew) {
    const player = await this.model('player').findOne({ id: this.id });
    if (player) {
      return next({ message: `Duplicate Player ID: ${this.id}` });
    }
  }
  next();
});
PlayerSchema.pre('save', async function(next) {
  if (this.isNew) {
    // If new assign to a starter planet)
    this.createdAt = this.updatedAt = Date.now();
    const Location = this.model('location');
    const starterPlanet = await Location.findOne({ starterPlanet: true });

    this.itinary = {
      destination: starterPlanet._id,
      origin: starterPlanet._id,
      arrivalTime: Date.now(),
      departureTime: Date.now(),
    };
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

PlayerSchema.index({ id: 1 }, { unique: true });

const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;
