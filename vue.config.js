const webpack = require("webpack");

module.exports = {
  pluginOptions: {
    apollo: {
      lintGQL: true,
    },
  },
  configureWebpack: () => {
    const API_BASE_URL =
      process.env.NODE_ENV === "production" ? "" : "http://localhost:4000";

    return {
      plugins: [
        new webpack.DefinePlugin({
          "process.env.API_BASE_URL": JSON.stringify(API_BASE_URL),
        }),
      ],
    };
  },
};
