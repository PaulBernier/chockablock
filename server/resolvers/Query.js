async function loadConfig(parent, args, { loadGenerator }) {
  return loadGenerator.config;
}

module.exports = {
  loadConfig
};
