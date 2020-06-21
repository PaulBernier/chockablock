process.env.EC_ADDRESS = "Es3ytEKt6R5jM9juC4ks7EgxQSX8BpRnM4WADtgFoq7j1WgbEEGW";

const assert = require("chai").assert;
const sinon = require("sinon");
const { MongoClient } = require("mongodb");
const { MongoMemoryServer } = require("mongodb-memory-server");
const LoadTestManager = require("./LoadTestManager");
const ConstantLoadGenerator = require("./generators/ConstantLoadGenerator");
const BurstLoadGenerator = require("./generators/BurstLoadGenerator");
const LoadAgentCoordinator = require("./LoadAgentCoordinator");
const EventEmitter = require("events");

describe("LoadTestManager class", function () {
  let db, mongoServer, con;

  before(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    con = await MongoClient.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    db = con.db(await mongoServer.getDbName());
  });

  after(async () => {
    if (con) con.close();
    if (mongoServer) await mongoServer.stop();
  });

  it("Should start burst load", async function () {
    const loadAgentCoordinator = sinon.createStubInstance(
      LoadAgentCoordinator,
      {
        startLoad: sinon.stub().returns(),
        stopLoad: sinon.stub().returns(),
      }
    );
    const manager = new LoadTestManager({ db, loadAgentCoordinator });

    const mock = sinon.mock(manager.cli);
    mock
      .expects("add")
      .atLeast(1)
      .returns(Array(10).map((x) => ({ chainId: "x" })));
    await manager.init();

    const loadConfig = {
      type: "burst",
      nbOfChains: 10,
      entrySizeRange: { min: 128, max: 1024 },
      typedConfig: {
        burst: {
          nbEntries: 1000,
        },
      },
      selectedAgents: ["agent"],
    };

    await manager.start({ user: "admin", loadConfig });

    mock.verify();
    assert.isNotNull(manager.loadTest);
    assert.isFalse(manager.loadTest.isActive()); // self stopping load type
    assert.instanceOf(manager.loadGenerator, BurstLoadGenerator);
  });

  it("Should start constant load", async function () {
    const loadAgentCoordinator = sinon.createStubInstance(
      LoadAgentCoordinator,
      {
        startLoad: sinon.stub().returns(),
        stopLoad: sinon.stub().returns(),
      }
    );
    const manager = new LoadTestManager({ db, loadAgentCoordinator });

    const mock = sinon.mock(manager.cli);
    mock
      .expects("add")
      .atLeast(1)
      .returns(Array(10).map((x) => ({ chainId: "x" })));
    await manager.init();

    const loadConfig = {
      type: "constant",
      nbOfChains: 10,
      entrySizeRange: { min: 128, max: 1024 },
      typedConfig: {
        constant: {
          eps: 120,
        },
      },
      selectedAgents: ["agent"],
    };

    await manager.start({ user: "admin", loadConfig });

    mock.verify();
    assert.isNotNull(manager.loadTest);
    assert.isTrue(manager.loadTest.isActive());
    assert.instanceOf(manager.loadGenerator, ConstantLoadGenerator);

    await manager.stop("admin");
    assert.isFalse(manager.loadTest.isActive());
  });
});
