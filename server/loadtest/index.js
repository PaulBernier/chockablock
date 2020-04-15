const LoadTestManager = require("./LoadTestManager");

module.exports = function (pubsub, db) {
  const loadTestManager = new LoadTestManager(db);

  loadTestManager.on("LOAD_TEST_CHANGED", (loadTest) =>
    pubsub.publish("LOAD_TEST_CHANGED", { latestLoadTestChanged: loadTest })
  );

  loadTestManager.loadAgentCoordinator.on("AGENTS_CHANGED", (agents) =>
    pubsub.publish("AGENTS_CHANGED", { agentsChanged: agents })
  );

  loadTestManager.init();

  return loadTestManager;
};
