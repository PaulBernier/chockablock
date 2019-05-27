const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../users.json");

async function startLoad(parent, { wps, nbOfChains }, { loadGenerator }) {
  await loadGenerator.run({ wps, nbOfChains });
  return loadGenerator.config;
}

function stopLoad(parent, args, { loadGenerator }) {
  loadGenerator.stop();
  return loadGenerator.config;
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
  startLoad,
  stopLoad,
  login
};
