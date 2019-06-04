function loadTest(parent, args, { loadTestManager }) {
  return loadTestManager.loadTest;
}

function blockStatHistory(parent, args, { blockchainMonitor }) {
  return blockchainMonitor.history;
}

function ecBalance(parent, args, { blockchainMonitor }) {
  return blockchainMonitor.ecBalance;
}

module.exports = {
  loadTest,
  blockStatHistory,
  ecBalance
};
