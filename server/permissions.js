const { rule, shield, and } = require("graphql-shield");

// Rules

const isAuthenticated = rule()(async (parent, args, ctx) => {
  return ctx.user !== null;
});

const canControl = rule()(async (parent, args, ctx) => {
  return ctx.user.roles.includes("admin");
});

// Permissions

const permissions = shield({
  Mutation: {
    startLoad: and(isAuthenticated, canControl),
    stopLoad: and(isAuthenticated, canControl)
  }
});

module.exports = permissions;
