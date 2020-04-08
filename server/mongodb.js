const { MongoClient } = require("mongodb");

const URL = "mongodb://localhost:27017",
  DB_NAME = "chocka";

module.exports = (async function () {
  const client = new MongoClient(URL, {
    poolSize: 10,
    useNewUrlParser: true,
  });

  console.log(`Connecting to DB ${URL}`);
  await client.connect();
  console.log("Connected to MongoDB");

  return client.db(DB_NAME);
})();
