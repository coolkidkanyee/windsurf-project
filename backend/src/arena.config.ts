import Arena from '@colyseus/arena';
import { GameRoom } from './rooms/GameRoom';

export default Arena({
  options: {
    greet: false,
  },

  getId: () => '21-Online',

  initializeGameServer: (gameServer) => {
    gameServer.define('gameRoom', GameRoom);
  },

  initializeExpress: (app) => {
    // Enable CORS
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
      } else {
        next();
      }
    });

    app.get('/', (req, res) => {
      res.send('21-Online Backend is running!');
    });
  },
});
