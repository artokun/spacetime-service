const Player = require('../models/Player');

module.exports = {
  async create(req, res, next) {
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
};
