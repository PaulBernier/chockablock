const loadTestChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("LOAD_TEST_CHANGED");
  }
};

module.exports = {
  loadTestChanged
};
