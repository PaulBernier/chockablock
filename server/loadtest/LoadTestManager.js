const EventEmitter = require("events");
const ConstantLoadGenerator = require("./ConstantLoadGenerator");
const LoadTest = require("./LoadTest");
const { FactomCli, Entry, Chain } = require("factom");
const uuidv4 = require("uuid/v4");

const EC_ADDRESS = process.env.EC_ADDRESS;

class LoadTestManager extends EventEmitter {
  constructor(db) {
    super();
    this.db = db;
    this.cli = new FactomCli();
    this.loadTest = null;
  }

  async start({ user, loadConfig }) {
    if (this.loadTest && this.loadTest.isActive()) {
      throw new Error("A load test is already running");
    }
    const { type, nbOfChains } = loadConfig;

    if (nbOfChains <= 0 || !Number.isInteger(nbOfChains)) {
      throw new Error(
        `nbOfChains must be a positive integer. Received: ${nbOfChains}`
      );
    }

    const chainIds = await createChains(this.cli, nbOfChains, EC_ADDRESS);

    switch (type) {
      case "constant":
        this.loadGenerator = new ConstantLoadGenerator(this.cli, chainIds);
        break;
      default:
        throw new Error(`Unknown load generator type [${type}]`);
    }

    // getConfig is responsible for validating config requests
    // And returning a fully populated config (with defaults if necessary)
    const generatorConfig = this.loadGenerator.getConfig(
      loadConfig.generatorConfig
    );

    const loadTest = new LoadTest();
    loadTest.startBy(user);
    loadTest.type = loadConfig.type;
    loadTest.chainIds = chainIds;
    loadTest.generatorConfig = generatorConfig;

    this.loadTest = loadTest;

    await this.loadGenerator.run(generatorConfig, chainIds);

    this.loadTestChanged();
  }

  async stop(user) {
    if (this.loadTest && this.loadTest.isActive()) {
      this.loadGenerator.stop();
      this.loadTest.stopBy(user);

      await this.loadTestChanged();
    }
  }

  async loadTestChanged() {
    if (this.loadTest._id) {
      await this.db
        .collection("loadtests")
        .replaceOne({ _id: this.loadTest._id }, this.loadTest, {
          upsert: true
        });
    } else {
      await this.db.collection("loadtests").insertOne(this.loadTest);
    }

    this.emit("LOAD_TEST_CHANGED", this.loadTest);
  }
}

async function createChains(cli, nb, ecAddress) {
  console.log(`Creating ${nb} chains`);

  const chains = new Array(nb).fill(uuidv4()).map(buildChain);

  const created = await cli.add(chains, ecAddress, { concurrency: 10 });

  return created.map(c => c.chainId);
}

function buildChain(runId) {
  const entry = Entry.builder()
    .extId("factom-load-generator", "utf8")
    .extId(runId, "utf8")
    .extId(Date.now().toString(), "utf8")
    .extId(uuidv4(), "utf8")
    .build();

  return new Chain(entry);
}

module.exports = LoadTestManager;
