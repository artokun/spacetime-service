const Location = require('../controllers/location_controller');
const Player = require('../controllers/player_controller');

module.exports = app => {
  // LOCATION
  app.get('/location', Location.getAll);
  app.get('/location/:id', Location.getOne);
  app.post('/location', Location.updateOrCreate);
  app.put('/location/:id', Location.update);
  app.delete('/location/:id', Location.delete);

  // PLAYER
  app.get('/player', Player.getAll);
  app.get('/player/:id', Player.getOne);
  app.post('/player', Player.updateOrCreate);
  app.put('/player/:id', Player.update);
  app.delete('/player/:id', Player.delete);
  app.get('/player/:id/celestials', Player.celestials);
  app.get('/player/:id/currentLocation', Player.currentLocation);
  app.post('/player/travelTo', Player.travelTo);
};
