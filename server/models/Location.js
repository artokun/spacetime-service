const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const LocationSchema = new Schema({
  name: String,
  type: String,
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
  destinations: [
    {
      type: ObjectId,
      ref: 'location',
    },
  ],
});

const Location = mongoose.model('location', LocationSchema);

module.exports = Location;
