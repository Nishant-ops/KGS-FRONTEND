import { useEffect, useState } from "react";
import "./App.css";
import Chat from "./Component/Chat/Chat";
import Main from "./Component/Main/Main";
import Player from "./Component/Player/Player";
import WebSocketContextProvider from "./Component/WebSocketContext/WebSocketContextProvider";
import Axios from "axios";
import { generateUuid } from "./utils";

function App() {
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

export default App;
