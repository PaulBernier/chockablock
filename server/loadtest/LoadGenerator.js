const {
  FactomCli,
  Chain,
  Entry,
  getPublicAddress,
  composeEntryCommit,
  composeEntryReveal
} = require("factom");
const crypto = require("crypto");
const uuidv4 = require("uuid/v4");

const EC_ADDRESS = process.env.EC_ADDRESS;
const PUBLIC_EC_ADDRESS = getPublicAddress(EC_ADDRESS);
const NO_RETRY_STRATEGY = {
  retry: {
    retries: 0
  }
};

class LoadGenerator {
  constructor() {
    this.cli = new FactomCli();
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

    console.log(`Creating ${nbOfChains} chains`);
    const chainIds = await createChains(this.cli, nbOfChains, EC_ADDRESS);

    let i = 0;
    const interval = 1000 / eps;

    console.log(`Sending entries every ${interval}ms`);

    this.intervalId = setInterval(() => {
      i = (i + 1) % chainIds.length;
      add(this.cli, { chainId: chainIds[i], entrySize }, EC_ADDRESS);
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

async function add(cli, { chainId, entrySize }, ecAddress) {
  const entry = Entry.builder()
    .chainId(chainId)
    .content(crypto.randomBytes(entrySize))
    .build();

  try {
    await commitAndReveal(cli, entry, ecAddress);
  } catch (e) {
    console.error(`Failed to commitAndReveal: ${e.message}`);
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

async function createChains(cli, nb, ecAddress) {
  const chains = new Array(nb).fill(uuidv4()).map(buildChain);

  const created = await cli.add(chains, ecAddress, { concurrency: 10 });

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
