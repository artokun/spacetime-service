const Location = require('../controllers/locations_controller');

module.exports = app => {
  app.post('/api/location', Location.create);
  app.get('/api/location', Location.getAll);
  app.get('/api/location/:id', Location.getOne);
  app.put('/api/location/:id', Location.update);
  app.delete('/api/location/:id', Location.delete);
};
