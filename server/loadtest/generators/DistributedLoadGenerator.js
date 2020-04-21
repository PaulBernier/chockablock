class DistributedLoadGenerator {
  constructor(loadAgentCoordinator, chainIds, entrySizeRange) {
    if (!loadAgentCoordinator) {
      throw new Error("Missing LoadAgentCoordinator");
    }

    this.chainIds = chainIds;
    this.entrySizeRange = entrySizeRange;
    this.loadAgentCoordinator = loadAgentCoordinator;
  }

  async run(config) {
    // validateConfig is implemented by the inheriting class
    this.validateConfig(config);

    const lac = this.loadAgentCoordinator;
    const agents = lac.getConnectedAgents();
    const agentCount = agents.length;

    if (agentCount === 0) {
      throw new Error("No load agent connected");
    } else {
      console.log(`${agentCount} agents connected: ${JSON.stringify(agents)}`);
    }

    // buildAgentJobs is implemented by the inheriting class
    const jobs = await this.buildAgentJobs(config, agentCount);

    lac.startLoad(jobs);
  }

  stop() {
    this.loadAgentCoordinator.stopLoad();
  }
}

module.exports = DistributedLoadGenerator;
