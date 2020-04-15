const LoadTestManager = require("./LoadTestManager");
const LoadAgentCoordinator = require("./LoadAgentCoordinator");

module.exports = function (pubsub, db) {
  // Instanciate LoadAgentCoordinator
  const loadAgentCoordinator = new LoadAgentCoordinator();

  loadAgentCoordinator.on("AGENTS_CHANGED", (agents) =>
    pubsub.publish("AGENTS_CHANGED", { agentsChanged: agents })
  );

  // Instanciate LoadTestManager
  const loadTestManager = new LoadTestManager({ db, loadAgentCoordinator });

  loadTestManager.on("LOAD_TEST_CHANGED", (loadTest) =>
    pubsub.publish("LOAD_TEST_CHANGED", { latestLoadTestChanged: loadTest })
  );

  loadTestManager.init();

  return { loadTestManager, loadAgentCoordinator };
};
