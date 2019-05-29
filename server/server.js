require("dotenv").config();

const { GraphQLServer, PubSub } = require("graphql-yoga");
const { resolve } = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const jwt = require("jsonwebtoken");
const { LoadGenerator } = require("./LoadGenerator");
const users = require("./users.json");

const loadGenerator = new LoadGenerator();
const pubsub = new PubSub();
pubsub.ee.setMaxListeners(100);

loadGenerator.on("LOAD_CONFIG_CHANGE", config =>
  pubsub.publish("LOAD_CONFIG_CHANGE", { loadConfigChanged: config })
);

// Auth

function getUser(req) {
  try {
    const { name } = jwt.verify(
      req.request.get("Authorization"),
      process.env.JWT_SECRET
    );
    return users[name];
  } catch (e) {
    return null;
  }
}

const server = new GraphQLServer({
  typeDefs: resolve(__dirname, "schema.graphql"),
  resolvers: require("./resolvers/resolvers"),
  middlewares: [require("./permissions")],
  context: request => {
    return {
      ...request,
      user: getUser(request),
      loadGenerator,
      pubsub
    };
  }
});

server.start(
  {
    endpoint: "/graphql",
    playground: "/graphql",
    subscriptions: "/graphql",
    cors: { origin: true }
  },
  () => console.log(`Server is running on http://localhost:4000`)
);

const publicPath = resolve(__dirname, "../dist");
server.express.use(express.static(publicPath));
server.express.use("/", history());
