const assert = require("chai").assert;
const { getAuthoritySetStats } = require("./authority-set");

describe("Fetch authority set info from fct.tools", function () {
  it("should get authority set info", async function () {
    this.timeout(10000);
    const data = await getAuthoritySetStats();

    assert.isAbove(data.leaders, 1);
    assert.isAbove(data.audits, 1);
    assert.isString(data.mainVersion);
    assert.isNotEmpty(data.auditVersions);
    assert.isNotEmpty(data.leaderVersions);
    assert.isArray(data.identitiesNotFound);
  });
});
