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
      res.status(400).send('Player needs name and type');
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

    Player.remove({ id: playerId })
      .then(player => res.status(204).send(player))
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
};
