import React, { useContext, useEffect, useState } from "react";
import "./Chat.css";
import { useWebSocketContext } from "../WebSocketContext/useWebSocketContext";
import WebSocketContext from "../WebSocketContext/WebSocketContext";
import axios from "axios";
import { ReactComponent as PinSvg } from "./Pin.svg";
function Chat({ showId }) {
  const {
    ws,
    chatMessage,
    setChatMessages,
    hasPinned,
    pinnedMsg,
    setHasPinned,
    setPinnedMsg,
  } = useWebSocketContext(WebSocketContext);
  const [inputMessage, setInputMessage] = useState("");
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [hasName, setHasName] = useState(localStorage.getItem("name") !== null);

  useEffect(() => {
    getShow();
    getMessage();
  }, []);
  const getShow = async () => {
    const res = await axios.get(`/show/${showId}`);
    if (res.data.data.showData[0].adminId == localStorage.getItem("id")) {
      localStorage.setItem("role", "admin");
      setUserRole("admin");
      setName(res.data.data.showData[0].adminName);
      setHasName(true);
      localStorage.setItem("name", res.data.data.showData[0].adminName);
    } else {
      localStorage.setItem("role", "consumer");
      setUserRole("consumer");
    }
    console.log(res);
  };
  const getMessage = async () => {
    const res = await axios.get("https://kgs-backend.vercel.app/message");
    console.log(res);
    setChatMessages((curr) => [...curr, ...res.data.data.message]);
    if (res.data.data.pinned != undefined || res.data.data.pinned != null) {
      setHasPinned(true);
      setPinnedMsg(res.data.data.pinned);
    }
    const chatl = document.querySelector(".chatList");
    const end = document.querySelector(".end-div");
    // chatl.scrollTop = chatl.scrollHeight;
    setTimeout(() => {
      end.scrollIntoView({
        block: "end",
        behavior: "smooth",
        inline: "nearest",
      });
    }, 1000);
  };
  const handleClick = async () => {
    if (hasName == false) {
      localStorage.setItem("name", name);
      setHasName(true);
      return;
    }
    const a = {
      message: inputMessage,
      name: name,
    };
    setInputMessage("");
    console.log(ws);
    if (ws.current.readyState === 1) ws.current.send(JSON.stringify(a));
    const req = await axios.post("/message", JSON.stringify(a), {
      headers: { "Content-Type": "application/json" },
    });
    const end = document.querySelector(".end-div");
  };
  const handlePinClick = async (a, b) => {
    if (hasPinned) {
      const pin = {
        message: pinnedMsg.message,
        name: pinnedMsg.name,
        type: "unpinned",
      };
      const res = await axios.delete("/pinned/varun", JSON.stringify(pin));
      if (ws.current.readyState === 1) ws.current.send(JSON.stringify(pin));
    } else {
      const pin = {
        message: b,
        name: a,
        type: "pinned",
      };
      const res = await axios.post("/pinned", JSON.stringify(pin), {
        headers: { "Content-Type": "application/json" },
      });
      if (ws.current.readyState === 1) ws.current.send(JSON.stringify(pin));
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: "fit-content", textAlign: "center" }}>Chat</div>
      {hasPinned && (
        <div
          className="messageBox"
          style={{
            borderRadius: "20px",
            border: "1px solid black",
            padding: "10px",
            width: "200px",
            marginTop: "10px",
            scrollSnapAlign: "start",
            background: "blue",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: "white" }}>{pinnedMsg?.name}</div>
            {userRole == "admin" && (
              <PinSvg
                onClick={handlePinClick}
                style={{
                  height: "15px",
                  width: "15px",
                  cursor: "pointer",
                }}
              />
            )}
          </div>
          <div style={{ color: "white" }}>{pinnedMsg?.message}</div>
        </div>
      )}
      <div
        className="chatList"
        style={{
          rowGap: "10px",
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          position: "relative",
        }}
      >
        <div
          className="chat-message-box-parent"
          style={{
            position: "absolute",
            bottom: "10px",
            height: "auto",
            maxHeight: "100%",
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
          }}
        >
          {chatMessage.length > 0 &&
            chatMessage.map((messageData, index) => (
              <div
                className="messageBox"
                style={{
                  borderRadius: "20px",
                  border: "1px solid black",
                  padding: "10px",
                  width: "200px",
                  marginTop: "10px",
                  scrollSnapAlign: "start",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>{messageData?.name}</div>
                  {userRole == "admin" && (
                    <PinSvg
                      onClick={() => {
                        handlePinClick(messageData?.name, messageData?.message);
                      }}
                      style={{
                        height: "15px",
                        width: "15px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
                <div>{messageData?.message}</div>
              </div>
            ))}
          <div className="end-div" style={{ height: "10px" }}></div>
        </div>
      </div>

      <div style={{ height: "fit-content" }}>
        <input
          placeholder={
            hasName === false ? "Enter your name" : "Enter a message"
          }
          onChange={(e) =>
            hasName === false
              ? setName(e.target.value)
              : setInputMessage(e.target.value)
          }
          value={hasName === false ? name : inputMessage}
        />
        <button onClick={handleClick}>{"Submit"}</button>
      </div>
    </div>
  );
}

export default Chat;
