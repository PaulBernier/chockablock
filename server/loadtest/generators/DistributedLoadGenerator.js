class DistributedLoadGenerator {
  constructor(loadAgentCoordinator, chainIds, entrySizeRange, selectedAgents) {
    if (!loadAgentCoordinator) {
      throw new Error("Missing LoadAgentCoordinator");
    }

    this.chainIds = chainIds;
    this.entrySizeRange = entrySizeRange;
    this.loadAgentCoordinator = loadAgentCoordinator;
    this.selectedAgents = new Set(selectedAgents);
  }

  async run(config) {
    // validateConfig is implemented by the inheriting class
    this.validateConfig(config);

    // buildAgentJobs is implemented by the inheriting class
    const jobs = await this.buildAgentJobs(config, this.selectedAgents.size);

    this.loadAgentCoordinator.startLoad(jobs, this.selectedAgents);
  }

  getChainIdChunks(nbChunks) {
    const chunkSize = Math.ceil(this.chainIds.length / nbChunks);
    return chunk(this.chainIds, chunkSize);
  }

  stop() {
    this.loadAgentCoordinator.stopLoad();
  }
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

module.exports = DistributedLoadGenerator;
