const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const LocationSchema = new Schema({
  id: {
    type: Number,
    required: [true, 'Location ID is required.'],
  },
  name: {
    type: String,
    required: [true, 'Location Name is required.'],
  },
  kind: {
    type: String,
    required: [
      true,
      'Location Kind is required. "system", "celestial" or "station"',
    ],
    validate: value => ['system', 'celestial', 'station'].indexOf(value) >= 0,
    msg: 'kind must be a "system", "celestial" or "station"',
  },
  type: {
    type: String,
    required: [
      true,
      'Location Kind is required. "planet", "gas_giant" or "asteroid"',
    ],
    validate: value => ['planet', 'gas_giant', 'asteroid'].indexOf(value) >= 0,
    msg: 'type must be a "planet", "gas_giant" or "asteroid"',
  },
  distanceFromCenter: Number,
  starterPlanet: {
    type: Boolean,
    default: false,
  },
  players: [
    {
      type: ObjectId,
      ref: 'player',
    },
  ],
});

LocationSchema.pre('save', function(next) {
  if (!this.distanceFromCenter) {
    this.distanceFromCenter = Math.random() * 50;
    return next();
  }
  next();
});

LocationSchema.static('celestials', function(player, cb) {
  return this.find({ kind: 'celestial', players: { $nin: [player._id] } }, cb);
});

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
