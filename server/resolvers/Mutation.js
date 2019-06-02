const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../users.json");

async function startTest(parent, { loadConfig }, { loadTestManager, user }) {
  await loadTestManager.start({ user: user.name, loadConfig });
  return loadTestManager.loadTest;
}

function stopTest(parent, args, { loadTestManager, user }) {
  loadTestManager.stop(user.name);
  return loadTestManager.loadTest;
}

async function login(parent, { name, password }) {
  const user = users[name];

  if (!user) {
    throw new Error(`Unknown user ${name}`);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error("Incorrect password");
  }

  return jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

module.exports = {
  startTest,
  stopTest,
  login
};
