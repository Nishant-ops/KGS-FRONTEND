import axios from "axios";
import React, { useEffect, useState } from "react";
import { generateUuid } from "../../utils";
import { ReactComponent as Delete } from "./delete.svg";
import "./Main.css";

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
    try {
      const data = await axios.get("https://kgs-backend.vercel.app/show");
      if (data.data.data != null || data.data.data != undefined) {
        setHasShow(true);
        setShow(data.data.data.showData[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleShowClick = () => {
    window.location.pathname = `/show/${shows.id}`;
  };
  const handleCreateShow = async () => {
    try {
      const showData = {
        id: Date.now(),
        adminName: showAdmin,
        adminId: localStorage.getItem("id"),
      };
      const data = await axios.post(
        "https://kgs-backend.vercel.app/show",
        JSON.stringify(showData),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      window.location.pathname = `/show/${showData.id}`;
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async () => {
    try {
      const data = await axios.delete(
        `https://kgs-backend.vercel.app/show/${shows.id}`
      );
      // console.log(data);
      if (data.status == 200) {
        setHasShow(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="main">
      {hasShow ? (
        <>
          <div>{"A Show already exist"}</div>
          <div className="button-div">
            <button className="show" onClick={handleShowClick}>
              {"Go to Show"}
            </button>
            <Delete
              onClick={handleDelete}
              style={{
                height: "25px",
                width: "25px",
                cursor: "pointer",
                padding: "12px",
              }}
            />
          </div>
        </>
      ) : (
        <>
          <div>{"createShow"}</div>
          <input
            className="input-admin-name"
            disabled={hasName}
            placeholder={
              hasName == false ? "enter admin name" : `start as ${showAdmin}`
            }
            onChange={(e) => setShowAdmin(e.target.value)}
          ></input>
          <button className="show" onClick={handleCreateShow}>
            {"start show"}
          </button>
        </>
      )}
    </div>
  );
}

export default Main;
