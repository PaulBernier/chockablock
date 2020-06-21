const WebSocket = require("ws");
const EventEmitter = require("events");

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

class LoadAgentCoordinator extends EventEmitter {
  constructor() {
    super();
    const that = this;

    this.wss = new WebSocket.Server({ port: 4007 });

    this.wss.on("connection", function connection(ws, req) {
      const agentName = req.headers.agentname || "";
      console.log(`New agent connected [${agentName}]`);
      ws.isAlive = true;
      ws.agentName = agentName;
      ws.latestUpdateTime = Math.floor(Date.now() / 1000);

      // On events
      ws.on("message", function incoming(data) {
        try {
          const message = JSON.parse(data.toString());

          switch (message.type) {
            case "blockheight":
              if (ws.blockHeight !== message.payload) {
                ws.blockHeight = message.payload;
              }
              break;
            default:
              console.error(`Unknown message type: ${message.type}`);
              return;
          }

          ws.latestUpdateTime = message.timestamp;
          that._agentsChanged();
        } catch (e) {
          console.error("Failed to processing incoming message: ", e);
        }
      });

      ws.on("pong", heartbeat);
      ws.on("close", () => {
        console.log(`Agent disconnected: [${ws.agentName}]`);
        that._agentsChanged();
      });

      that._agentsChanged();
    });

    // Keep alive connection with agents
    this.keepAliveIntervalId = setInterval(() => {
      this.wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
          console.log(`Terminating connection with ${ws.agentName}`);

          ws.terminate();
          return;
        }

        ws.isAlive = false;
        ws.ping(noop);
      });
    }, 30000);
  }

  close() {
    clearInterval(this.keepAliveIntervalId);
    this.wss.close(() => console.log("WebSocket server closed"));
  }

  getConnectedAgents() {
    return [...this.wss.clients]
      .filter((client) => client.readyState === WebSocket.OPEN)
      .map((c) => ({
        name: c.agentName,
        blockHeight: c.blockHeight,
        latestUpdateTime: c.latestUpdateTime,
      }));
  }

  startLoad(jobs, agentNames) {
    const agentCount = this.getConnectedAgents().length;
    if (jobs.length > agentCount) {
      throw new Error(
        `Cannot dispatch ${jobs.length} start load jobs to only ${agentCount}`
      );
    }

    let i = 0;
    this.wss.clients.forEach(function each(client) {
      if (
        agentNames.has(client.agentName) &&
        client.readyState === WebSocket.OPEN &&
        i < jobs.length
      ) {
        client.send(
          JSON.stringify({
            command: "start-load",
            params: jobs[i],
          })
        );
        ++i;
      }
    });

    if (i !== jobs.length) {
      this.stopLoad();
      throw new Error(
        "Aborting load start as all jobs could not be dispatched"
      );
    }
  }

  stopLoad() {
    this._broadcast({ command: "stop-load" });
  }

  _broadcast(data) {
    const serialized = JSON.stringify(data);
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized);
      }
    });
  }

  // Emit event for GraphQL subscriptions (via PubSub)
  async _agentsChanged() {
    this.emit("AGENTS_CHANGED", this.getConnectedAgents());
  }
}

module.exports = LoadAgentCoordinator;
