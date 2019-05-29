const EventEmitter = require("events");
const { FactomCli, Chain, Entry, getPublicAddress } = require("factom");
const crypto = require("crypto");
const uuidv4 = require("uuid/v4");

const EC_ADDRESS = process.env.EC_ADDRESS;
const PUBLIC_EC_ADDRESS = getPublicAddress(EC_ADDRESS);

class LoadGenerator extends EventEmitter {
  constructor(opts) {
    super();

    this.cli = new FactomCli(opts);
    this.running = false;
    this.config = {
      ecAddress: PUBLIC_EC_ADDRESS,
      running: false,
      targetWps: 0,
      chainIds: []
    };
  }

  async run({ wps = 1, nbOfChains = 100 }) {
    if (wps <= 0) {
      throw new Error(`WPS must be positive. Received: ${wps}`);
    }
    if (nbOfChains <= 0 || !Number.isInteger(nbOfChains)) {
      throw new Error(
        `nbOfChains must be a positive integer. Received: ${nbOfChains}`
      );
    }

    const chainIds = await createChains(this.cli, nbOfChains, EC_ADDRESS);

    let i = 0;
    const cli = this.cli,
      interval = 1000 / wps;
    this.intervalId = setInterval(function() {
      i = (i + 1) % chainIds.length;
      add(cli, chainIds[i], EC_ADDRESS);
    }, interval);

    this.config.running = true;
    this.config.targetWps = wps;
    this.config.chainIds = chainIds;
    this.emit("LOAD_CONFIG_CHANGE", this.config);
  }

  stop() {
    this.config.running = false;
    this.config.targetWps = 0;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.emit("LOAD_CONFIG_CHANGE", this.config);
  }
}

function add(cli, chainId, ecAddress) {
  const entry = Entry.builder()
    .chainId(chainId)
    .extId(uuidv4(), "utf8")
    .content(crypto.randomBytes(950))
    .build();

  commitAndReveal(cli, entry, ecAddress);
}

function commitAndReveal(cli, entry, ecAddress) {
  cli.commitEntry(entry, ecAddress, -1);
  cli.revealEntry(entry, -1);
}

async function createChains(cli, nb, ecAddress) {
  console.log(`Creating ${nb} chains.`);

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

module.exports = {
  LoadGenerator
};
