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

function latestBlockStatHistory(parent, args, { blockchainMonitor }) {
  return {
    history: blockchainMonitor.history,
    nextBlockStartTime: blockchainMonitor.nextBlockStartTime
  };
}

function ecBalance(parent, args, { blockchainMonitor }) {
  return blockchainMonitor.ecBalance;
}

module.exports = {
  latestLoadTest,
  loadTestHistory,
  latestBlockStatHistory,
  ecBalance
};
