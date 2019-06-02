async function loadTest(parent, args, { loadTestManager }) {
  return loadTestManager.loadTest;
}

async function blockStatHistory(parent, args) {
  const history = [];
  const start = 81585;
  for (let i = 0; i < 72; ++i) {
    history.push({
      height: (start + i).toString(),
      timestamp: 1559502338 + i * 600,
      aeps: Math.random()
    });
  }

  return history;
}

module.exports = {
  loadTest,
  blockStatHistory
};
