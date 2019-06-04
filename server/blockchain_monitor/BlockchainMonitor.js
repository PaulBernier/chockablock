const EventEmitter = require("events");
const Promise = require("bluebird");
const { FactomCli, FactomEventEmitter, getPublicAddress } = require("factom");

const HISTORY_LENGTH = 72;
const INTERVAL = process.env.NODE_ENV === "production" ? 30000 : 2000;
const EC_ADDRESS = process.env.EC_ADDRESS;
const PUBLIC_EC_ADDRESS = getPublicAddress(EC_ADDRESS);

class BlockchainMonitor extends EventEmitter {
  constructor() {
    super();
    this.history = [];
    this.cli = new FactomCli();
    this.emitter = new FactomEventEmitter(this.cli, { interval: INTERVAL });

    this.emitter.on("newDirectoryBlock", async directoryBlock => {
      const state = await this.computeState(directoryBlock);
      this.addState(state);
    });

    this.ecBalance = 0;
    setInterval(async () => {
      const balance = await this.cli.getBalance(PUBLIC_EC_ADDRESS);
      if (this.ecBalance !== balance) {
        this.emit("EC_BALANCE_CHANGED", balance);
        this.ecBalance = balance;
      }
    }, 5000);
  }

  async init() {
    this.ecBalance = this.cli.getBalance(PUBLIC_EC_ADDRESS);
  }

  async computeState(directoryBlock) {
    const adminBlock = await this.cli.getAdminBlock(
      directoryBlock.adminBlockRef
    );

    const hasElection =
      adminBlock.getEntriesOfTypes(5).length > 0 &&
      adminBlock.getEntriesOfTypes(6).length;

    const ebs = await Promise.map(
      directoryBlock.entryBlockRefs,
      ref => this.cli.getEntryBlock(ref.keyMR),
      { concurrency: 25 }
    );

    const entryCount = ebs.reduce((acc, val) => acc + val.entryRefs.length, 0);

    return {
      height: directoryBlock.height,
      timestamp: directoryBlock.timestamp,
      entryCount,
      hasElection
    };
  }

  addState(state) {
    this.history.push(state);
    if (this.history.length > HISTORY_LENGTH) {
      this.history.shift();
    }
    this.emit("BLOCK_STAT_HISTORY_CHANGED", this.history);
  }
}

module.exports = BlockchainMonitor;
