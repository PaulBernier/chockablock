const BlockchainMonitor = require("./BlockchainMonitor");

module.exports = function(pubsub) {
  const blockchainMonitor = new BlockchainMonitor();

  blockchainMonitor.on("BLOCK_STAT_HISTORY_CHANGED", blockStatHistory =>
    pubsub.publish("BLOCK_STAT_HISTORY_CHANGED", {
      blockStatHistoryChanged: blockStatHistory
    })
  );

  return blockchainMonitor;
};
