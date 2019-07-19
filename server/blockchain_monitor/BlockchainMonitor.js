const EventEmitter = require("events");
const Promise = require("bluebird");
const { FactomCli, FactomEventEmitter, getPublicAddress } = require("factom");

const HISTORY_LENGTH = 72;
const INTERVAL = process.env.NODE_ENV === "production" ? 30000 : 2000;
const EC_ADDRESS = process.env.EC_ADDRESS;
const PUBLIC_EC_ADDRESS = getPublicAddress(EC_ADDRESS);

class BlockchainMonitor extends EventEmitter {
  constructor(db) {
    super();
    this.cli = new FactomCli();
    this.emitter = new FactomEventEmitter(this.cli, { interval: INTERVAL });

    this.db = db;
    this.history = [];
    this.ecBalance = { address: PUBLIC_EC_ADDRESS, balance: 0 };
    this.nextBlockStartTime = 0;

    // Handle errors
    this.emitter.on("error", e =>
      console.error(`FactomEventEmitter error: ${e.message}`)
    );
  }

  async init() {
    this.ecBalance.balance = await this.cli.getBalance(PUBLIC_EC_ADDRESS);

    const dbHistory = await this.db
      .collection("blocks")
      .find({})
      .sort("height", -1)
      .limit(HISTORY_LENGTH)
      .toArray();
    this.history = dbHistory.reverse();

    // Corner case the first time the db is empty
    if (this.history.length > 0) {
      await this.backfillBlocks();
    }

    await this.startListening();
  }

  async backfillBlocks() {
    const dbHead = await this.cli.getDirectoryBlockHead();
    const lastSavedHeight = this.history[this.history.length - 1].height;
    if (lastSavedHeight < dbHead.height) {
      let height = lastSavedHeight + 1;
      console.log(`Backfilling blocks data from ${height}`);
      let moreBlocks = true;
      while (moreBlocks) {
        try {
          // The line below will throw once we passed the head of the DB chain
          const db = await this.cli.getDirectoryBlock(height);
          console.log(`Computing state of block ${height}`);
          const state = await this.computeState(db);
          await this.addState(state);
          height++;
        } catch (e) {
          if (e.code === -32008) {
            moreBlocks = false;
          } else {
            throw e;
          }
        }
      }
      console.log(`Done backfilling up to ${height - 1}`);
    }
  }

  async startListening() {
    console.log("Start listening to blockchain events");
    // Process new blocks
    this.emitter.on("newDirectoryBlock", async directoryBlock => {
      this.nextBlockStartTime = await this.cli
        .factomdApi("current-minute")
        .then(data => parseInt(data.currentblockstarttime / 1000000000));

      const state = await this.computeState(directoryBlock);
      await this.addState(state);

      this.emit("BLOCK_STAT_HISTORY_CHANGED", {
        history: this.history,
        nextBlockStartTime: this.nextBlockStartTime
      });
    });

    // Poll balance
    setInterval(async () => {
      try {
        const balance = await this.cli.getBalance(PUBLIC_EC_ADDRESS);
        if (this.ecBalance.balance !== balance) {
          this.ecBalance.balance = balance;
          this.emit("EC_BALANCE_CHANGED", this.ecBalance);
        }
      } catch (e) {
        console.error(
          `Failed to fetch balance of ${PUBLIC_EC_ADDRESS}: ${e.message}`
        );
      }
    }, 5000);
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

  async addState(state) {
    if (
      this.history.length > 0 &&
      state.height <= this.history[this.history.length - 1].height
    ) {
      return;
    }

    await this.db.collection("blocks").insertOne(state);
    this.history.push(state);
    if (this.history.length > HISTORY_LENGTH) {
      this.history.shift();
    }
  }
}

module.exports = BlockchainMonitor;
