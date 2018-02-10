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
  itinary: ItinarySchema,
});

PlayerSchema.virtual('isTraveling').get(function() {
  return (
    this.itinary.arrivalTime < Date.now() &&
    this.itinary.departureTime > Date.now()
  );
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = Player;
