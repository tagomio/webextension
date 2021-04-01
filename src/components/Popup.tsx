import { useState, useEffect } from "react";
import { browser } from "webextension-polyfill-ts";
import { Tagger } from "./";

const Popup = () => {
  const [tabUrl, setTabUrl] = useState("");

  useEffect(() => {
    browser.tabs
      .query({
        active: true,
        currentWindow: true,
      })
      .then(([tab]) => tab.url)
      .then(setTabUrl);
  }, []);

  return (
    <div className="el-cover">
      <h1 className="el-center">tagom</h1>
      <p className="el-center">add tags for {tabUrl}</p>
      <Tagger></Tagger>
    </div>
  );
};

export default Popup;
