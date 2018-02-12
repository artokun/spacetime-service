const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const LocationSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  kind: {
    type: String,
    required: true,
    validate: value => ['system', 'celestial', 'station'].indexOf(value) >= 0,
    msg: 'kind must be a "system", "celestial" or "station"',
  },
  type: {
    type: String,
    required: true,
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

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
