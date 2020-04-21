const DistributedLoadGenerator = require("./DistributedLoadGenerator");

class ConstantLoadGenerator extends DistributedLoadGenerator {
  validateConfig({ eps }) {
    if (typeof eps !== "number" || eps <= 0) {
      throw new Error(`EPS must be positive. Received: ${eps}`);
    }
  }

  buildAgentJobs({ eps }, agentCount) {
    const chainIdChunks = this.getChainIdChunks(agentCount);

    const agentEps = eps / agentCount;

    const jobs = [];
    for (let i = 0; i < agentCount; ++i) {
      jobs.push({
        type: "constant",
        esAddress: process.env.EC_ADDRESS,
        chainIds: chainIdChunks[i],
        entrySizeRange: this.entrySizeRange,
        params: {
          eps: agentEps,
        },
      });
    }

    return jobs;
  }
}

module.exports = ConstantLoadGenerator;
