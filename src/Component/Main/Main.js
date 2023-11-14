import axios from "axios";
import React, { useEffect, useState } from "react";
import { generateUuid } from "../../utils";

function Main() {
  const [shows, setShow] = useState({});
  const [hasShow, setHasShow] = useState(false);
  const [showAdmin, setShowAdmin] = useState(localStorage.getItem("name"));
  const [hasName, setHasName] = useState(localStorage.getItem("name") != null);
  useEffect(() => {
    if (localStorage.getItem("id") == null) {
      localStorage.setItem("id", generateUuid());
    }
    getShows();
  }, []);
  const getShows = async () => {
    const data = await axios.get("http://localhost:8080/show");
    if (data.data.data != null || data.data.data != undefined) {
      setHasShow(true);
      setShow(data.data.data.showData[0]);
    }
  };
  const handleShowClick = () => {
    window.location.pathname = `/show/${shows.id}`;
  };
  const handleCreateShow = async () => {
    const showData = {
      id: Date.now(),
      adminName: showAdmin,
      adminId: localStorage.getItem("id"),
    };
    const data = await axios.post(
      "http://localhost:8080/show",
      JSON.stringify(showData),
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(data);
  };
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {hasShow ? (
        <div>
          <div>{"A Show already exist"}</div>
          <button onClick={handleShowClick}>{"Go to Show"}</button>
        </div>
      ) : (
        <div>
          <div>{"createShow"}</div>
          <input
            disabled={hasName}
            placeholder={
              hasName == false ? "enter admin name" : `start as ${showAdmin}`
            }
            onChange={(e) => setShowAdmin(e.target.value)}
          ></input>
          <button onClick={handleCreateShow}>{"start show"}</button>
        </div>
      )}
    </div>
  );
}

export default Main;
