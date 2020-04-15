const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");

function latestLoadTest(parent, args, { loadTestManager }) {
  return loadTestManager.loadTest;
}

async function verifyAuth(parent, { token }) {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (e) {
    return false;
  }
}

async function loadTest(parent, { id }, { db }) {
  if (ObjectID.isValid(id)) {
    return db.collection("loadtests").findOne({ _id: new ObjectID(id) });
  }

  return null;
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
    nextBlockStartTime: blockchainMonitor.nextBlockStartTime,
  };
}

async function blockStatHistory(
  parent,
  { startTimestamp, endTimestamp },
  { db }
) {
  const history = await db
    .collection("blocks")
    .find({ timestamp: { $gte: startTimestamp, $lte: endTimestamp } })
    .toArray();

  let nextBlockStartTime = 0;
  if (history.length > 0) {
    const nextHeight = history[history.length - 1].height + 1;
    const nextBlock = await db
      .collection("blocks")
      .findOne({ height: nextHeight });
    if (nextBlock) {
      nextBlockStartTime = nextBlock.timestamp;
    } else {
      nextBlockStartTime = history[history.length - 1].timestamp;
    }
  }

  return { history, nextBlockStartTime };
}

function ecBalance(parent, args, { blockchainMonitor }) {
  return blockchainMonitor.ecBalance;
}

function agents(parent, args, { loadTestManager }) {
  return loadTestManager.loadAgentCoordinator.getConnectedAgents();
}

module.exports = {
  verifyAuth,
  loadTest,
  latestLoadTest,
  loadTestHistory,
  blockStatHistory,
  latestBlockStatHistory,
  ecBalance,
  agents,
};
