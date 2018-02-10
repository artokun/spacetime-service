const Location = require('../models/Location');

module.exports = {
  getAll(req, res, next) {
    Location.find({})
      .then(locations => res.send(locations))
      .catch(next);
  },

  getOne(req, res, next) {
    const locationId = req.params.id;

    Location.findById({ _id: locationId })
      .then(location => res.send(location))
      .catch(next);
  },

  create(req, res, next) {
    const { name, type } = req.body;

    if ((name, type)) {
      Location.create({
        name,
        type,
      })
        .then(location => res.send(location))
        .catch(next);
    } else {
      res.status(400).send('Location needs name and type');
    }
  },

  update(req, res, next) {
    const updateable = ['name', 'type'];
    const update = {};

    updateable.forEach(field => {
      if (req.body[field]) {
        update[field] = req.body[field];
      }
    });

    Location.updateOne({ _id: req.params.id }, update)
      .then(location => {
        res.status(204).json(location);
      })
      .catch(next);
  },

  delete(req, res, next) {
    const locationId = req.params.id;

    Location.findByIdAndRemove({ _id: locationId })
      .then(location => res.status(204).send(location))
      .catch(next);
  },
};
