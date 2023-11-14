import { useEffect, useState } from "react";

import Chat from "../Chat/Chat";
import Player from "../Player/Player";
import WebSocketContextProvider from "../WebSocketContext/WebSocketContextProvider";
import { generateUuid } from "../../utils";

function Show() {
  const [showId, setShowId] = useState(
    window.location.pathname.substring(
      window.location.pathname.lastIndexOf("/") + 1
    )
  );
  useEffect(() => {
    if (localStorage.getItem("id") == null) {
      localStorage.setItem("id", generateUuid());
    }
  }, []);
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        columnGap: "10%",
      }}
    >
      <Player></Player>
      <WebSocketContextProvider>
        <Chat showId={showId}></Chat>
      </WebSocketContextProvider>
    </div>
  );
}

export default Show;
