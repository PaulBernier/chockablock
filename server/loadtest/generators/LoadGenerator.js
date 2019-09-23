const { Entry, composeEntryCommit, composeEntryReveal } = require("factom");
const crypto = require("crypto");

const EC_ADDRESS = process.env.EC_ADDRESS;
const NO_RETRY_STRATEGY = {
  retry: {
    retries: 0
  }
};

class LoadGenerator {
  constructor(cli, chainIds) {
    this.cli = cli;
    this.chainIds = chainIds;
    this.i = 0;
  }

  async add({ entrySize }) {
    // Rotate chain ids at every send
    this.i = (this.i + 1) % this.chainIds.length;
    const chainId = this.chainIds[this.i];

    const entry = Entry.builder()
      .chainId(chainId)
      .content(crypto.randomBytes(entrySize))
      .build();

    try {
      await commitAndReveal(this.cli, entry, EC_ADDRESS);
    } catch (e) {
      console.error(`Failed to commitAndReveal: ${e.message}`);
    }
  }
}

async function commitAndReveal(cli, entry, ecAddress) {
  await cli.factomdApi(
    "commit-entry",
    {
      message: composeEntryCommit(entry, ecAddress).toString("hex")
    },
    NO_RETRY_STRATEGY
  );
  await cli.factomdApi(
    "reveal-entry",
    {
      entry: composeEntryReveal(entry).toString("hex")
    },
    NO_RETRY_STRATEGY
  );
}

module.exports = LoadGenerator;
