import React, { useEffect, useState } from "react";
import { ReactComponent as YourSvg } from "./setting.svg";
import { ReactComponent as ForWard } from "./forward.svg";
import { ReactComponent as BackWard } from "./backward.svg";
import { ReactComponent as Pause } from "./Pause.svg";
import { ReactComponent as Play } from "./Play.svg";
import { ReactComponent as Mute } from "./Mute.svg";
import { ReactComponent as UnMute } from "./UnMute.svg";
import FArrow from "./fArrow.png";
import "./videoOverlay.css";

function VideoOverlay({ videoRef, playing, setPlaying }) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [muted, SetMuted] = useState(true);
  const [currentSettingIndex, setCurrentSettingIndex] = useState(0);
  const [currentPopUpItemsListItem, setCurrentPopUpItemListItem] = useState([
    360, 480, 720,
  ]);
  const [showListItem, setShowListItem] = useState(false);
  const [showPopUp, setShowPopUp] = useState(false);
  const [currentPopUpItems, setCurrentPopupItems] = useState([
    "Playback Speed",
    "Quality",
  ]);
  const [currentPopUpItemList, setCurrentPopUpItemList] = useState({
    0: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
    1: [360, 480, 720],
  });
  useEffect(() => {
    checkTime();
  }, []);
  useEffect(() => {
    if (muted) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = false;
    }
  }, [muted]);
  useEffect(() => {
    currentPopUpItemsListItem.map((a, b) => console.log(a));
  }, [currentPopUpItemsListItem]);
  const checkTime = () => {
    setInterval(() => {
      setCurrentProgress(
        (prev) => videoRef.current.currentTime / videoRef.current.duration
      );
    }, 1000);
  };
  const handleClick = (e) => {
    var currentx = e.clientX / e.target.clientWidth;
    var currentvideoduration = currentx * videoRef.current.duration;
    setCurrentProgress(currentx);
    videoRef.current.currentTime = currentvideoduration;
  };
  const handleItemClick = (index) => {
    setShowListItem(true);
    setCurrentPopUpItemListItem(currentPopUpItemList[index]);
    setCurrentSettingIndex(index);
  };
  const popUpItemClick = (value) => {
    if (currentSettingIndex == 0) {
      videoRef.current.playbackRate = value;
    } else {
      window.hls.levels.forEach((a, b) => {
        if (a.height == value) {
          window.hls.currentLevel = b;
        }
      });
    }
  };
  const handleForwardClick = () => {
    videoRef.current.currentTime += 10;
    setCurrentProgress(
      (prev) => videoRef.current.currentTime / videoRef.current.duration
    );
  };
  const handleBackwardClick = () => {
    videoRef.current.currentTime -= 10;
    setCurrentProgress(
      (prev) => videoRef.current.currentTime / videoRef.current.duration
    );
  };
  const handlePlayPauseClick = () => {
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((prev) => !prev);
  };
  return (
    <div
      style={{
        zIndex: "10",
        position: "absolute",
        width: "100%",
        bottom: "50px",
      }}
    >
      <div
        className="progress"
        onClick={(e) => {
          handleClick(e);
        }}
        style={{ margin: "8px 0px", cursor: "pointer" }}
      >
        <div
          onClickCapture={(e) => {
            console.log(e);
          }}
          className="video-progress-seek"
          style={{
            width: "100%",
            background: "grey",
            position: "absolute",
            height: "5px",
          }}
        ></div>
        <div
          className="video-progress"
          style={{
            transform: `scaleX(${currentProgress})`,
            backgroundColor: "red",
            height: "5px",
            transformOrigin: "left center",
          }}
        ></div>
      </div>
      <div
        className="leftControls"
        style={{ position: "absolute", display: "flex", columnGap: "10px" }}
      >
        <BackWard
          style={{ height: "25px", width: "25px", cursor: "pointer" }}
          onClick={handleBackwardClick}
        />
        <div onClick={handlePlayPauseClick}>
          {playing ? (
            <Pause
              style={{ height: "25px", width: "25px", cursor: "pointer" }}
            />
          ) : (
            <Play
              style={{ height: "25px", width: "25px", cursor: "pointer" }}
            />
          )}
        </div>
        <ForWard
          style={{ height: "25px", width: "25px", cursor: "pointer" }}
          onClick={handleForwardClick}
        />
        {muted ? (
          <UnMute
            onClick={() => {
              SetMuted((mute) => !mute);
            }}
            style={{ height: "25px", width: "25px", cursor: "pointer" }}
          />
        ) : (
          <Mute
            onClick={() => {
              SetMuted((mute) => !mute);
            }}
            style={{ height: "25px", width: "25px", cursor: "pointer" }}
          />
        )}
      </div>
      <div
        onClick={() => {
          setShowPopUp((prev) => !prev);
          setShowListItem(false);
        }}
        style={{
          position: "absolute",
          right: "20px",
          cursor: "pointer",
        }}
      >
        <YourSvg style={{ height: "25px", width: "25px" }} />
      </div>
      {showPopUp && (
        <div className="popup-box">
          <>
            {!showListItem &&
              currentPopUpItems.map((items, index) => (
                <div
                  className="popup-items"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  onClick={() => {
                    handleItemClick(index);
                  }}
                >
                  <div>{items}</div>
                  <img
                    src={FArrow}
                    style={{
                      height: "20px",
                      width: "20px",
                    }}
                  />
                </div>
              ))}
          </>
          <>
            {showListItem &&
              currentPopUpItemsListItem.map((value, index) => (
                <div
                  onClick={() => {
                    popUpItemClick(value);
                  }}
                  className="popup-items"
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>{value}</div>
                </div>
              ))}
          </>
        </div>
      )}
    </div>
  );
}

export default VideoOverlay;
