const { GraphQLServer, PubSub } = require("graphql-yoga");
const { resolve } = require("path");
const express = require("express");
const history = require("connect-history-api-fallback");
const { LoadGenerator } = require("./LoadGenerator");

const loadGenerator = new LoadGenerator();
const pubsub = new PubSub();
pubsub.ee.setMaxListeners(100);

loadGenerator.on("LOAD_CONFIG_CHANGE", config =>
  pubsub.publish("LOAD_CONFIG_CHANGE", { loadConfigChange: config })
);

const server = new GraphQLServer({
  typeDefs: resolve(__dirname, "schema.graphql"),
  resolvers: require("./resolvers/resolvers"),
  context: request => {
    return {
      ...request,
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
