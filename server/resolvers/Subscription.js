const loadConfigChanged = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("LOAD_CONFIG_CHANGE");
  }
};

module.exports = {
  loadConfigChanged
};
