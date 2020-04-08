const DistributedLoadGenerator = require("./DistributedLoadGenerator");

class DistributedConstantLoadGenerator extends DistributedLoadGenerator {
  getConfig({ eps = 1, entrySize = 1024 }) {
    if (eps <= 0) {
      throw new Error(`EPS must be positive. Received: ${eps}`);
    }
    if (entrySize <= 0 || entrySize > 10240) {
      throw new Error(`Invalid entry size: ${entrySize}`);
    }

    return { eps, entrySize };
  }

  async run({ eps, entrySize }) {
    const lac = this.loadAgentCoordinator;
    const agents = lac.getConnectedAgents();
    const agentCount = agents.length;

    if (agentCount === 0) {
      throw new Error("No load agent connected");
    } else {
      console.log(`${agentCount} agents connected: ${agents}`);
    }

    const jobs = [];
    const chainIdChunks = chunk(
      this.chainIds,
      Math.ceil(this.chainIds.length / agentCount)
    );

    const agentEps = eps / agentCount;

    for (let i = 0; i < agentCount; ++i) {
      jobs.push({
        type: "constant",
        eps: agentEps,
        entrySize,
        chainIds: chainIdChunks[i],
      });
    }

    console.log("Load jobs:");
    console.log(jobs);

    lac.startLoad(jobs);
  }

  stop() {
    this.loadAgentCoordinator.stopLoad();
  }
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

module.exports = DistributedConstantLoadGenerator;
