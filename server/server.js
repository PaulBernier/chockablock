require("dotenv").config();

const { GraphQLServer, PubSub } = require("graphql-yoga");
const { resolve } = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const jwt = require("jsonwebtoken");

(async () => {
  // Singleton DB client
  const db = await require("./mongodb");

  const pubsub = new PubSub();
  pubsub.ee.setMaxListeners(100);
  const loadTestManager = require("./loadtest")(pubsub, db);
  const blockchainMonitor = require("./blockchain_monitor")(pubsub, db);

  // Auth

  function getUser(req) {
    try {
      const { name, roles } = jwt.verify(
        req.request.get("Authorization"),
        process.env.JWT_SECRET
      );

      return { name, roles };
    } catch (e) {
      return null;
    }
  }

  const server = new GraphQLServer({
    typeDefs: resolve(__dirname, "schema.graphql"),
    resolvers: require("./resolvers/resolvers")(db),
    middlewares: [require("./permissions")],
    context: (request) => {
      return {
        ...request,
        user: getUser(request),
        loadTestManager,
        db,
        blockchainMonitor,
        pubsub,
      };
    },
  });

  const serverConfig = {
    endpoint: "/graphql",
    subscriptions: "/graphql",
  };

  if (process.env.NODE_ENV === "production") {
    serverConfig.playground = false;
    serverConfig.cors = {
      origin: ["https://chocka.luciap.ca", "https://chockablock.luciap.ca"],
    };
  } else {
    serverConfig.playground = "/graphql";
    serverConfig.cors = {
      origin: ["http://localhost:4000", "http://localhost:8080"],
    };
  }

  server.start(serverConfig, () =>
    console.log(`Server is running on http://localhost:4000`)
  );

  const publicPath = resolve(__dirname, "../www");
  server.express.use("/", history());
  server.express.use(express.static(publicPath));
})();
