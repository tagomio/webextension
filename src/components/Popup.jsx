import { useState, useEffect } from "react";

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
    </div>
  );
};

export default Popup;
