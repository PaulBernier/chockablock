const WebSocket = require("ws");

function noop() {}

function heartbeat() {
  this.isAlive = true;
}

class LoadAgentCoordinator {
  constructor() {
    this.wss = new WebSocket.Server({ port: 4007 });

    this.wss.on("connection", function connection(ws, req) {
      const agentId = req.headers.agentid || "";
      console.log(`New agent connected: ${agentId}`);
      ws.isAlive = true;
      ws.agentId = agentId;
      ws.on("pong", heartbeat);
    });

    // Keep alive connection with agents
    setInterval(() => {
      this.wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) {
          console.log(`Terminating connection with ${ws.agentId}`);
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(noop);
      });
    }, 30000);
  }

  getConnectedAgents() {
    return [...this.wss.clients]
      .filter(client => client.readyState === WebSocket.OPEN)
      .map(c => c.agentId);
  }

  startLoad(jobs) {
    const agentCount = this.getConnectedAgents().length;
    if (jobs.length > agentCount) {
      throw new Error(
        `Cannot dispatch ${jobs.length} start load jobs to only ${agentCount}`
      );
    }

    let i = 0;
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN && i < jobs.length) {
        client.send(
          JSON.stringify({
            command: "start-load",
            params: jobs[i]
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
}

module.exports = LoadAgentCoordinator;
