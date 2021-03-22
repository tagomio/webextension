const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.jsx",
  output: {
    filename: "index.js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      // Must be below test-utils
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/icons", to: "icons" },
        { from: "src/index.html" },
        { from: "manifest.json" },
      ],
    }),
  ],
};
