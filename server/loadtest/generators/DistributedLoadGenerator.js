class DistributedLoadGenerator {
  constructor(loadAgentCoordinator, chainIds) {
    if (!loadAgentCoordinator) {
      throw new Error("Missing LoadAgentCoordinator");
    }

    this.chainIds = chainIds;
    this.loadAgentCoordinator = loadAgentCoordinator;
  }
}

module.exports = DistributedLoadGenerator;
