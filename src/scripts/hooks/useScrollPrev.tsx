import React, { useEffect, useState } from "react";

const useScrollPrev = () => {
  const [deltaY, setDeltaY] = useState(0);
  const [clicked, setClicked] = useState(false);
  const [transitionCount, setTransitionCount] = useState(0);
  const [effectElementsCount, setEffectElementsCount] = useState(0);
  useEffect(() => {
    if (!location.href.includes("/Main")) return;
    const taglineContainer = document.querySelector("[data-subheader]");
    const buildingElements = Array.from(
      document.querySelectorAll(".structure"),
    );
    const forestElements = Array.from(document.querySelectorAll(".tree"));
    setEffectElementsCount((prevLength) =>
      forestElements.length > prevLength ? forestElements.length : prevLength,
    );
    const scrollContainer = document.querySelector("main");
    const scrollCaret: HTMLElement =
      document.querySelector("[data-scroll-btn]");
    const handleScrollPrev = (e: WheelEvent) => {
      setDeltaY(e.deltaY);
      if (deltaY < 0) {
        buildingElements.forEach((element) =>
          element.classList.remove("build"),
        );
        forestElements.forEach((element) => {
          element.classList.remove("grow");
          element.addEventListener("transitionend", () =>
            setTransitionCount((prevCount) => (prevCount += 1)),
          );
        });

        scrollCaret.classList.add("animate-fade-out");
      }
    };

    if (
      transitionCount >= Math.floor(effectElementsCount) &&
      transitionCount > 0 &&
      !clicked
    ) {
      taglineContainer.classList.replace(
        "2xl:before:w-[22vw]",
        "2xl:before:w-[70vw]",
      );
      taglineContainer.classList.replace(
        "lg:before:animate-squish-down-lg",
        "lg:before:animate-squelch-up-lg",
      );
      taglineContainer.classList.replace(
        "before:animate-squish-down-sm",
        "before:animate-squelch-up-sm",
      );
      taglineContainer.classList.add("animate-rise-from"),
        taglineContainer.addEventListener("animationend", () =>
          scrollCaret.click(),
        );
      setClicked(true);
    }
    scrollContainer.addEventListener("wheel", handleScrollPrev);
    return () => {
      scrollContainer.removeEventListener("wheel", handleScrollPrev);
    };
  }, [deltaY, transitionCount]);

  return;
};

export default useScrollPrev;
