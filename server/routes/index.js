const Location = require('../controllers/location_controller');
const Player = require('../controllers/player_controller');

module.exports = app => {
  // LOCATION
  app.post('/api/location', Location.create);
  app.get('/api/location', Location.getAll);
  app.get('/api/location/:id', Location.getOne);
  app.put('/api/location/:id', Location.update);
  app.delete('/api/location/:id', Location.delete);

  // PLAYER
  app.post('/api/player', Player.create);
};
