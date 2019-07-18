const { ObjectID } = require("mongodb");

function latestLoadTest(parent, args, { loadTestManager }) {
  return loadTestManager.loadTest;
}

async function loadTestHistory(parent, { id, pageSize }, { db }) {
  const query = ObjectID.isValid(id) ? { _id: { $lt: new ObjectID(id) } } : {};
  return db
    .collection("loadtests")
    .find(query)
    .sort("_id", -1)
    .limit(pageSize)
    .toArray();
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
  latestLoadTest,
  loadTestHistory,
  blockStatHistory,
  ecBalance
};
