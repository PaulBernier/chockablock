const EventEmitter = require("events");
const ConstantLoadGenerator = require("./generators/ConstantLoadGenerator");
const BurstLoadGenerator = require("./generators/BurstLoadGenerator");
const LoadTest = require("./LoadTest");
const { getAuthoritySetStats } = require("./authority-set");
const { FactomCli, Entry, Chain } = require("factom");
const { v4: uuidv4 } = require("uuid");

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
      .collection("loadtests_v2")
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
    console.log(`New load test request received from [${user}]:`);
    console.log(loadConfig);

    // User input validation
    if (this.loadTest && this.loadTest.isActive()) {
      throw new Error("A load test is already running");
    }

    // Doesn't validate type specific configuration (i.e not loadConfig.typedConfig)
    this.validateGenericLoadConfig(loadConfig);

    // Chains creation
    const runId = uuidv4();
    const chainIds = await createChains(this.cli, runId, loadConfig.nbOfChains);

    let typedConfig;
    switch (loadConfig.type) {
      case "constant":
        this.loadGenerator = new ConstantLoadGenerator(
          this.loadAgentCoordinator,
          chainIds,
          loadConfig.entrySizeRange
        );
        typedConfig = loadConfig.typedConfig.constant;
        break;
      case "burst":
        this.loadGenerator = new BurstLoadGenerator(
          this.loadAgentCoordinator,
          chainIds,
          loadConfig.entrySizeRange
        );
        typedConfig = loadConfig.typedConfig.burst;
        break;
      default:
        throw new Error(`Unknown load generator type [${loadConfig.type}]`);
    }

    const loadTest = new LoadTest();
    loadTest._id = runId;
    loadTest.startBy(user);
    loadTest.type = loadConfig.type;
    loadTest.chainIds = chainIds;
    loadTest.entrySizeRange = loadConfig.entrySizeRange;
    loadTest.generatorConfig = typedConfig;
    loadTest.agentsCount = this.loadAgentCoordinator.getConnectedAgents().length;
    // Save authority set stats at the start of the loadtest
    loadTest.authoritySet = await getAuthoritySetStats();

    await this.loadGenerator.run(typedConfig);
    console.log("Load generator now running");

    this.loadTest = loadTest;

    if (this.loadTest.isSelfStopping()) {
      this.loadTest.stopBy("AUTO");
    }

    await this.loadTestChanged();
  }

  validateGenericLoadConfig(loadConfig) {
    const { nbOfChains, entrySizeRange } = loadConfig;

    if (!Number.isInteger(nbOfChains) || nbOfChains <= 0) {
      throw new Error(
        `nbOfChains must be a positive integer. Received: ${nbOfChains}`
      );
    }

    if (!entrySizeRange) {
      throw new Error("Missing entry size range config");
    }

    if (
      entrySizeRange.min < 32 ||
      entrySizeRange.max > 10240 ||
      entrySizeRange.min > entrySizeRange.max
    ) {
      throw new Error(
        `Entry size range must be within [32, 10240] (received [${entrySizeRange.min}, ${entrySizeRange.max}])`
      );
    }
  }

  async stop(user) {
    if (this.loadTest && this.loadTest.isActive()) {
      this.loadGenerator.stop();
      this.loadTest.stopBy(user);

      await this.loadTestChanged();
    }
  }

  async loadTestChanged() {
    await this.db
      .collection("loadtests_v2")
      .update({ _id: this.loadTest._id }, this.loadTest, { upsert: true });

    // Emit event for GraphQL subscriptions (via PubSub)
    this.emit("LOAD_TEST_CHANGED", this.loadTest);
  }
}

async function createChains(cli, runId, nb) {
  console.log(`Creating ${nb} chains...`);

  const chains = new Array(nb).fill(runId).map(buildChain);

  const created = await cli.add(chains, EC_ADDRESS, { concurrency: 20 });

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
