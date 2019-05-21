const express = require("express");
const { resolve } = require("path");
const cors = require("cors");
const history = require("connect-history-api-fallback");

const app = express();

app.use(cors());

// GraphQL API
app.use("/graphql", require("./graphql"));

// Frontend
const publicPath = resolve(__dirname, "../dist");
app.use(express.static(publicPath));
app.use("/", history());

// Start server
app.listen(4000, "127.0.0.1", function() {
  console.log("Running a GraphQL API server at localhost:4000/graphql");
});
