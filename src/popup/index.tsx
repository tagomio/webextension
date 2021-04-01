import { render } from "react-dom";
import { browser } from "webextension-polyfill-ts";
import { Popup } from "../components";

const port = browser.runtime.connect();

port.onMessage.addListener(({ type, data }) => {
  console.log("got message", type, data);
  switch (type) {
    default:
      console.log("unknown message type:", type);
  }
});

render(<Popup />, document.body);
