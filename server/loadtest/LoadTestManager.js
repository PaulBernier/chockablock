const EventEmitter = require("events");
const ConstantLoadGenerator = require("./generators/ConstantLoadGenerator");
const LoadTest = require("./LoadTest");
const { getAuthoritySetStats } = require("./authority-set");
const { FactomCli, Entry, Chain } = require("factom");
const uuidv4 = require("uuid/v4");

const EC_ADDRESS = process.env.EC_ADDRESS;

class LoadTestManager extends EventEmitter {
  constructor({ db, loadAgentCoordinator }) {
    super();
    this.db = db;
    this.cli = new FactomCli();
    this.loadAgentCoordinator = loadAgentCoordinator;
    this.loadTest = null;
  }

  async init() {
    const latestLoadTest = await this.db
      .collection("loadtests")
      .findOne({}, { sort: { _id: -1 } });

    if (latestLoadTest) {
      this.loadTest = new LoadTest(latestLoadTest);
      if (this.loadTest.isActive()) {
        this.loadTest.stopBy("AUTO");
        await this.loadTestChanged();
      }
    }
  }

  async start({ user, loadConfig }) {
    // User input validation
    if (this.loadTest && this.loadTest.isActive()) {
      throw new Error("A load test is already running");
    }
    const { type, nbOfChains, generatorConfig } = loadConfig;

    if (nbOfChains <= 0 || !Number.isInteger(nbOfChains)) {
      throw new Error(
        `nbOfChains must be a positive integer. Received: ${nbOfChains}`
      );
    }

    // Chains creation
    const chainIds = await createChains(this.cli, nbOfChains, EC_ADDRESS);

    switch (type) {
      case "constant":
        this.loadGenerator = new ConstantLoadGenerator(
          this.loadAgentCoordinator,
          chainIds
        );
        break;
      default:
        throw new Error(`Unknown load generator type [${type}]`);
    }

    this.loadGenerator.validateConfig(generatorConfig);
    console.log("Generator config", generatorConfig);

    const loadTest = new LoadTest();
    loadTest.startBy(user);
    loadTest.type = loadConfig.type;
    loadTest.chainIds = chainIds;
    loadTest.generatorConfig = generatorConfig;
    loadTest.agentsCount = this.loadAgentCoordinator.getConnectedAgents().length;
    // Save authority set stats at the start of the loadtest
    loadTest.authoritySet = await getAuthoritySetStats();

    console.log("Running load generator");
    await this.loadGenerator.run(generatorConfig);

    this.loadTest = loadTest;
    await this.loadTestChanged();
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
        .replaceOne({ _id: this.loadTest._id }, this.loadTest);
    } else {
      await this.db.collection("loadtests").insertOne(this.loadTest);
    }

    // Emit event for GraphQL subscriptions (via PubSub)
    this.emit("LOAD_TEST_CHANGED", this.loadTest);
  }
}

async function createChains(cli, nb, ecAddress) {
  console.log(`Creating ${nb} chains...`);

  const chains = new Array(nb).fill(uuidv4()).map(buildChain);

  const created = await cli.add(chains, ecAddress, { concurrency: 20 });

  console.log("Chains created");

  return created.map((c) => c.chainId);
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
