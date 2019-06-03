const EventEmitter = require("events");
const Promise = require("bluebird");
const { FactomCli, FactomEventEmitter } = require("factom");

const HISTORY_LENGTH = 72;
const INTERVAL = process.env.NODE_ENV === "production" ? 30000 : 2000;

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
  }

  async computeState(directoryBlock) {
    const ebs = await Promise.map(directoryBlock.entryBlockRefs, ref =>
      this.cli.getEntryBlock(ref.keyMR)
    );

    const entryCount = ebs.reduce((acc, val) => acc + val.entryRefs.length, 0);

    return {
      height: directoryBlock.height,
      timestamp: directoryBlock.timestamp,
      entryCount
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
