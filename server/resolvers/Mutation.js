const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = db => ({
  startTest: async function(parent, { loadConfig }, { loadTestManager, user }) {
    await loadTestManager.start({ user: user.name, loadConfig });
    return loadTestManager.loadTest;
  },

  stopTest: function(parent, args, { loadTestManager, user }) {
    loadTestManager.stop(user.name);
    return loadTestManager.loadTest;
  },

  login: async function(parent, { name, password }) {
    const user = await db
      .collection("users")
      .findOne({ name }, { projection: { name: 1, password: 1 } });

    if (!user) {
      throw new Error(`Unknown user ${name}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Incorrect password");
    }

    return jwt.sign({ name }, process.env.JWT_SECRET, { expiresIn: "30d" });
  }
});
