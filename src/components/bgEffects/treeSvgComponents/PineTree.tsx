import { transform } from "lodash";
import React, { useState, useEffect } from "react";

const PineTree = ({
  renderSkyline,
  treeHeight,
  treeWidth,
  scaleX,
  scaleY,
  color,
  zIndex,
  foliageTranslate,
  delay,
  delayEffectMs,
}) => {
  const [grow, setGrow] = useState(false);
  useEffect(() => {
    const totalDelay = delayEffectMs + delay;
    const setTimeoutID = setTimeout(() => (renderSkyline ? setGrow(true) : setGrow(false)), totalDelay);
    return () => clearTimeout(setTimeoutID);
  }, [renderSkyline, delay, delayEffectMs]);

  return (
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 340.6 200.07"
      className={`${grow ? "scale-100" : "scale-0 opacity-0"} transition-all duration-[500ms]`}
      style={{
        height: treeHeight,
        width: "treeWidth",
        fill: color,
        stroke: "#2b3c56",
        strokeMiterlimit: 10,
        transform: grow ? `scale(${scaleX}, ${scaleY})` : `scale(${scaleX / 4}, 0)`,
        transformBox: "fill-box",
        transformOrigin: "bottom",
        zIndex: zIndex,
      }}
    >
      <g id="Foliage-4" data-name="Foliage" className="">
        <polygon
          className="cls-1"
          points="267.18 126.74 262.02 149.96 76.67 149.96 72.48 127.84 173.48 0 267.18 126.74"
        />
        <polygon
          className="cls-1"
          points="316.51 239.25 308.75 267.99 29.46 267.99 23.14 240.61 175.33 82.35 316.51 239.25"
        />
        <polygon
          className="cls-1"
          points="339.65 358.63 330.66 392.24 7.31 392.24 0 360.22 176.2 175.17 339.65 358.63"
        />
      </g>
      <g id="Trunk">
        <polygon
          className="cls-1"
          points="209.46 468.07 130.19 468.07 151.31 387.77 193.23 387.77 209.46 468.07"
        />
      </g>
    </svg>
  );
};

export default PineTree;
