const DistributedLoadGenerator = require("./DistributedLoadGenerator");

class BurstLoadGenerator extends DistributedLoadGenerator {
  validateConfig({ nbEntries }) {
    if (!Number.isInteger(nbEntries) || nbEntries <= 0) {
      throw new Error(
        `Burst number of entries must be a positive integer (received: ${nbEntries})`
      );
    }
  }

  buildAgentJobs({ nbEntries }, agentCount) {
    const chainIdChunks = this.getChainIdChunks(agentCount);

    const nbEntriesPerAgent = Math.floor(nbEntries / agentCount);

    const jobs = [];
    for (let i = 0; i < agentCount; ++i) {
      let nbEntriesAgent = nbEntriesPerAgent;
      // Adjust number of entries for exact count
      if (i === agentCount - 1) {
        nbEntriesAgent += nbEntries % nbEntriesPerAgent;
      }

      jobs.push({
        type: "burst",
        esAddress: process.env.EC_ADDRESS,
        chainIds: chainIdChunks[i],
        entrySizeRange: this.entrySizeRange,
        params: {
          nbEntries: nbEntriesAgent,
        },
      });
    }

    return jobs;
  }
}

module.exports = BurstLoadGenerator;
