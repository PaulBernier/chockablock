const loadConfigChange = {
  subscribe: (parent, args, { pubsub }) => {
    return pubsub.asyncIterator("LOAD_CONFIG_CHANGE");
  }
};

module.exports = {
  loadConfigChange
};
