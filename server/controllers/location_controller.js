const Location = require('../models/Location');

module.exports = {
  getAll(req, res, next) {
    Location.find({})
      .then(locations => res.send(locations))
      .catch(next);
  },

  getOne(req, res, next) {
    const locationId = req.params.id;

    Location.findOne({ id: locationId })
      .then(location => res.send(location))
      .catch(next);
  },

  create(req, res, next) {
    const requiredFields = ['name', 'id', 'kind', 'type'];
    const update = {};

    try {
      requiredFields.forEach(field => {
        if (req.body[field]) {
          update[field] = req.body[field];
        } else {
          throw new Error(
            `Location Create: Missing required field: "${field}"`
          );
        }
      });
    } catch (e) {
      return next(e);
    }

    Location.create(req.body)
      .then(location => res.send(location))
      .catch(next);
  },

  update(req, res, next) {
    const updateable = ['name', 'type', 'id', 'distanceFromCenter', 'kind'];
    const updateObj = {};

    updateable.forEach(field => {
      if (req.body[field]) {
        updateObj[field] = req.body[field];
      }
    });

    Location.update({ id: req.params.id }, updateObj)
      .then(location => {
        res.status(204).json(location);
      })
      .catch(next);
  },

  delete(req, res, next) {
    const locationId = req.params.id;

    Location.remove({ id: locationId })
      .then(location => res.status(204).send(location))
      .catch(next);
  },
};
