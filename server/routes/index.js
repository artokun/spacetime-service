const Location = require('../controllers/location_controller');
const Player = require('../controllers/player_controller');

module.exports = app => {
  // LOCATION
  app.get('/api/location', Location.getAll);
  app.get('/api/location/:id', Location.getOne);
  app.post('/api/location', Location.create);
  app.put('/api/location/:id', Location.update);
  app.delete('/api/location/:id', Location.delete);

  // PLAYER
  app.get('/api/player', Player.getAll);
  app.get('/api/player/:id', Player.getOne);
  app.post('/api/player', Player.create);
  app.put('/api/player/:id', Player.update);
  app.delete('/api/player/:id', Player.delete);
  app.get('/api/player/:id/celestials', Player.celestials);
  app.get('/api/player/:id/currentLocation', Player.currentLocation);
};
