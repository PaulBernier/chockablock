const { ObjectID } = require("mongodb");
const jwt = require("jsonwebtoken");
const { getAuthoritySetStats } = require("../loadtest/authority-set");

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

async function authoritySetInfo(parent, { token }) {
  return await getAuthoritySetStats();
}

async function loadTest(parent, { id }, { db }) {
  const _id = ObjectID.isValid(id) ? new ObjectID(id) : id;
  return db.collection("loadtests_v2").findOne({ _id });
}

async function loadTestHistory(parent, { timestamp, pageSize }, { db }) {
  const query = timestamp ? { "start.timestamp": { $lt: timestamp } } : {};
  return db
    .collection("loadtests_v2")
    .find(query)
    .sort("start.timestamp", -1)
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

function agents(parent, args, { loadAgentCoordinator }) {
  return loadAgentCoordinator.getConnectedAgents();
}

module.exports = {
  authoritySetInfo,
  verifyAuth,
  loadTest,
  latestLoadTest,
  loadTestHistory,
  blockStatHistory,
  latestBlockStatHistory,
  ecBalance,
  agents,
};
