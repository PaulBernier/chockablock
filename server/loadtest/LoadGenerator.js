const { FactomCli, Chain, Entry, getPublicAddress } = require("factom");
const crypto = require("crypto");
const uuidv4 = require("uuid/v4");

const EC_ADDRESS = process.env.EC_ADDRESS;
const PUBLIC_EC_ADDRESS = getPublicAddress(EC_ADDRESS);

class LoadGenerator {
  constructor(opts) {
    this.cli = new FactomCli(opts);
  }

  async run({ eps = 1, nbOfChains = 100, entrySize = 1024 }) {
    if (eps <= 0) {
      throw new Error(`EPS must be positive. Received: ${eps}`);
    }
    if (entrySize <= 0 || entrySize > 10240) {
      throw new Error(`Invalid entry size: ${entrySize}`);
    }
    if (nbOfChains <= 0 || !Number.isInteger(nbOfChains)) {
      throw new Error(
        `nbOfChains must be a positive integer. Received: ${nbOfChains}`
      );
    }

    const chainIds = await createChains(this.cli, nbOfChains, EC_ADDRESS);

    let i = 0;
    const cli = this.cli,
      interval = 1000 / eps;
    this.intervalId = setInterval(function() {
      i = (i + 1) % chainIds.length;
      add(cli, { chainId: chainIds[i], entrySize }, EC_ADDRESS);
    }, interval);

    return {
      config: { eps, nbOfChains, entrySize },
      data: {
        ecAddress: PUBLIC_EC_ADDRESS,
        chainIds
      }
    };
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

function add(cli, { chainId, entrySize }, ecAddress) {
  const entry = Entry.builder()
    .chainId(chainId)
    .content(crypto.randomBytes(entrySize))
    .build();

  commitAndReveal(cli, entry, ecAddress);
}

function commitAndReveal(cli, entry, ecAddress) {
  cli.commitEntry(entry, ecAddress, -1);
  cli.revealEntry(entry, -1);
}

async function createChains(cli, nb, ecAddress) {
  console.log(`Creating ${nb} chains...`);

  const chains = new Array(nb).fill(uuidv4()).map(buildChain);

  const created = await cli.add(chains, ecAddress, { concurrency: 100 });

  return created.map(c => c.chainId);
}

function buildChain(runId) {
  const entry = Entry.builder()
    .extId("factom-load-generator", "utf8")
    .extId(runId, "utf8")
    .extId(Date.now().toString(), "utf8")
    .extId(uuidv4(), "utf8")
    .build();

  return new Chain(entry);
}

module.exports = LoadGenerator;
