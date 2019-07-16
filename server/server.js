require("dotenv").config();

const { GraphQLServer, PubSub } = require("graphql-yoga");
const { resolve } = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const jwt = require("jsonwebtoken");

(async () => {
  const db = await require("./mongodb");

  const pubsub = new PubSub();
  pubsub.ee.setMaxListeners(100);
  const loadTestManager = require("./loadtest")(pubsub);
  const blockchainMonitor = require("./blockchain_monitor")(pubsub);

  // Auth

  function getUser(req) {
    try {
      const { name } = jwt.verify(
        req.request.get("Authorization"),
        process.env.JWT_SECRET
      );
      console.log("erf?");
      return db
        .collection("u5sers")
        .findOne({ name }, { projection: { name: 1, roles: 1 } });
    } catch (e) {
      return null;
    }
  }

  const server = new GraphQLServer({
    typeDefs: resolve(__dirname, "schema.graphql"),
    resolvers: require("./resolvers/resolvers")(db),
    middlewares: [require("./permissions")],
    context: request => {
      return {
        ...request,
        user: getUser(request),
        loadTestManager,
        blockchainMonitor,
        pubsub
      };
    }
  });

  const serverConfig = {
    endpoint: "/graphql",
    subscriptions: "/graphql"
  };

  if (process.env.NODE_ENV === "production") {
    serverConfig.playground = false;
    serverConfig.cors = {
      origin: ["https://chocka.luciap.ca", "https://chockablock.luciap.ca"]
    };
  } else {
    serverConfig.playground = "/graphql";
    serverConfig.cors = {
      origin: ["http://localhost:4000", "http://localhost:8080"]
    };
  }

  server.start(serverConfig, () =>
    console.log(`Server is running on http://localhost:4000`)
  );

  const publicPath = resolve(__dirname, "../dist");
  server.express.use("/", history());
  server.express.use(express.static(publicPath));
})();
