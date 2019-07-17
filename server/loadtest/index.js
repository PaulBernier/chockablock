const LoadTestManager = require("./LoadTestManager");

module.exports = function(pubsub, db) {
  const loadTestManager = new LoadTestManager(db);

  loadTestManager.on("LOAD_TEST_CHANGED", loadTest =>
    pubsub.publish("LOAD_TEST_CHANGED", { loadTestChanged: loadTest })
  );

  return loadTestManager;
};
