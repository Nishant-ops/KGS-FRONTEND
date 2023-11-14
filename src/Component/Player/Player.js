import React, { useEffect, useRef, useState } from "react";
import VideoOverlay from "../VideoOverlay/VideoOverlay";
import Hls from "hls.js";

function Player() {
  const videoRef = useRef();
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (videoRef && videoRef.current) {
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource("/video/master.m3u8");
        hls.on(Hls.Events.MANIFEST_PARSED, function (events, data) {
          const a = hls.levels.map((l) => l.height);
          console.log("a", a);
        });
        hls.attachMedia(videoRef.current);
        videoRef.current.muted = true;
        window.hls = hls;
        const pr = videoRef.current.play();
        if (pr != undefined) {
          pr.then((res) => {
            console.log("Nishant", res);
          }).catch((err) => {
            // console.log("Nishant err", err);
          });
        }
        setPlaying(true);
      }
    }
  }, [videoRef, videoRef.current]);
  return (
    <>
      <div style={{ position: "relative", width: "70%" }}>
        <div
          className="video-parent"
          style={{ width: "100%", aspectRatio: "16/9" }}
        >
          <video
            ref={videoRef}
            style={{
              width: "100%",
              height: "100%",
            }}
          ></video>
        </div>
        <VideoOverlay
          videoRef={videoRef}
          playing={playing}
          setPlaying={setPlaying}
        ></VideoOverlay>
      </div>
    </>
  );
}

export default Player;
