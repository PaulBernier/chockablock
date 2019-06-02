const loadTestChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("LOAD_TEST_CHANGED");
  }
};

const blockStatHistoryChanged = {
  subscribe: (parent, args, { pubsub }) => {
    setInterval(() => {
      const history = [];
      const start = 81585;
      for (let i = 0; i < 72; ++i) {
        history.push({
          height: (start + i).toString(),
          timestamp: 1559502338 + i * 600 + parseInt(Math.random() * 10),
          aeps: Math.random()
        });
      }

      pubsub.publish("BLOCK_STAT_HISTORY_CHANGED", {
        blockStatHistoryChanged: history
      });
    }, 5000);

    return pubsub.asyncIterator("BLOCK_STAT_HISTORY_CHANGED");
  }
};

module.exports = {
  loadTestChanged,
  blockStatHistoryChanged
};
