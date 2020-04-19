const DistributedLoadGenerator = require("./DistributedLoadGenerator");

class ConstantLoadGenerator extends DistributedLoadGenerator {
  validateConfig({ eps }) {
    if (typeof eps !== "number" || eps <= 0) {
      throw new Error(`EPS must be positive. Received: ${eps}`);
    }
  }

  buildAgentJobs({ eps }, agentCount) {
    const jobs = [];
    const chunkSize = Math.ceil(this.chainIds.length / agentCount);
    const chainIdChunks = chunk(this.chainIds, chunkSize);
    const entrySizeRange = { min: 32, max: 10240 };

    const agentEps = eps / agentCount;

    for (let i = 0; i < agentCount; ++i) {
      jobs.push({
        type: "constant",
        esAddress: process.env.EC_ADDRESS,
        chainIds: chainIdChunks[i],
        entrySizeRange,
        params: {
          eps: agentEps,
        },
      });
    }

    return jobs;
  }
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

module.exports = ConstantLoadGenerator;
