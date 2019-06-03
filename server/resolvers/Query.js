async function loadTest(parent, args, { loadTestManager }) {
  return loadTestManager.loadTest;
}

async function blockStatHistory(parent, args, { blockchainMonitor }) {
  return blockchainMonitor.history;
}

module.exports = {
  loadTest,
  blockStatHistory
};
