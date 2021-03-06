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
    // popup script
    "chromium/index": "./src/popup/index.tsx",
    "firefox/index": "./src/popup/index.tsx",
    // background script
    "chromium/background": "./src/background/index.ts",
    "firefox/background": "./src/background/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
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
        { from: "assets", to: "chromium/assets" },
        { from: "src/popup/index.html", to: "chromium" },
        {
          from: "manifest/chromium.json",
          to: "chromium/manifest.json",
          transform: mergeJson("manifest/base.json"),
        },
        // once for firefox
        { from: "assets", to: "firefox/assets" },
        { from: "src/popup/index.html", to: "firefox" },
        {
          from: "manifest/firefox.json",
          to: "firefox/manifest.json",
          transform: mergeJson("manifest/base.json"),
        },
      ],
    }),
  ],
};
