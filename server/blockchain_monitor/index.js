const BlockchainMonitor = require("./BlockchainMonitor");

module.exports = function(pubsub, db) {
  const blockchainMonitor = new BlockchainMonitor(db);

  blockchainMonitor.on("BLOCK_STAT_HISTORY_CHANGED", blockStatHistory =>
    pubsub.publish("BLOCK_STAT_HISTORY_CHANGED", {
      latestBlockStatHistoryChanged: blockStatHistory
    })
  );

  blockchainMonitor.on("EC_BALANCE_CHANGED", balance =>
    pubsub.publish("EC_BALANCE_CHANGED", {
      ecBalanceChanged: balance
    })
  );

  blockchainMonitor.init();

  return blockchainMonitor;
};
