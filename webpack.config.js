const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const fs = require("fs").promises;

const mergeJson = (fileName) => async (content, _absoluteFrom) => {
  const data = await fs.readFile(path.resolve(__dirname, fileName));

  const base = JSON.parse(data);
  const extension = JSON.parse(content.toString());

  return JSON.stringify({ ...base, ...extension });
};

module.exports = {
  mode: "production",
  entry: {
    "chromium/index": "./src/index.tsx",
    "firefox/index": "./src/index.tsx",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts"],
    alias: {
      "react/jsx-runtime": "preact-jsx-runtime/jsx-runtime",
      react: "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      // Must be below test-utils
    },
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // once for chromium
        { from: "src/assets", to: "chromium/assets" },
        { from: "src/index.html", to: "chromium" },
        {
          from: "manifest/chromium.json",
          to: "chromium/manifest.json",
          transform: mergeJson("manifest/base.json"),
        },
        // once for firefox
        { from: "src/assets", to: "firefox/assets" },
        { from: "src/index.html", to: "firefox" },
        {
          from: "manifest/firefox.json",
          to: "firefox/manifest.json",
          transform: mergeJson("manifest/base.json"),
        },
      ],
    }),
  ],
};
