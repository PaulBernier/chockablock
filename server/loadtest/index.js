const LoadTestManager = require("./LoadTestManager");

module.exports = function(pubsub) {
  const loadTestManager = new LoadTestManager({});

  loadTestManager.on("LOAD_TEST_CHANGED", loadTest =>
    pubsub.publish("LOAD_TEST_CHANGED", { loadTestChanged: loadTest })
  );

  return loadTestManager;
};
