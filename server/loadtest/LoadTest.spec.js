const assert = require("chai").assert;
const LoadTest = require("./LoadTest");

describe("LoadTest class", function () {
  it("should start and stop LoadTest", async function () {
    const loadTest = new LoadTest();
    loadTest.startBy("me");
    assert.isTrue(loadTest.isActive());

    loadTest.stopBy("you");

    assert.equal(loadTest.start.user, "me");
    assert.isAbove(loadTest.start.timestamp, 1);
    assert.equal(loadTest.end.user, "you");
    assert.isAbove(loadTest.end.timestamp, 1);
    assert.isFalse(loadTest.isActive());
  });
});
