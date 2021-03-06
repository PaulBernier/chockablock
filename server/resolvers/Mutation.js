const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = (db) => ({
  startTest: async function (
    parent,
    { loadConfig },
    { loadTestManager, user }
  ) {
    await loadTestManager.start({ user: user.name, loadConfig });
    return loadTestManager.loadTest;
  },

  stopTest: async function (parent, args, { loadTestManager, user }) {
    await loadTestManager.stop(user.name);
    return loadTestManager.loadTest;
  },

  login: async function (parent, { name, password }) {
    const user = await db.collection("users").findOne({ name });

    if (!user) {
      throw new Error(`Unknown user ${name}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Incorrect password");
    }

    return jwt.sign({ name, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: "3y",
    });
  },
});
