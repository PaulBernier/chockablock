const { ObjectID } = require("mongodb");

function loadTest(parent, args, { db }) {
  return db
    .collection("loadtests")
    .findOne({}, { limit: 1, sort: { _id: -1 } });
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
  loadTest,
  loadTestHistory,
  blockStatHistory,
  ecBalance
};
