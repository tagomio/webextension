import useSWR from "swr";

import { tagUrl, fetcher } from "./constants";

const Popup = () => {
  const { data, error } = useSWR(tagUrl, fetcher);

  return (
    <div className="el-cover">
      {data && data.map((t) => <p>${t}</p>)}
      <h1 className="el-center">tagom</h1>
    </div>
  );
};

export default Popup;
