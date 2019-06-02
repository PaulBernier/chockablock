const EventEmitter = require("events");
const LoadGenerator = require("./LoadGenerator");
const LoadTest = require("./LoadTest");

class LoadTestManager extends EventEmitter {
  constructor({ factomdConfig }) {
    super();
    this.loadGenerator = new LoadGenerator(factomdConfig);
    this.loadTest = null;
  }

  async start({ user, loadConfig }) {
    const loadTest = new LoadTest();
    loadTest.addEvent({ user, type: "start" });

    const generator = await this.loadGenerator.run(loadConfig);
    loadTest.generator = generator;

    this.loadTest = loadTest;
    this.emitLoadTestChanged();
  }

  stop(user) {
    if (this.loadTest && this.loadTest.isActive()) {
      this.loadGenerator.stop();
      this.loadTest.addEvent({ user, type: "stop" });
      this.emitLoadTestChanged();
    }
  }

  emitLoadTestChanged() {
    this.emit("LOAD_TEST_CHANGED", this.loadTest);
  }
}

module.exports = LoadTestManager;
