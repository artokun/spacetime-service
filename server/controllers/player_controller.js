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
    const updateable = ['id'];
    const update = {};

    updateable.forEach(field => {
      if (req.body[field]) {
        update[field] = req.body[field];
      }
    });

    Player.findOneAndUpdate(
      { id: req.params.id },
      { $set: update },
      { new: true }
    )
      .then(player => {
        res.status(200).json(player);
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
        res.status(200).send({ deleted: playerId });
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
      return res
        .status(400)
        .send({ code: 'spacetime/player_id_not_found', id });
    }
    if (!location) {
      return res
        .status(400)
        .send({ code: 'spacetime/destination_id_not_found', destination });
    }
    if (player.isTraveling) {
      return res.status(400).send({
        code: 'spacetime/player_is_traveling',
        itinary: player.itinary,
      });
    }
    if (location._id.toString() === player.itinary.origin.toString()) {
      return res.status(400).send({
        code: 'spacetime/player_already_at_location',
        itinary: player.itinary,
      });
    }

    return Promise.all([
      Player.findOneAndUpdate(
        { _id: player._id },
        {
          $set: {
            'itinary.origin': player.itinary.destination,
            'itinary.destination': location._id,
            'itinary.departureTime': Date.now(),
            'itinary.arrivalTime': Date.now() + 10000,
          },
        },
        { new: true, upsert: true }
      )
        .populate('itinary.origin')
        .populate('itinary.destination'),
      Location.findOneAndUpdate(
        { players: player._id },
        { $pull: { players: player._id } }
      ),
      Location.findOneAndUpdate(
        { _id: location._id },
        { $push: { players: player._id } }
      ),
    ])
      .then(responses => {
        res.send(responses[0]);
      })
      .catch(err => next(err));
  },
};
