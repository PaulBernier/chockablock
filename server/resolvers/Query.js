function loadTest(parent, args, { db }) {
  return db
    .collection("loadtests")
    .findOne({}, { limit: 1, sort: { _id: -1 } });
}

function blockStatHistory(parent, args, { blockchainMonitor }) {
  return {
    history: blockchainMonitor.history,
    currentBlockStartTime: blockchainMonitor.currentBlockStartTime
  };
}

function ecBalance(parent, args, { blockchainMonitor }) {
  return blockchainMonitor.ecBalance;
}

module.exports = {
  loadTest,
  blockStatHistory,
  ecBalance
};
