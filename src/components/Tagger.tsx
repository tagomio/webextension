import { FunctionComponent } from "preact";
import {
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { browser } from "webextension-polyfill-ts";
import { Messages } from "../messages";

declare module "react" {
  interface CSSProperties {
    // Add a CSS Custom Property
    "--cluster-margin"?: React.CSSProperties["margin"];
    "--cluster-justify-content"?: React.CSSProperties["justifyContent"];

    "--cover-padding"?: React.CSSProperties["padding"];
    "--cover-margin"?: React.CSSProperties["margin"];
    "--cover-min-height"?: React.CSSProperties["minHeight"];

    "--stack-split"?: React.CSSProperties["marginBottom"];
    "--stack-margin"?: React.CSSProperties["marginTop"];

    "--box-border"?: React.CSSProperties["border"];
    "--box-padding"?: React.CSSProperties["padding"];

    "--sidebar-min-width"?: React.CSSProperties["minWidth"];
    "--sidebar-flex-basis"?: React.CSSProperties["flexBasis"];
    "--sidebar-margin"?: React.CSSProperties["margin"];

    "--frame-n"?: number;
    "--frame-d"?: number;
  }
}

const Tag = ({
  tag,
  onClick,
  style = {},
}: {
  tag: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className="el-box"
      style={{
        "--box-padding": "var(--s-2)",
        borderRadius: "var(--s-3)",
        fontSize: "var(--s1)",
        cursor: "pointer",
        ...style,
      }}
      onClick={onClick}
    >
      {tag}
    </div>
  );
};

const Tagger: FunctionComponent = () => {
  const [tags, setTags] = useState([]);
  const [_, setUnloadHandler] = useState<() => void>(null);

  const addTag = (addedTag: string) => setTags([...tags, addedTag]);

  const removeTag = (deletedTag: string) =>
    setTags(tags.filter((tag) => tag !== deletedTag));

  const input = useRef(null);

  const port = browser.runtime.connect();

  // focus input on open
  useEffect(() => {
    input.current.focus();
  }, [input]);

  // update unload handler
  useEffect(() => {
    setUnloadHandler((oldHandler) => {
      window.removeEventListener("unload", oldHandler);
      const handler = () => {
        port.postMessage({ type: Messages.FLASH_GREEN });
        console.log(tags);
      };
      window.addEventListener("unload", handler);
      return handler;
    });
  }, [tags]);

  const checkKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    switch (event.code) {
      // keys to add tag
      case "Enter": {
        event.preventDefault();
        event.stopPropagation();

        addTag(input.current.value);
        input.current.value = "";
        break;
      }

      // key to remove last tag
      case "Escape": {
        event.preventDefault();
        event.stopPropagation();

        removeTag(tags[tags.length - 1]);
        break;
      }
    }
  };

  return (
    <div>
      <div className="el-stack">
        <div
          className="el-cluster"
          style={{ "--cluster-justify-content": "center" }}
        >
          <div className="el-box">
            {tags.map((tag, i) => (
              <Tag tag={tag} onClick={() => removeTag(tag)}></Tag>
            ))}
          </div>
        </div>
        <input
          ref={input}
          type="text"
          onKeyDown={checkKeyPress}
          placeholder="Give me some tags."
          className="el-center"
          style={{
            fontSize: "var(--s1)",
            textAlign: "center",
            padding: "var(--s0)",
          }}
        />
      </div>
    </div>
  );
};

export default Tagger;
