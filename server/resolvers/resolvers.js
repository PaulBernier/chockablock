module.exports = db => ({
  Query: require("./Query"),
  Mutation: require("./Mutation")(db),
  Subscription: require("./Subscription")
});
