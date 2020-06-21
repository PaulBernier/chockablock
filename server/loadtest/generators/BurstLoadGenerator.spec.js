const assert = require("chai").assert;
const BurstLoadGenerator = require("./BurstLoadGenerator");

describe("BurstLoadGenerator class", function () {
  it("should build agent jobs", async function () {
    const chainIds = ["chain1", "chain2", "chain3"];
    const entrySizeRange = { min: 32, max: 1024 };
    const agents = ["agent1", "agent2"];

    const loadGen = new BurstLoadGenerator(
      {},
      chainIds,
      entrySizeRange,
      agents
    );

    const jobs = loadGen.buildAgentJobs({ nbEntries: 3000 }, 2);

    assert.lengthOf(jobs, 2);
    jobs.forEach((j) => assert.equal(j.type, "burst"));
    jobs.forEach((j) => assert.deepEqual(j.entrySizeRange, entrySizeRange));
    assert.equal(
      jobs.reduce((acc, j) => acc + j.chainIds.length, 0),
      3
    );
    assert.equal(
      jobs.reduce((acc, j) => acc + j.params.nbEntries, 0),
      3000
    );
  });
});
