class DistributedLoadGenerator {
  constructor(loadAgentCoordinator, chainIds) {
    if (!loadAgentCoordinator) {
      throw new Error("Missing LoadAgentCoordinator");
    }

    this.chainIds = chainIds;
    this.loadAgentCoordinator = loadAgentCoordinator;
  }

  async run(config) {
    const lac = this.loadAgentCoordinator;
    const agents = lac.getConnectedAgents();
    const agentCount = agents.length;

    if (agentCount === 0) {
      throw new Error("No load agent connected");
    } else {
      console.log(`${agentCount} agents connected: ${agents}`);
    }

    // buildAgentJobs is implemented by the inheriting class
    const jobs = await this.buildAgentJobs(config, agentCount);

    console.log("Load jobs:");
    console.log(jobs);

    lac.startLoad(jobs);
  }

  stop() {
    this.loadAgentCoordinator.stopLoad();
  }
}

module.exports = DistributedLoadGenerator;
