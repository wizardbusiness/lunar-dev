import disableScroll from "./disableScroll";
import { renderSkyline } from "../store";
import { check } from "astro/jsx/server.js";

// elements
const body: HTMLElement = document.querySelector("body");
const main: HTMLElement = document.querySelector("main");
const landingSection: HTMLElement = document.querySelector("#landing");
const infoSection: HTMLElement = document.querySelector("#info");
const myTitle: HTMLElement = document.querySelector("#my-title");
const landingSectionContentGroup: NodeListOf<HTMLElement> =
  document.querySelectorAll(".landing-transition-group");
const infoSectionContentGroup: HTMLElement = document.querySelector("#info-section-content-group");

const captionComponent: HTMLElement = document.querySelector("#caption-container");
const captionComponentBg: HTMLElement = document.querySelector("#caption-container-bg");
const captionComponentFg: HTMLElement = document.querySelector("#caption-container-fg");
const captionLandingContainer: HTMLElement = document.querySelector(".caption-landing-container");
const captionInfoContainer: HTMLElement = document.querySelector(".caption-info-container");

const sectionNavCarets: NodeListOf<HTMLElement> = document.querySelectorAll("#scroll-caret");
const landingSectionCaret: HTMLElement = sectionNavCarets[0];
const infoSectionCaret: HTMLElement = sectionNavCarets[1];

const infoSectionNavBar: HTMLElement = document.querySelector(".info-section-nav-bar");
const infoSectionPreNavArea: HTMLElement = document.querySelector("#nav-check");

// ------------------------------------------------------------------------------------------------------
// FUNCTIONS
// ------------------------------------------------------------------------------------------------------
// ANCHOR[id=cssUtilities]
// ******************************************************************************************************
function replaceCSSClass(staleClass: string, freshClass: string) {
  return (element: HTMLElement) => {
    element.classList.replace(staleClass, freshClass);
  };
}
// ******************************************************************************************************
function addCSSClass(freshClass: string) {
  return (element: HTMLElement) => {
    element.classList.add(freshClass);
  };
}

// ******************************************************************************************************

// all animations that can apply to an element involved in the transition
// NOTE: not exhaustive to all animations used in project

// ANCHOR[id=animations]
// LINK #listeners

const animationLib = [
  "animate-slide-up",
  "animate-slide-down",
  "animate-scale-up",
  "animate-squish-down-lg",
  "animate-squish-down-sm",
  "before:animate-squish-down-sm",
  "before:animate-squish-down-lg",
  "animate-squelch",
  "before:animate-squelch",
  "animate-float-up",
  "animate-float-up-more",
  "animate-float-in-place",
  "animate-bring-down",
  "animate-grow",
  "animate-fade-in",
  "animate-fade-out",
  "fade-out-slow",
  "animate-scooch-up",
  "animate-long-blink",
  "animate-pulse",
  "animate-pulse-lg"
] as const;

type Animations = (typeof animationLib)[number];
function removeAllAnimationsFromElement(element: HTMLElement) {
  animationLib.forEach((animation) => {
    if (element.classList.contains(animation)) {
      element.classList.remove(animation);
    }
  });
}

function waitForAnimationToFinish(element, eventName) {
  return new Promise((resolve, reject) => {
    function eventHandler(event: Event) {
      event.stopPropagation();
      const inTransition = checkIfInTransition();
      const preNavClosing = checkIfPreNavClosing();
      if (inTransition || preNavClosing) reject(event);
      element.removeEventListener(eventName, eventHandler);
      resolve(event);
    }
    element.addEventListener(eventName, eventHandler);
  });
}

async function playAnimationsInSequence(animations) {
  while (animations.length > 0) {
    const curr = animations.shift();
    const currAnimation = curr[0];
    const currElement = curr[1];
    try {
      currAnimation(currElement);
      await waitForAnimationToFinish(currElement, "animationend");
    } catch (error) {
      break;
    }
  }
}

// ANCHOR[id=animateElements]
function animateElement(newAnimation: Animations) {
  return (element: HTMLElement) => {
    // remove all animations from the element before adding new ones
    removeAllAnimationsFromElement(element);
    element.classList.add(newAnimation);
  };
}

const slideUpAndFade = animateElement("animate-slide-up");
const squelch = animateElement("animate-squelch");
const squish = animateElement("animate-squish-down-lg");
const floatUp = animateElement("animate-float-up");
const floatUpMore = animateElement("animate-float-up-more");
const floatInPlace = animateElement("animate-float-in-place");
const bringDown = animateElement("animate-bring-down");
const slideDown = animateElement("animate-slide-down");
const pulse = animateElement("animate-pulse");

// ******************************************************************************************************

// ******************************************************************************************************

const translations = ["translate-y-[0vh]", "translate-y-[100vh]"] as const;

type Translations = (typeof translations)[number];

// ANCHOR[id=translations]
function translateElement(staleTranslation: Translations, freshTranslation: Translations) {
  return (element: HTMLElement) => {
    const translateElement = replaceCSSClass(staleTranslation, freshTranslation);
    translateElement(element);
  };
}

const translateUp = translateElement("translate-y-[100vh]", "translate-y-[0vh]");
const translateDown = translateElement("translate-y-[0vh]", "translate-y-[100vh]");
// ******************************************************************************************************

function clearPropertiesAndSetNew(classRootStrs: string[]) {
  return (element: HTMLElement, freshClass?: string) => {
    classRootStrs.forEach((classRootStr) => {
      element.classList.forEach((cssClass) => {
        cssClass.includes(classRootStr) && element.classList.remove(cssClass);
      });
    });
    if (!freshClass) return;
    element.classList.add(freshClass);
  };
}

const setTransitionDuration = clearPropertiesAndSetNew(["duration"]);
const clearTransitionProperties = clearPropertiesAndSetNew(["duration", "transition", "translate"]);
const setTransitionTiming = clearPropertiesAndSetNew(["ease"]);
const setTransitionProperty = clearPropertiesAndSetNew(["transition"]);

const clearAnimationProperties = clearPropertiesAndSetNew(["animate"]);
const setTranslateDistance = clearPropertiesAndSetNew(["translate"]);
const setOpacity = clearPropertiesAndSetNew(["opacity"]);
const setScale = clearPropertiesAndSetNew(["scale"]);
const setPosition = clearPropertiesAndSetNew(["relative", "fixed", "absolute"]);
const setBottom = clearPropertiesAndSetNew(["bottom"]);

const clearPlacementProperties = clearPropertiesAndSetNew(["left", "right", "top", "bottom"]);

const heights = ["h-0", "h-[10vh]"] as const;
type Heights = (typeof heights)[number];

function changeElementHeight(staleHeight: Heights, freshHeight: Heights) {
  return (element: HTMLElement) => {
    const changeHeight = replaceCSSClass(staleHeight, freshHeight);
    changeHeight(element);
  };
}

const decreaseHeight = changeElementHeight("h-[10vh]", "h-0");
const increaseHeight = changeElementHeight("h-0", "h-[10vh]");

// ******************************************************************************************************

const cssDisplay = ["flex", "hidden"] as const;
type CSSDisplay = (typeof cssDisplay)[number];

function changeElementDisplayType(staleDisplay: CSSDisplay, freshDisplay: CSSDisplay) {
  return (elements: HTMLElement[]) => {
    elements.forEach((element) => {
      const changeDisplay = replaceCSSClass(staleDisplay, freshDisplay);
      changeDisplay(element);
    });
  };
}

// ANCHOR[id=hideSection]
const hideSection = changeElementDisplayType("flex", "hidden");
// ANCHOR[id=showSection]
const showSection = changeElementDisplayType("hidden", "flex");
// ******************************************************************************************************

const opacities = ["opacity-0", "opacity-1"] as const;
type Opacity = (typeof opacities)[number];

function changeElementOpacity(staleOpacity: Opacity, freshOpacity: Opacity) {
  return (element: HTMLElement) => {
    const changeOpacity = replaceCSSClass(staleOpacity, freshOpacity);
    changeOpacity(element);
  };
}

const changeElementOpacityToOne = changeElementOpacity("opacity-0", "opacity-1");
const changeElementOpacityToZero = changeElementOpacity("opacity-1", "opacity-0");
// ******************************************************************************************************

function changeElementParent(oldParent: HTMLElement, newParent: HTMLElement) {
  return (childElement: HTMLElement) => {
    if (![...oldParent.children].includes(childElement)) {
      console.error("child doesnt exist on parent");
    }
    oldParent.removeChild(childElement);
    newParent.appendChild(childElement);
  };
}

const changeParentToLandingContainerFromBody = changeElementParent(body, captionLandingContainer);
const changeParentToInfoContainerFromBody = changeElementParent(body, captionInfoContainer);
const changeParentToBodyFromInfoContainer = changeElementParent(captionInfoContainer, body);
const changeParentToBodyFromLandingContainer = changeElementParent(captionLandingContainer, body);

// ******************************************************************************************************

function changeElementPositionType(
  oldPositionType: "absolute" | "relative",
  newPositionType: "fixed" | "relative",
) {
  return (element: HTMLElement) => {
    const changePositionType = replaceCSSClass(oldPositionType, newPositionType);
    changePositionType(element);
  };
}

const changeElementPositionToRelative = changeElementPositionType("absolute", "relative");
const changeElementPositionToFixed = changeElementPositionType("relative", "fixed");

// ******************************************************************************************************
// getBounding client rect with whole values
function getBoundingClientRect(element: HTMLElement) {
  const { top, bottom, left, right } = element.getBoundingClientRect();
  return {
    top: Math.floor(top),
    bottom: Math.floor(bottom),
    left: Math.floor(left),
    right: Math.floor(right),
  };
}

// ******************************************************************************************************

// Move captionContainer

function setupElementForMove(
  element: HTMLElement,
  changeElementPositionToFixed: (element: HTMLElement) => void,
) {
  if (!element.classList.contains("fixed")) {
    changeElementPositionToFixed(element);
  }
}

//LINK #moveELementToinfoCall
//LINK #moveElementToLandingCall
// ANCHOR[id=moveElement]

function moveElement(
  element: HTMLElement,
  direction: "up" | "down",
  finishTransition: () => void,
  overlapObserverEntries: OverlapObserverEntry[],
) {
  observeTargetsOverlap(overlapObserverEntries, finishTransition, direction);
}

// ******************************************************************************************************

type CallBackArgs = HTMLElement[] | [HTMLElement, string?] | [...HTMLElement[], string[]] | string[];
type ModifyElementEntry = {
  callbackArgs?: CallBackArgs;
  callback: (...args: CallBackArgs) => void;
};

type TweakOverlapValueBy = {
  elOne?: { top?: number; bottom?: number };
  elTwo?: { top?: number; bottom?: number };
};

type OverlapObserverEntry = {
  observedEl: HTMLElement;
  observedPosition: number | HTMLElement;
  tweakOverlapValueBy?: TweakOverlapValueBy;
  forModificationOnObservedOverlap: ModifyElementEntry[];
  entryProcessed: boolean;
};

// ANCHOR[id=checkPosition]
// LINK #checkPositionCall
// LINK #checkPositionCallBackNav
function observeTargetsOverlap(
  overlapObserverEntries: OverlapObserverEntry[],
  finishTransition: () => void,
  direction: "up" | "down",
): boolean {
  overlapObserverEntries.forEach((observerEntry) => {
    const observedElTop =
      observerEntry.observedEl.getBoundingClientRect().top +
      (observerEntry.tweakOverlapValueBy?.elOne?.top || 0);
    const observedElBottom =
      Math.round(observerEntry.observedEl.getBoundingClientRect().bottom) +
      (observerEntry.tweakOverlapValueBy?.elOne?.bottom || 0);

    let observedPosition: number;
    if (typeof observerEntry.observedPosition === 'number') {
      observedPosition =
      observerEntry.observedPosition +
      (observerEntry.tweakOverlapValueBy?.elTwo?.top || 0);
    } else {
      if (direction === "up") {
        observedPosition = Math.round(observerEntry.observedPosition.getBoundingClientRect().bottom) +
        (observerEntry.tweakOverlapValueBy?.elTwo?.top || 0);
      } else if (direction === "down") {
        observedPosition = Math.round(observerEntry.observedPosition.getBoundingClientRect().top) + 
        (observerEntry.tweakOverlapValueBy?.elTwo?.top || 0);
      }
    }

    const entryProcessed = observerEntry.entryProcessed;
    if (
      (!entryProcessed &&
        direction === "down" &&
        observedElBottom >= observedPosition) ||
      (!entryProcessed && direction === "up" 
        && observedElBottom >= observedPosition
        && observedPosition !== 0)
    ) {
      observerEntry.forModificationOnObservedOverlap.forEach((entry) => {
        entry.callback(...entry.callbackArgs);
      });
      observerEntry.entryProcessed = true;
    }
  });
  const lastEntryProcessed = overlapObserverEntries[overlapObserverEntries.length - 1].entryProcessed;
  if (lastEntryProcessed) {
    // clearTransitionProperties(captionComponent);
    finishTransition();
    return;
  } else {
    requestAnimationFrame(() => {
      observeTargetsOverlap(overlapObserverEntries, finishTransition, direction);
    });
  }
}

// ******************************************************************************************************
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// DATA ATTRIBUTES STATE
function getCurrSection(): "landing" | "info" {
  const currSection = body.getAttribute("data-section");
  if (currSection === "landing" || currSection === "info") {
    return currSection;
  } else {
    throw new Error("Invalid transition direction");
  }
}

const transitionStep = ["", "a", "b", "c", "d", "e", "f", "g"] as const;
export type TransitionStep = (typeof transitionStep)[number];

function setCurrTransitionStep(step: TransitionStep) {
  captionComponent.setAttribute("data-transition-step", String(step));
}

function getCurrTransitionStep() {
  return captionComponent.getAttribute("data-transition-step");
}

function setCurrSection(section: "landing" | "info") {
  body.setAttribute("data-section", section);
}

function checkIfInTransition() {
  const inTransition = body.getAttribute("data-in-transition");
  return inTransition === "true" ? true : false;
}

function setInTransition(inTransition: string | boolean) {
  body.setAttribute("data-in-transition", String(inTransition));
}

function checkIfPreNavOpen(): boolean {
  const preNavOpen = infoSectionPreNavArea.getAttribute("data-pre-nav-open");
  return preNavOpen === "true" ? true : false;
}

function setPreNavOpen(open: boolean) {
  infoSectionPreNavArea.setAttribute("data-pre-nav-open", String(open));
}

function checkIfPreNavOpening(): boolean {
  const preNavOpening = infoSectionPreNavArea.getAttribute("data-pre-nav-opening");
  return preNavOpening === "true" ? true : false;
}

function setPreNavOpening(opening: boolean) {
  infoSectionPreNavArea.setAttribute("data-pre-nav-opening", String(opening));
}

function checkIfPreNavClosing(): boolean {
  const preNavClosing = infoSectionPreNavArea.getAttribute("data-pre-nav-closing");
  return preNavClosing === "true" ? true : false;
}

function setPreNavClosing(closing: boolean) {
  infoSectionPreNavArea.setAttribute("data-pre-nav-closing", String(closing));
}
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------

// WHEEL AND TOUCH MOVE EVENT LISTENER CALLBACKS

function handleUserOnLandingSection(yMagnitude: number, _e: WheelEvent | TouchEvent) {
  const inTransition = checkIfInTransition();
  if (!inTransition) {
    setCurrTransitionStep("a");
    setInTransition(true);
    setupElementForMove(captionComponent, changeElementPositionToFixed);
    setTranslateDistance(captionComponent, "-translate-y-[80vh]")
    setTransitionDuration(captionComponent, "duration-[800ms]");
    setTransitionTiming(captionComponent, "ease-out");
    [...landingSectionContentGroup, landingSectionCaret].forEach((element) => slideUpAndFade(element));
  }
}

function handleSwipe(section: HTMLElement, callback: (deltaY: number, e: Event) => void) {
  // let allowScrolling = true;
  // touch start event
  let startClientY: number;
  let endClientY: number;

  return (e: TouchEvent) => {
    startClientY = e.changedTouches[0].clientY;
    const handleTouchMove = (e: TouchEvent) => {
      endClientY = e.changedTouches[0].clientY;
      const yMagnitude = endClientY - startClientY;
      callback(yMagnitude, e);
    }

    const removeTouchMoveListener = () => {
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("scrollend", removeTouchMoveListener)
    }

    section.addEventListener("touchmove", handleTouchMove);
    section.addEventListener("scrollend", removeTouchMoveListener);
  };
};

function handleScroll(section: HTMLElement, callback) {
  return (e: WheelEvent) => {
    callback(-e.deltaY, e);
  };
}

const handleScrollOnLandingSection = handleScroll(landingSection, handleUserOnLandingSection);
const handleSwipeOnLandingSection = handleSwipe(landingSection, handleUserOnLandingSection);
4337
function goToInfoSection() {
  setCurrTransitionStep("b");
  const ccBoundingRect = captionComponent.getBoundingClientRect()
  document.documentElement.style.setProperty("--caption-container-top", `${Math.round(ccBoundingRect.top)}px`);
  document.documentElement.style.setProperty("--caption-container-left", `${Math.round(ccBoundingRect.left)}px`);
  captionComponent.classList.add("top-[--caption-container-top]", "left-[--caption-container-left]");
  setTranslateDistance(captionComponent, "translate-y-[0vh]")
  changeParentToBodyFromLandingContainer(captionComponent);
  setTransitionTiming(captionComponent, "ease-in-out-polar");
  setTransitionDuration(captionComponent, "duration-[2500ms]");
  // need delay to reset caption position after switch to body parent
  setTimeout(() => setTranslateDistance(captionComponent, "translate-y-[100vh]"), 10);

  const finishTransitionToInfoSection = () => {
    captionComponent.classList.remove("top-[--caption-container-top]", "left-[--caption-container-left]");
    setTranslateDistance(captionComponent, "translate-y-[0vh]");
    setTranslateDistance(captionComponentFg, "-translate-y-[4vh]");
    setTranslateDistance(captionComponentBg, "translate-y-[0vh]");
  };

  // LINK #checkPosition
  // ANCHOR[id=checkPositionCallForwardNav]
  // LINK #moveElement
  // ANCHOR[id=moveElementToinfoCall]
  moveElement(captionComponent, "down", finishTransitionToInfoSection, [
    {
      observedEl: captionComponent,
      observedPosition: myTitle.getBoundingClientRect().top,
      forModificationOnObservedOverlap: [
        {
          callbackArgs: ["c"],
          // LINK #translations
          callback: function (...args: [TransitionStep]) {
            const timeoutID = setTimeout(() => {
              setCurrTransitionStep(...args);
              clearTimeout(timeoutID)
            }, 1700);
            hideSection([landingSection]);
          },
        },
        {
          callbackArgs: [],
          // LINK #translations
          callback: () => {
            disableScroll(true)
          }
        },
      ],
      entryProcessed: false,
    },
    {
      observedEl: captionComponent,
      observedPosition: captionLandingContainer.getBoundingClientRect().top,
      forModificationOnObservedOverlap: [
        {
          callbackArgs: [infoSectionContentGroup],
          // LINK #translations
          callback: function (...contentGroup: [HTMLElement]) {
              translateUp(...contentGroup);
          },
        },
      ],
      entryProcessed: false,
    },
    {
      observedEl: captionComponent,
      observedPosition: infoSectionContentGroup,
      forModificationOnObservedOverlap: [
        {
          callbackArgs: ["d"],
          // LINK #animations
          callback: setCurrTransitionStep,
        },
        {
          callbackArgs: [captionComponent, "absolute"],
          // LINK #animations
          callback: setPosition,
        },
        {
          callbackArgs: [captionComponent, "-bottom-1"],
          // LINK #animations
          callback: setBottom
        },
        {
          callbackArgs: [captionComponent],
          // LINK #animations
          callback: changeParentToInfoContainerFromBody,
        },
        {
          callbackArgs: [captionComponentBg],
          // LINK #animations
          callback: squish,
        },
        {
          callbackArgs: [],
          // LINK #animations
          callback: () => renderSkyline.set(true),
        },
      ],
      entryProcessed: false,
    },
  ]);
}

function handleUserOnInfoSection(deltaY: number, e: WheelEvent | TouchEvent) {
  const preNavOpen = checkIfPreNavOpen();
  const preNavOpening = checkIfPreNavOpening();
  const preNavClosing = checkIfPreNavClosing();

  const inTransition = checkIfInTransition();

  // clear float animation from captionComponent, but not animations on child elements
  if (preNavClosing) {
      e.preventDefault();
      clearAnimationProperties(captionComponent);
      return;
  }

  if (preNavOpening || preNavClosing) {
    e.preventDefault();
    return;
  } 
  if (!preNavOpen && deltaY > 0 && window.scrollY <= 0 && !inTransition) {
    setPreNavOpening(true);
    renderSkyline.set(false);
    increaseHeight(infoSectionPreNavArea);
    setOpacity(infoSectionNavBar, "opacity-0");
    setOpacity(infoSectionCaret, "opacity-75")
    setScale(infoSectionCaret, "scale-100");
    pulse(infoSectionCaret);
    playAnimationsInSequence([
      [squelch, captionComponentBg],
      [floatUp, captionComponentBg],
      [floatUpMore, captionComponent],
      [floatInPlace, captionComponent],
    ]);
  } else if ((preNavOpen && deltaY < 0) || (preNavOpening && deltaY < 0)) {
    e.preventDefault();
    setPreNavClosing(true);
    setPreNavOpening(false);
    renderSkyline.set(true);
    removeAllAnimationsFromElement(infoSectionCaret);
    setScale(infoSectionCaret, "scale-75");
    setOpacity(infoSectionCaret, "opacity-20")
    setOpacity(infoSectionNavBar, "opacity-1");
    decreaseHeight(infoSectionPreNavArea);
    clearAnimationProperties(captionComponent);
    playAnimationsInSequence([
      [bringDown, captionComponentBg],
      [squish, captionComponentBg],
    ]);
    squish(captionComponentBg);
  } else if (preNavOpen && deltaY > 0) {
    removeAllAnimationsFromElement(infoSectionCaret);
    setOpacity(infoSectionCaret, "opacity-0");
    // hide nav bar from user
    setOpacity(infoSectionNavBar, "opacity-0");
    // slide info section content down to simulate caption component moving away from section
    setTranslateDistance(infoSectionContentGroup, "translate-y-[100vh]");
    goToLandingSection();
  }
}

function goToLandingSection() {
  setCurrTransitionStep("e");
  setInTransition(true);
  // clean up info section
  setPreNavOpen(false);
  decreaseHeight(infoSectionPreNavArea);
  setOpacity(infoSectionNavBar, "opacity-0");
  setOpacity(landingSectionCaret, "opacity-0");

  // set up caption component for move
  setupCaptionComponentForMoveToLanding();
  // set up landing section
  setOpacity(landingSection, "opacity-0");
  // use delay to keep info section in view during info section transform
  const timeoutID = setTimeout(() => {
    setCurrTransitionStep("f");
    showSection([landingSection]);
    hideSection([infoSection])
    clearTimeout(timeoutID);
  }, 800);

  function setupCaptionComponentForMoveToLanding() {
    const ccBoundingRect = getBoundingClientRect(captionComponentFg);
    changeElementPositionToFixed(captionComponent);
    changeParentToBodyFromInfoContainer(captionComponent);
    document.documentElement.style.setProperty("--caption-container-top", `${ccBoundingRect.top}px`);
    document.documentElement.style.setProperty("--caption-container-left", `${ccBoundingRect.left}px`);
    captionComponent.classList.add("top-[--caption-container-top]", "left-[--caption-container-left]");
    // add in new transition properties
    setTransitionDuration(captionComponent, "duration-[2500ms]");
    setTransitionTiming(captionComponent, "ease-in-out");
    // clear animation on caption component (if present, will interfere with translate transform)
    clearAnimationProperties(captionComponent);
    clearAnimationProperties(captionComponentFg);
    clearAnimationProperties(captionComponentBg);
    // clear transition properties
    clearTransitionProperties(captionComponentFg);
    clearTransitionProperties(captionComponentBg);
    setTranslateDistance(captionComponent, "translate-y-0");
    const timeoutID = setTimeout(() => {
      setTranslateDistance(captionComponent, "translate-y-[80vh]");
      clearTimeout(timeoutID);
    }, 20);
  }

  function finishTransitionToLandingSection() {
    [captionComponent, captionComponentBg, captionComponentFg, infoSectionCaret, landingSectionCaret].forEach(
      (element) => clearAnimationProperties(element),
    );
    setOpacity(infoSectionCaret, "opacity-0");
    clearTransitionProperties(captionComponent)
    clearPlacementProperties(captionComponent);
    showSection([infoSection]);
  }
  // LINK #moveElement
  // ANCHOR[id=moveElementToLandingCall]
  moveElement(captionComponent, "up", finishTransitionToLandingSection, [
    {
      observedEl: captionComponent,
      observedPosition: captionLandingContainer,
      forModificationOnObservedOverlap: [
        {
          callbackArgs: ["g"],
          callback: setCurrTransitionStep,
        },
        {
          callbackArgs: [captionComponent, captionComponentBg, captionComponentFg],
          callback: removeAllAnimationsFromElement,
        },
        {
          callbackArgs: [captionComponent],
          callback: changeParentToLandingContainerFromBody,
        },
        {
          callbackArgs: [captionComponent],
          callback: changeElementPositionToRelative,
        },
        {
          callbackArgs: [captionComponent],
          callback: clearPlacementProperties,
        },
        {
          callbackArgs: [captionComponent, "translate-y-0"],
          callback: setTranslateDistance,
        },
        {
          callbackArgs: [landingSection, "opacity-1"],
          callback: setOpacity,
        },
        {
          callbackArgs: [...landingSectionContentGroup],
          callback: function () {
            const elements = [...arguments];
            elements.forEach((element) => slideDown(element));
          },
        },
      ],
      entryProcessed: false,
    },
  ]);
}



function handleBeforeUnload() {
  showSection([landingSection]);
  window.scrollTo(0, 0);
  landingSection.removeEventListener("wheel", handleScrollOnLandingSection);
  landingSection.removeEventListener("touchstart", handleSwipeOnLandingSection);
  myTitle.removeEventListener("animationend", handleMyTitleAnimationEnd);
  infoSectionPreNavArea.removeEventListener("transitionend", handlePreNavTransitionEnd);
  infoSectionNavBar.removeEventListener("transitionend", handleNavBarTransitionEnd);
  infoSectionContentGroup.removeEventListener("transitionend", handleInfoSectionContentTransitionEnd);
  window.removeEventListener("beforeunload", handleBeforeUnload);
}

function handlePreNavTransitionEnd() {
  const preNavOpening = checkIfPreNavOpening();
  const preNavClosing = checkIfPreNavClosing();
  
  if (preNavOpening) {
    setPreNavOpening(false);
    setPreNavOpen(true);

  } else if (preNavClosing) {
    setPreNavClosing(false);
    setPreNavOpen(false);
  }
}

function handleCaptionComponentTransitionEnd() {
  const currSection = getCurrSection();
  const inTransition = checkIfInTransition();
  const currTransitionStep = getCurrTransitionStep();
  if (currSection === "landing" && inTransition && currTransitionStep === "a") {
    goToInfoSection();
  }
}

// end transition back to landing
function handleMyTitleAnimationEnd() {
  if (myTitle.classList.contains("animate-slide-down")) {
    setCurrTransitionStep("");
    setInTransition(false);
    setOpacity(landingSectionCaret, "opacity-1");
  }
}

function handleInfoSectionContentTransitionEnd() {
  const inTransition = checkIfInTransition();
  const currSection = getCurrSection();
  if (inTransition && currSection === "info") {
    setCurrTransitionStep("");
    setInTransition(false);
    setScale(infoSectionCaret, "scale-75")
    setOpacity(infoSectionCaret, "opacity-50")
    changeElementOpacityToOne(infoSectionNavBar);
    infoSection.scrollIntoView();
  }
}

const handleSwipeOnInfoSection = handleSwipe(infoSection, handleUserOnInfoSection);
const handleScrollOnInfoSection = handleScroll(infoSection, handleUserOnInfoSection);


function observeSection(callback: Function) {
  return (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting === true) {
        callback();
      }
    });
  };
}


function observeIfInTransition(mutationList: MutationRecord[], _observer: MutationObserver) {
  for (const mutation of mutationList) {
    if (mutation.type === "attributes") {
      const inTransition = body.getAttribute("data-in-transition");
      const currSection = body.getAttribute("data-section");
      if (inTransition === "true" || currSection === "landing") {
        disableScroll(true);
      } else if (inTransition === "false" && currSection === "info") {
        disableScroll(false)
      }
    }
  }
}

landingSection.addEventListener("touchmove", (e) => e.preventDefault)
infoSection.addEventListener("touchmove", (e) => e.preventDefault)


const mutationObserverConfig = {
  attributes: true,
  // attributeFilter: ["data-in-transition"]
}

const transitionObserver = new MutationObserver(observeIfInTransition)
transitionObserver.observe(body, mutationObserverConfig);


// ******************************************************************************************************
// DO STUFF HERE

// start with scroll disabled


disableScroll(true);

window.addEventListener("beforeunload", handleBeforeUnload);

// set css variables in advance - this lets them also be accessible to the skyline effect, which is a react component.
const captionComponentWidth = captionComponent.getBoundingClientRect().width;
const infoSectionWidth = infoSectionContentGroup.getBoundingClientRect().width;

document.documentElement.style.setProperty("--caption-width", `${captionComponentWidth}px`);
document.documentElement.style.setProperty("--info-cont-width", `${infoSectionWidth}px`);
// have to do this again to get mutation observer to fire for some unknown reason
const timeoutID = setTimeout(
  () => {
    document.documentElement.style.setProperty("--info-cont-width", `${infoSectionWidth}px`)
    clearTimeout(timeoutID)
  },
  20,
);

// EVENT LISTENERS

landingSection.addEventListener("wheel", handleScrollOnLandingSection, { passive: false });
landingSection.addEventListener("touchstart", handleSwipeOnLandingSection, { passive: false });

infoSection.addEventListener("touchstart", handleSwipeOnInfoSection, { passive: false });
// need touchstart to cancel swipe since touchmove isnt cancelable for performance reasons
infoSection.addEventListener("wheel", handleScrollOnInfoSection, { passive: false });

myTitle.addEventListener("animationend", handleMyTitleAnimationEnd);

captionComponent.addEventListener("transitionend", handleCaptionComponentTransitionEnd);


infoSectionPreNavArea.addEventListener("transitionend", handlePreNavTransitionEnd);

function handleNavBarTransitionEnd(e: TransitionEvent) {
  e.stopPropagation();
}

infoSectionNavBar.addEventListener("transitionend", handleNavBarTransitionEnd);



infoSectionContentGroup.addEventListener("transitionend", handleInfoSectionContentTransitionEnd);

function getObserverThreshold(section: HTMLElement) {
  const sectionHeight = section.getBoundingClientRect().height;
  const windowHeight = window.innerHeight;
  const ratio = Math.floor((windowHeight / sectionHeight) * 100) / 100;
  const threshold = ratio < 1 ? ratio : 1;
  return threshold;
}

let options = {
  root: null,
  rootMargin: "0px",
  threshold: getObserverThreshold(infoSection)
};

const observeLandingSection = observeSection(() => {
  setCurrSection("landing");
}); // LINK #landingSection
const observeInfoSection = observeSection(() => {
  const inTransition = checkIfInTransition();
  if (!inTransition) {
    disableScroll(false);
  }
  setCurrSection("info");
}); // LINK #infoSection

const landingSectionObserver = new IntersectionObserver(observeLandingSection, options);
const infoSectionObserver = new IntersectionObserver(observeInfoSection, options);

landingSectionObserver.observe(landingSection);
infoSectionObserver.observe(infoSection);
