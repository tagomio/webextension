import { browser } from "webextension-polyfill-ts";
import { Messages } from "../messages";
import { sleep } from "../utils";

browser.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async ({ type, data }) => {
    console.log("got message", type, data);
    switch (type) {
      case Messages.FLASH_GREEN:
        flashGreen();
        break;
      default:
        console.log("unknown message type:", type);
    }
  });
});

const flashGreen = async () => {
  // eventually remove initial delay once real work is beeing done before flashing
  await sleep(250);
  await browser.browserAction.setIcon({
    path: {
      16: "assets/icons/favicon-green-16x16.png",
      32: "assets/icons/favicon-green-32x32.png",
    },
  });
  await sleep(750);
  await browser.browserAction.setIcon({
    path: {
      16: "assets/icons/favicon-16x16.png",
      32: "assets/icons/favicon-32x32.png",
    },
  });
};
