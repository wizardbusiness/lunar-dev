import { DesktopIcon } from "@radix-ui/react-icons";
import disableScroll from "./disableScroll";

// elements
const body: HTMLElement = document.querySelector("body");
const landingSection: HTMLElement = document.querySelector("#landing");
const aboutSection: HTMLElement = document.querySelector("#about");

const landingSectionContentGroup: NodeListOf<HTMLElement> = document.querySelectorAll(".transition-group");
const aboutSectionContentGroup: HTMLElement = document.querySelector("#text-content");

const sectionCaptionComponents: NodeListOf<HTMLElement> = document.querySelectorAll("#caption-container");
const captionComponentLanding: HTMLElement = sectionCaptionComponents[0];
const captionComponentAbout: HTMLElement = sectionCaptionComponents[1];
const landingComponentInitPosit: DOMRect = captionComponentLanding.getBoundingClientRect();
const aboutComponentInitPosit: DOMRect = captionComponentAbout.getBoundingClientRect();

const sectionNavCarets: NodeListOf<HTMLElement> = document.querySelectorAll("#scroll-caret");
const landingSectionCaret: HTMLElement = sectionNavCarets[0];
const aboutSectionCaret: HTMLElement = sectionNavCarets[1];

const aboutSectionPreNavArea: HTMLElement = document.querySelector("#nav-check");

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

function resetAllStyleProperties() {
  return (element: HTMLElement) => {
    element.attributeStyleMap.clear();
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
  "animate-grow",
  "animate-fade-in",
  "animate-fade-out",
  "fade-out-slow",
  "scooch-up",
  "long-blink",
] as const;

type Animations = (typeof animationLib)[number];
// ANCHOR[id=animateElements]
function animateElements(animations: Animations[]) {
  return (elements: HTMLElement[]) => {
    // remove all animations from the element before adding new ones
    elements.forEach((element) => {
      animationLib.forEach((animation) => {
        if (element.classList.contains(animation)) {
          element.classList.remove(animation);
        }
      });
    });
    elements.forEach((element) => {
      animations.forEach((animation) => {
        element.classList.add(animation);
      });
    });
  };
}

const scaleUp = animateElements(["animate-scale-up"]);
const slideUpAndFade = animateElements(["animate-slide-up"]);
const slideDown = animateElements(["animate-slide-down"]);
const squelch = animateElements(["before:animate-squelch"]);
const squish = animateElements(["before:animate-squish-down-lg"]);

// ******************************************************************************************************
const translations = ["translate-y-[0vh]", "translate-y-[100vh]"] as const;

type Translations = (typeof translations)[number];

// ANCHOR[id=translateElements]
function translateElements(staleTranslation: Translations, freshTranslation: Translations) {
  return (elements: HTMLElement[]) => {
    elements.forEach((element) => {
      const translateElement = replaceCSSClass(staleTranslation, freshTranslation);
      translateElement(element);
    });
  };
}

const translateUp = translateElements("translate-y-[100vh]", "translate-y-[0vh]");
const translateDown = translateElements("translate-y-[0vh]", "translate-y-[100vh]");

// ******************************************************************************************************
// ANCHOR[id=changeElementOpacity]
const opacities = ["opacity-[0.8]", "opacity-0"] as const;
type Opacities = (typeof opacities)[number];

function changeElementOpacity(staleOpacity: Opacities, freshOpacity: Opacities) {
  return (elements: HTMLElement[]) => {
    elements.forEach((element) => {
      const changeOpacity = replaceCSSClass(staleOpacity, freshOpacity);
      changeOpacity(element);
    });
  };
}

const increaseOpacity = changeElementOpacity("opacity-0", "opacity-[0.8]");
const decreaseOpacity = changeElementOpacity("opacity-[0.8]", "opacity-0");

// ******************************************************************************************************

const heights = ["h-0", "h[10vh]"] as const;
type Heights = (typeof heights)[number];

function changeElementHeight(staleHeight: Heights, freshHeight: Heights) {
  return (element: HTMLElement) => {
    const changeHeight = replaceCSSClass(staleHeight, freshHeight);
    changeHeight(element);
  };
}

const reduceHeight = changeElementHeight("h[10vh]", "h-0");
const increaseHeight = changeElementHeight("h-0", "h[10vh]");

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

const removeElement = changeElementDisplayType("flex", "hidden");

// ******************************************************************************************************

// ******************************************************************************************************

const directions = ["up", "down"] as const;

type Direction = (typeof directions)[number];

// Move captionContainer
// ANCHOR[id=moveElement]
function moveElement(
  captionComponent: HTMLElement,
  replacementCaptionComponent: HTMLElement,
  speed: number,
  acceleration: number,
  limit: number,
  direction: number,
) {
  const destination = replacementCaptionComponent.getBoundingClientRect().bottom;
  if (speed <= limit) speed = speed ** acceleration;
  captionComponent.style.top = `calc(${direction} * ${captionComponent.style.top} + ${speed}px)`;
  const captionComponentBottom = captionComponent.getBoundingClientRect().bottom;
  if (captionComponentBottom >= destination) {
    return;
  }
  requestAnimationFrame(() =>
    moveElement(captionComponent, replacementCaptionComponent, speed, acceleration, limit, direction),
  );
}

function moveCaptionComponentDown() {
  captionComponentLanding.style.top = "0";
  captionComponentLanding.style.position = "fixed";
  moveElement(captionComponentLanding, captionComponentAbout, 15, 1, 20, 1);
}

function moveCaptionComponentUp() {
  let destination = landingComponentInitPosit.bottom;
  moveElement(captionComponentAbout, captionComponentLanding, 15, 1.02, 20, -1);
}

// ******************************************************************************************************
const rectBounds = ["top", "bottom"] as const;

type RectBounds = (typeof rectBounds)[number];

type cbObj = {
  cb: (elements: HTMLElement[]) => void;
  elements: HTMLElement[];
  tag: string;
};

type TargetElementObj = {
  element: HTMLElement;
  tag: string;
  rectbound: "top" | "bottom";
};
// ANCHOR[id=checkPosition]
// LINK #checkPositionCall
function checkPositionRelativeToTarget(
  movingElement: HTMLElement,
  movingElRectbound: RectBounds,
  targets: TargetElementObj[],

  callbackObjs: cbObj[],
) {
  let elementCurrPosition = movingElement.getBoundingClientRect()[movingElRectbound];
  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    let targetElementCurrPosition = target.element.getBoundingClientRect()[target.rectbound];
    if (elementCurrPosition >= targetElementCurrPosition) {
      callbackObjs
        .filter((callbackObj) => callbackObj.tag === target.tag)
        .forEach((obj) => obj.cb(obj.elements));
    }
  }
  requestAnimationFrame(() => {
    checkPositionRelativeToTarget(movingElement, movingElRectbound, targets, callbackObjs);
  });
}

// ******************************************************************************************************
// ANCHOR[id=scroll]
function programaticallyScrollToNextSection() {
  window.scrollBy({
    // landing section height + nav check div height
    top: window.innerHeight,
    behavior: "smooth",
  });
}
// ******************************************************************************************************
// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// data-attributes

function setTransitionReadyFrom(currentSection: HTMLElement, nextSection: HTMLElement) {
  return () => {
    currentSection.setAttribute("data-transition-ready", "true");
    nextSection.setAttribute("data-transition-ready", "false");
  };
}

function getTransitionReady(currentSection: HTMLElement) {
  const transitionReady = currentSection.getAttribute("data-transition-ready") === "true" ? true : false;
  return transitionReady;
}

const setTransitionReadyLanding = setTransitionReadyFrom(landingSection, aboutSection);
const setTransitionReadyAbout = setTransitionReadyFrom(aboutSection, landingSection);

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// Observers
let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.8,
};

function observeSection(callback: Function) {
  return (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting === true) {
        callback();
      }
    });
  };
}

const observeLandingSection = observeSection(setTransitionReadyLanding); // LINK #landingSection
const observeAboutSection = observeSection(setTransitionReadyAbout); // LINK #aboutSection

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// Listeners
// ANCHOR[id=listeners]
// LINK #animations
// LINK #transitions
window.addEventListener("wheel", (e: WheelEvent) => {
  const transitionReadyFromLanding = getTransitionReady(landingSection);
  const transitionReadyFromAbout = getTransitionReady(aboutSection);
  if (transitionReadyFromLanding && e.deltaY > 0) {
    // disableScroll(true);
    slideUpAndFade([...landingSectionContentGroup]);
    scaleUp([captionComponentLanding]);
  } else if (transitionReadyFromAbout) {
    disableScroll(false);
    const preNavReady = aboutSectionPreNavArea.getAttribute("data-pre-transition-ready");
    if (!preNavReady && e.deltaY < 0) {
      showSection([aboutSectionPreNavArea]);
    } else if (preNavReady && e.deltaY > 0) {
      hideSection([aboutSectionPreNavArea]);
      squish([captionComponentAbout]);
    } else if (preNavReady && e.deltaY < 0) {
    }
  }
});

// ANCHOR[id=checkPositionListen]

captionComponentLanding.addEventListener("animationend", () => {
  const transitionReadyFromLanding =
    landingSection.getAttribute("data-transition-ready") === "true" ? true : false;
  if (transitionReadyFromLanding) {
    // LINK #moveElement
    moveCaptionComponentDown();
    programaticallyScrollToNextSection();
    // LINK #checkPosition
    // ANCHOR[id=checkPositionCall]
    checkPositionRelativeToTarget(
      captionComponentLanding,
      "bottom",
      [
        { element: aboutSection, rectbound: "top", tag: "a" },
        { element: captionComponentAbout, rectbound: "bottom", tag: "b" },
      ],
      [
        // LINK #moveElementDown
        // LINK #checkElementPosition
        // LINK #changeElementOpacity
        // LINK #animations
        { cb: translateUp, elements: [aboutSection], tag: "a" },
        { cb: removeElement, elements: [captionComponentLanding], tag: "b" },
        { cb: increaseOpacity, elements: [captionComponentAbout], tag: "b" },
        { cb: squish, elements: [captionComponentAbout], tag: "b" },
      ],
    );
  }
});

window.addEventListener("scroll", () => {
  const transitionReadyFromLanding = getTransitionReady(landingSection);
  aboutSection.getAttribute("data-transition-ready") === "true" ? true : false;
  const inTransition = body.getAttribute("data-in-transition") === "true" ? true : false;
  if (transitionReadyFromLanding && inTransition) {
  }
});