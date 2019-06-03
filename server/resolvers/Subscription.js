const loadTestChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("LOAD_TEST_CHANGED");
  }
};

const blockStatHistoryChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("BLOCK_STAT_HISTORY_CHANGED");
  }
};

module.exports = {
  loadTestChanged,
  blockStatHistoryChanged
};
