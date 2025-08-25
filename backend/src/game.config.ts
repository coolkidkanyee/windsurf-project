export default {
  maxClients: 7,
  roomIdLength: 4,

  //All times are in ms
  inactivityTimeout: 30000,
  roomDeleteTimeout: 60000,
  delayedRoundStartTime: 2000,
  roundStateDealingTime: 1000,
  dealerCardDelay: 1000,
  roundOutcomeDelay: 1000,
  roundStateEndTimeBase: 2500,
  roundStateEndTimePlayer: 500,

  minBet: 1,
  maxBet: 1000, // Default max bet, will be overridden by dynamic calculation
  minBetWhenNegative: 1000, // Max bet when player has negative money
  initialPlayerMoney: 10000,
  initialPlayerBet: 50,

  // Websocket Code when player is disconnected by server
  kickCode: 4000,
  roomFullCode: 4444,
  pingInterval: 5000,
};
