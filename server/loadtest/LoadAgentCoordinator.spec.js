const assert = require("chai").assert;
const sinon = require("sinon");
const WebSocket = require("ws");
const LoadAgentCoordinator = require("./LoadAgentCoordinator");

describe("LoadAgentCoordinator class", function () {
  let coordinator;

  beforeEach(() => {
    coordinator = new LoadAgentCoordinator();
  });

  afterEach(() => {
    coordinator.close();
  });

  it("should register agent connections", function (done) {
    const agentName = "test-agent";
    const ws = new WebSocket("ws://localhost:4007", {
      headers: { agentname: agentName },
    });

    ws.on("open", async function open() {
      try {
        const agents = coordinator.getConnectedAgents();

        assert.lengthOf(agents, 1);
        const agent = agents[0];
        assert.isObject(agent);
        assert.equal(agent.name, agentName);
        assert.isAbove(agent.latestUpdateTime, 1);

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("should emit new agent event", function (done) {
    const agentName = "test-agent";
    const ws = new WebSocket("ws://localhost:4007", {
      headers: { agentname: agentName },
    });

    const spy = sinon.spy();
    coordinator.on("AGENTS_CHANGED", spy);

    ws.on("open", async function open() {
      try {
        assert.isTrue(spy.called);
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("should process blockheight messages", function (done) {
    const agentName = "test-agent";
    const ws = new WebSocket("ws://localhost:4007", {
      headers: { agentname: agentName },
    });

    ws.on("open", async function open() {
      try {
        const now = parseInt(2000 + Date.now() / 1000);
        await ws.send(
          JSON.stringify({ type: "blockheight", timestamp: now, payload: 1024 })
        );

        // Verify message was received and processed
        await sleep(100);
        const agents = coordinator.getConnectedAgents();
        const agent = agents[0];
        assert.equal(agent.name, agentName);
        assert.equal(agent.latestUpdateTime, now);
        assert.equal(agent.blockHeight, 1024);

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("should send start load instruction to agents", function (done) {
    const agentName = "test-agent";
    const ws = new WebSocket("ws://localhost:4007", {
      headers: { agentname: agentName },
    });

    ws.on("open", async function open() {
      try {
        const jobs = ["do"];
        const agentNames = new Set([agentName]);
        coordinator.startLoad(jobs, agentNames);
      } catch (e) {
        done(e);
      }
    });

    ws.on("message", async function message(raw) {
      try {
        const msg = JSON.parse(raw);
        assert.equal(msg.command, "start-load");
        assert.equal(msg.params, "do");

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it("should send stop load instruction to agents", function (done) {
    const agentName = "test-agent";
    const ws = new WebSocket("ws://localhost:4007", {
      headers: { agentname: agentName },
    });

    ws.on("open", async function open() {
      try {
        coordinator.stopLoad();
      } catch (e) {
        done(e);
      }
    });

    ws.on("message", async function message(raw) {
      try {
        const msg = JSON.parse(raw);
        assert.equal(msg.command, "stop-load");

        done();
      } catch (e) {
        done(e);
      }
    });
  });

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
});
