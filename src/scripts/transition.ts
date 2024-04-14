import disableScroll from "./disableScroll";

// elements
const body: HTMLElement = document.querySelector("body");
const landingSection: HTMLElement = document.querySelector("#landing");
const infoSection: HTMLElement = document.querySelector("#info");

const landingSectionContentGroup: NodeListOf<HTMLElement> =
  document.querySelectorAll(".landing-transition-group");
const infoSectionContentGroup: HTMLElement = document.querySelector("#text-content");

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
  "animate-float-in-place",
  "animate-bring-down",
  "animate-grow",
  "animate-fade-in",
  "animate-fade-out",
  "fade-out-slow",
  "scooch-up",
  "long-blink",
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
    function eventHandler(event) {
      element.removeEventListener(eventName, eventHandler);
      resolve(event);
    }
    element.addEventListener(eventName, eventHandler);
  });
}

async function playAnimationsInSequence(animations) {
  while (animations.length) {
    const curr = animations.shift();
    const currAnimation = curr[0];
    const currElement = curr[1];
    try {
      currAnimation(currElement);
      await waitForAnimationToFinish(captionComponentBg, "animationend");
    } catch (error) {
      console.error("couldn't find animation");
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
const bringDown = animateElement("animate-bring-down");
const floatUpBgAndTxt = animateElement("animate-float-in-place");
const slideDown = animateElement("animate-slide-down");

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

function clearPropertiesAndReplace(classRootStrs: string[]) {
  return (element: HTMLElement, freshClasses?: string[]) => {
    classRootStrs.forEach((classRootStr) => {
      element.classList.forEach(
        (cssClass) => cssClass.includes(classRootStr) && element.classList.remove(cssClass),
      );
    });
    if (!freshClasses) return;
    freshClasses.forEach((freshClass) => element.classList.add(freshClass));
    console.log(element.classList);
  };
}

const setTransitionDuration = clearPropertiesAndReplace(["duration"]);
const clearTransitionProperties = clearPropertiesAndReplace(["duration", "transition", "translate"]);

const clearAnimationClasses = clearPropertiesAndReplace(["animate"]);
const setTranslateDistance = clearPropertiesAndReplace(["translate"]);

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

const hideElement = changeElementDisplayType("flex", "hidden");
const showElement = changeElementDisplayType("hidden", "flex");

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

const changeParentToLandingContainer = changeElementParent(captionInfoContainer, captionLandingContainer);
const changeParentToinfoContainer = changeElementParent(captionLandingContainer, captionInfoContainer);
// ******************************************************************************************************

function changeElementPositionType(
  oldPositionType: "fixed" | "relative",
  newPositionType: "fixed" | "relative",
) {
  return (element: HTMLElement) => {
    const changePositionType = replaceCSSClass(oldPositionType, newPositionType);
    changePositionType(element);
  };
}

const changeElementPositionToRelative = changeElementPositionType("fixed", "relative");
const changeElementPositionToFixed = changeElementPositionType("relative", "fixed");

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

function moveElementV2(
  element: HTMLElement,
  freshCSSClasses: string[],
  translate: (element: HTMLElement, freshClasses: string[]) => void,
  direction: "up" | "down",
  finishTransition: () => void,
  overlapObserverEntries: OverlapObserverEntry[],
) {
  translate(element, freshCSSClasses);
  observeTargetsOverlap(overlapObserverEntries, finishTransition, direction);
}

// ******************************************************************************************************

type ModifyElementEntry = {
  callbackArgs?: string[];
  callbackToModifyEls: (element: HTMLElement, args: string[]) => void;
  elsBeingModified: HTMLElement[];
};

type TweakOverlapValueBy = {
  elOne?: { top?: number; bottom?: number };
  elTwo?: { top?: number; bottom?: number };
};

type OverlapObserverEntry = {
  observedElOne: HTMLElement;
  observedElTwo: HTMLElement;
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
    const firstElTop =
      observerEntry.observedElOne.getBoundingClientRect().top +
      (observerEntry.tweakOverlapValueBy?.elOne?.top || 0);
    const firstElBottom =
      observerEntry.observedElOne.getBoundingClientRect().bottom +
      (observerEntry.tweakOverlapValueBy?.elOne?.bottom || 0);
    const secondElTop =
      observerEntry.observedElTwo.getBoundingClientRect().top +
      (observerEntry.tweakOverlapValueBy?.elTwo?.top || 0);
    const secondElBottom =
      observerEntry.observedElTwo.getBoundingClientRect().bottom +
      (observerEntry.tweakOverlapValueBy?.elTwo?.bottom || 0);
    const entryProcessed = observerEntry.entryProcessed;
    if (
      (!entryProcessed &&
        direction === "down" &&
        firstElBottom >= secondElTop &&
        firstElTop <= secondElBottom) ||
      (!entryProcessed && direction === "up" && firstElTop <= secondElTop)
    ) {
      observerEntry.forModificationOnObservedOverlap.forEach((entry) => {
        entry.elsBeingModified.forEach((el) => {
          entry.callbackToModifyEls(el, entry.callbackArgs);
        });
      });
      observerEntry.entryProcessed = true;
    }
  });
  const lastEntryProcessed = overlapObserverEntries[overlapObserverEntries.length - 1].entryProcessed;
  if (lastEntryProcessed) {
    changeElementPositionToRelative(captionComponent);
    clearTransitionProperties(captionComponent, []);
    finishTransition();
    return;
  } else {
    requestAnimationFrame(() => {
      observeTargetsOverlap(overlapObserverEntries, finishTransition, direction);
    });
  }
}

// ******************************************************************************************************
// ANCHOR[id=getElementPosition]
function accountForTransformInCalcdRectBound(element: HTMLElement, rectBound: "top" | "bottom") {
  return element.getBoundingClientRect()[rectBound];
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

function getCurrSection(): "landing" | "info" {
  const currSection = body.getAttribute("data-section");
  if (currSection === "landing" || currSection === "info") {
    return currSection;
  } else {
    throw new Error("Invalid transition direction");
  }
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

function setPreNavClosing(Closing: boolean) {
  infoSectionPreNavArea.setAttribute("data-pre-nav-closing", String(Closing));
}

// ------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------
// start with scroll disabled
disableScroll(true);
// Listeners
// ANCHOR[id=listeners]
// LINK #animations
// LINK #transitions

function moveElementFromLandingToinfo() {
  const finishTransitionToInfoSection = () => {
    setTranslateDistance(captionComponentFg, ["-translate-y-[5vh]"]);
    setTranslateDistance(captionComponentBg, ["translate-y-[0vh]"]);
  };
  // LINK #moveElement
  // ANCHOR[id=moveElementToinfoCall]
  programaticallyScrollToNextSection();
  // LINK #checkPosition
  // ANCHOR[id=checkPositionCallForwardNav]
  moveElementV2(
    captionComponent,
    ["translate-y-[100vh]"],
    translateDown,
    "down",
    finishTransitionToInfoSection,
    [
      {
        observedElOne: captionComponent,
        observedElTwo: infoSection,
        tweakOverlapValueBy: { elOne: { bottom: 100 } },
        forModificationOnObservedOverlap: [
          {
            elsBeingModified: [infoSection],
            callbackArgs: [],
            // LINK #translations
            callbackToModifyEls: translateUp,
          },
        ],
        entryProcessed: false,
      },
      {
        observedElOne: captionComponent,
        observedElTwo: infoSectionContentGroup,
        tweakOverlapValueBy: { elOne: { bottom: 0 } },
        forModificationOnObservedOverlap: [
          {
            elsBeingModified: [captionComponent],
            callbackArgs: [],
            // LINK #animations
            callbackToModifyEls: changeElementPositionToRelative,
          },
          {
            elsBeingModified: [captionComponent],
            callbackArgs: [],
            // LINK #animations
            callbackToModifyEls: changeParentToinfoContainer,
          },
        ],
        entryProcessed: false,
      },
      {
        observedElOne: captionComponent,
        observedElTwo: infoSectionContentGroup,
        tweakOverlapValueBy: { elOne: { bottom: 0 } },
        forModificationOnObservedOverlap: [
          {
            callbackArgs: [],
            elsBeingModified: [captionComponentBg],
            // LINK #animations
            callbackToModifyEls: squish,
          },
        ],
        entryProcessed: false,
      },
    ],
  );
}

captionComponent.addEventListener("transitionend", () => {
  const currSection = getCurrSection();
  if (currSection === "landing") {
    setTranslateDistance(captionComponent, ["translate-y-[100vh]"]);
  }
});

window.addEventListener(
  "wheel",
  (e: WheelEvent) => {
    const currSection = getCurrSection();
    const inTransition = checkIfInTransition();
    if (inTransition) {
      e.preventDefault();
      return;
    }
    if (currSection === "landing" && e.deltaY >= 0) {
      setInTransition(true);
      setupElementForMove(captionComponent, changeElementPositionToFixed);
      setTranslateDistance(captionComponent, ["-translate-y-[80vh]"]);
      [...landingSectionContentGroup, landingSectionCaret].forEach((element) => slideUpAndFade(element));
    }
  },
  { passive: false },
);

// ANCHOR[id=checkPositionListen]

captionComponent.addEventListener("transitionend", () => {
  const currSection = getCurrSection();
  const inTransition = checkIfInTransition();
  if (currSection === "landing" && inTransition) {
    setTransitionDuration(captionComponent, ["duration-[3000ms]"]);
    moveElementFromLandingToinfo();
  }
});

function scrollToLandingSection() {
  showSection([landingSection]);
  infoSection.scrollIntoView(); // VERY IMPORTANT - otherwise page jumps to landing section as soon as it is painted
  landingSection.scrollIntoView({ block: "start", behavior: "smooth" });

  setTransitionDuration(captionComponent, ["duration-[3000ms]"]);
  setTranslateDistance(captionComponent, ["-translate-y-[100vh]"]);

  function finishTransitionToLandingSection() {
    setTranslateDistance(captionComponentFg, ["translate-y-[0vh]"]);
  }
  // LINK #moveElement
  moveElementV2(
    captionComponent,
    ["-translate-y-[100vh]"],
    setTranslateDistance,
    "up",
    finishTransitionToLandingSection,
    [
      {
        observedElOne: captionComponent,
        observedElTwo: captionLandingContainer,
        forModificationOnObservedOverlap: [
          {
            callbackToModifyEls: changeElementPositionToRelative,
            elsBeingModified: [captionComponent],
          },
          {
            callbackToModifyEls: changeParentToLandingContainer,
            elsBeingModified: [captionComponent],
          },
          {
            callbackToModifyEls: removeAllAnimationsFromElement,
            elsBeingModified: [captionComponent, captionComponentBg, captionComponentFg],
          },
          {
            callbackToModifyEls: slideDown,
            elsBeingModified: [...landingSectionContentGroup],
          },
        ],
        entryProcessed: false,
      },
    ],
  );
  setInTransition(false);
}

infoSection.addEventListener("wheel", (e: WheelEvent) => {
  const preNavOpen = checkIfPreNavOpen();
  if (!preNavOpen && e.deltaY < 0 && window.scrollY <= 25) {
    disableScroll(true);
    setPreNavOpening(true);
    increaseHeight(infoSectionPreNavArea);
    playAnimationsInSequence([
      [squelch, captionComponentBg],
      [floatUp, captionComponentBg],
      [floatUpBgAndTxt, captionComponent],
    ]);
  } else if (preNavOpen && e.deltaY > 0) {
    setPreNavClosing(true);
    decreaseHeight(infoSectionPreNavArea);
    playAnimationsInSequence([
      [bringDown, captionComponentBg],
      [squish, captionComponentBg],
    ]);
    squish(captionComponentBg);
  } else if (preNavOpen && e.deltaY <= 25) {
    clearAnimationClasses(captionComponent);
    setInTransition(true);
    setPreNavOpen(false);
    decreaseHeight(infoSectionPreNavArea);
    setupElementForMove(captionComponent, changeElementPositionToFixed);
    scrollToLandingSection();
  }
});

infoSection.addEventListener("transitionend", () => {
  const inTransition = checkIfInTransition();
  if (inTransition) {
    changeElementOpacityToOne(infoSectionNavBar);
    changeElementOpacityToOne(infoSectionCaret);
    setInTransition(false);
    disableScroll(false);
    hideSection([landingSection]);
    window.scrollTo(0, 0);
    setInTransition(false);
  }
});

infoSectionPreNavArea.addEventListener("transitionend", () => {
  const preNavOpening = checkIfPreNavOpening();
  const preNavClosing = checkIfPreNavClosing();
  if (preNavOpening) {
    setPreNavOpening(false);
    setPreNavOpen(true);
  } else if (preNavClosing) {
    setPreNavClosing(false);
    setPreNavOpen(false);
    disableScroll(false);
  }
});

let options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.87,
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
