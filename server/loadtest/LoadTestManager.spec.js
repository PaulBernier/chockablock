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
    this.timeout(5000);
    const loadAgentCoordinator = sinon.createStubInstance(
      LoadAgentCoordinator,
      {
        startLoad: sinon.stub().returns(),
        stopLoad: sinon.stub().returns(),
      }
    );
    const manager = new LoadTestManager({ db, loadAgentCoordinator });

    const spy = sinon.spy();
    manager.on("LOAD_TEST_CHANGED", spy);

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

    // Verify factomd add has been called at least once
    mock.verify();

    assert.isNotNull(manager.loadTest);
    assert.isFalse(manager.loadTest.isActive()); // self stopping load type
    assert.instanceOf(manager.loadGenerator, BurstLoadGenerator);

    // Verify event has been emitted
    assert.isTrue(spy.called);

    // Verify insertion into db
    const latestLoadTest = await db
      .collection("loadtests_v2")
      .findOne({}, { sort: { "start.timestamp": -1 } });
    assert.isNotNull(latestLoadTest);
    assert.equal(latestLoadTest._id, manager.loadTest._id);
    assert.isObject(latestLoadTest.end);
  });

  it("Should start constant load", async function () {
    this.timeout(5000);

    const loadAgentCoordinator = sinon.createStubInstance(
      LoadAgentCoordinator,
      {
        startLoad: sinon.stub().returns(),
        stopLoad: sinon.stub().returns(),
      }
    );
    const manager = new LoadTestManager({ db, loadAgentCoordinator });

    const spy = sinon.spy();
    manager.on("LOAD_TEST_CHANGED", spy);

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

    // Verify factomd add has been called at least once
    mock.verify();

    assert.isNotNull(manager.loadTest);
    assert.isTrue(manager.loadTest.isActive());
    assert.instanceOf(manager.loadGenerator, ConstantLoadGenerator);

    // Verify event has been emitted
    assert.isTrue(spy.called);

    // Verify insertion into db
    let latestLoadTest = await db
      .collection("loadtests_v2")
      .findOne({}, { sort: { "start.timestamp": -1 } });
    assert.isNotNull(latestLoadTest);
    assert.equal(latestLoadTest._id, manager.loadTest._id);
    assert.isUndefined(latestLoadTest.end);

    await manager.stop("admin");
    assert.isFalse(manager.loadTest.isActive());

    // Verify update into db
    latestLoadTest = await db
      .collection("loadtests_v2")
      .findOne({}, { sort: { "start.timestamp": -1 } });
    assert.isObject(latestLoadTest.end);
  });
});
