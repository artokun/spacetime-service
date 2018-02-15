const Player = require('../models/Player');
const Location = require('../models/Location');

module.exports = {
  create(req, res, next) {
    const { id } = req.body;

    if (id) {
      Player.create({
        id,
      })
        .then(player => res.send(player))
        .catch(next);
    } else {
      next('Player needs a Laravel API ID');
    }
  },
  update(req, res, next) {
    const updateable = ['id', 'location', 'itinary'];
    const update = {};

    updateable.forEach(field => {
      if (req.body[field]) {
        update[field] = req.body[field];
      }
    });

    Player.update({ id: req.params.id }, update)
      .then(player => {
        res.status(204).json(player);
      })
      .catch(next);
  },
  delete(req, res, next) {
    const playerId = req.params.id;
    let player;

    Player.findOne({ id: playerId })
      .then(player => {
        return Promise.all([
          Player.remove({ _id: player._id }),
          Location.update(
            { players: player._id },
            { $pull: { players: player._id } }
          ),
        ]);
      })
      .then(() => {
        res.status(204).send({ deleted: playerId });
      })
      .catch(next);
  },
  getAll(req, res, next) {
    Player.find({})
      .then(players => {
        res.json(players);
      })
      .catch(err => next(err));
  },
  getOne(req, res, next) {
    const { id } = req.params;

    Player.findOne({ id })
      .then(player => {
        res.json(player);
      })
      .catch(err => next(err));
  },
  currentLocation(req, res, next) {
    const { id } = req.params;
    Player.findOne({ id })
      .then(player => Location.findOne({ players: player._id }))
      .then(location => res.send(location))
      .catch(err => next(err));
  },
  celestials(req, res, next) {
    const { id } = req.params;
    Player.findOne({ id })
      .then(player => {
        Location.celestials(player, (err, celestials) => {
          if (err) return next(err);
          res.json(celestials);
        });
      })
      .catch(err => next(err));
  },
  travelTo: async (req, res, next) => {
    const { id, destination } = req.body;
    const location = await Location.findOne({ id: destination });
    const player = await Player.findOne({ id });

    if (!player) {
      return next({ code: 'spacetime/player_id_not_found', id });
    }
    if (!location) {
      return next({ code: 'spacetime/destination_id_not_found', destination });
    }
    if (player.isTraveling) {
      return next({ code: 'spacetime/player_is_traveling', itinary });
    }

    Promise.all([
      Player.findOneAndUpdate(
        { _id: player._id },
        { $set: { 'itinary.destination': location._id } },
        { new: true, upsert: true }
      ),
      Location.findOneAndUpdate(
        { players: player._id },
        { $pull: { players: player._id } }
      ),
      Location.findOneAndUpdate(
        { _id: location._id },
        { $push: { players: player._id } }
      ),
    ]).then(responses => {
      res.send(responses[0]);
    });
  },
};
