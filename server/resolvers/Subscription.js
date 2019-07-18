const latestLoadTestChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("LOAD_TEST_CHANGED");
  }
};

const blockStatHistoryChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("BLOCK_STAT_HISTORY_CHANGED");
  }
};

const ecBalanceChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("EC_BALANCE_CHANGED");
  }
};

module.exports = {
  latestLoadTestChanged,
  blockStatHistoryChanged,
  ecBalanceChanged
};
