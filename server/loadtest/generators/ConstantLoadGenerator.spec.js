const assert = require("chai").assert;
const ConstantLoadGenerator = require("./ConstantLoadGenerator");

describe("ConstantLoadGenerator class", function () {
  it("should build agent jobs", async function () {
    const chainIds = ["chain1", "chain2", "chain3"];
    const entrySizeRange = { min: 32, max: 1024 };
    const agents = ["agent1", "agent2"];

    const loadGen = new ConstantLoadGenerator(
      {},
      chainIds,
      entrySizeRange,
      agents
    );

    const jobs = loadGen.buildAgentJobs({ eps: 230 }, 2);

    assert.lengthOf(jobs, 2);
    jobs.forEach((j) => assert.equal(j.type, "constant"));
    jobs.forEach((j) => assert.deepEqual(j.entrySizeRange, entrySizeRange));
    assert.equal(
      jobs.reduce((acc, j) => acc + j.chainIds.length, 0),
      3
    );
    assert.equal(
      jobs.reduce((acc, j) => acc + j.params.eps, 0),
      230
    );
  });
});
