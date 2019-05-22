async function startLoad(parent, { wps, nbOfChains }, { loadGenerator }) {
  await loadGenerator.run({ wps, nbOfChains });
  return loadGenerator.config;
}

function stopLoad(parent, args, { loadGenerator }) {
  loadGenerator.stop();
  return loadGenerator.config;
}

module.exports = {
  startLoad,
  stopLoad
};
