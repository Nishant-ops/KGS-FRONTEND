import React, { useEffect, useRef, useState } from "react";
import WebSocketContext from "./WebSocketContext";

function WebSocketContextProvider(props) {
  const ws = useRef(undefined);
  const [hasPinned, setHasPinned] = useState(false);
  const [pinnedMsg, setPinnedMsg] = useState({});
  const [chatMessage, setChatMessages] = useState([]);
  const value = {
    ws: ws,
    chatMessage,
    setChatMessages,
    hasPinned,
    setHasPinned,
    pinnedMsg,
    setPinnedMsg,
  };
  let socketCheckTimeout = null;
  let startTime = Date.now();
  const estblishConnection = () => {
    if (ws.current) {
      ws.current.removeEventListener("open", null);
      ws.current.removeEventListener("close", null);
      ws.current.removeEventListener("error", null);
      ws.current.removeEventListener("message", null);
      ws.current.close();
    }
    ws.current = new WebSocket("ws://localhost:7071/ws");
    const eventMessage = (event) => {
      const messageData = JSON.parse(event.data);
      if (messageData?.type == "pinned") {
        setHasPinned(true);
        setPinnedMsg(messageData);
      } else if (messageData?.type == "unpinned") {
        setHasPinned(false);
      } else setChatMessages((prev) => [...prev, messageData]);
    };
    const eventOpen = (event) => {
      console.log(event);
    };
    const eventClose = (event) => {
      console.log(event);
    };
    const eventError = (event) => {
      console.log(event);
    };

    ws.current?.addEventListener("open", eventOpen);
    ws.current?.addEventListener("close", eventClose);
    ws.current?.addEventListener("error", eventError);
    ws.current?.addEventListener("message", eventMessage);
  };
  const checkAndReconnectSocket = () => {
    if (
      !ws ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN ||
      Date.now() - startTime > 600000
    ) {
      startTime = Date.now();
      estblishConnection();
    }
    socketCheckTimeout = setTimeout(() => {
      checkAndReconnectSocket();
    }, 5000);
  };
  useEffect(() => {
    checkAndReconnectSocket();
    return () => {
      if (ws.current) {
        ws.current.removeEventListener("open", null);
        ws.current.removeEventListener("close", null);
        ws.current.removeEventListener("error", null);
        ws.current.removeEventListener("message", null);
        ws.current = null;
      }
      clearTimeout(socketCheckTimeout);
    };
  }, []);
  return (
    <WebSocketContext.Provider value={value}>
      {props.children}
    </WebSocketContext.Provider>
  );
}

export default WebSocketContextProvider;
