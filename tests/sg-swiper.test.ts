/**
 * @jest-environment jsdom
 */

import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import Swiper from "../src/sg-swiper";
import createSwiperElements, { customizeHTMLElement } from "./__mocks__/createSwiperElements";
import addResizeObserver from "./__mocks__/ResizeObserver";

describe("Swiper draggable with child", () => {
  addResizeObserver();
  customizeHTMLElement();
  // create a new swiper
  const { args, swiper2, swiperContainer, slidesWrapper, next, prev } =
    createSwiperElements(500, 150, 10);
  let swiperObjectChild = new Swiper(swiper2, { ...args });
  let swiperObjectParent = new Swiper(swiperContainer, {
    ...args,
    linkedSwipers: [swiperObjectChild],
    navigation: { prev: [prev], next: [next] },
  });
  swiperObjectParent._getDimensions();
  swiperObjectParent._getDimensions();
  //spy on _handlePush, _handleRelease and _handleMove
  const pushListener = jest.spyOn(swiperObjectParent, "_handlePush");

  it("should be defined", () => {
    expect(Swiper).toBeDefined();
  });

  it("should be an instance of Swiper", () => {
    expect(swiperObjectParent).toBeInstanceOf(Swiper);
    expect(swiperObjectChild).toBeInstanceOf(Swiper);
  });
  it("should count 10 slides", () => {
    expect(Array.from(swiperObjectParent._slides.values()).length).toBe(10);
    expect(swiperObjectParent._slideCount).toBe(10);
  });
  it("should have a slide wrapper", () => {
    expect(swiperObjectParent._slidesWrapper).toBeTruthy();
    expect(swiperObjectParent._slidesWrapper).toBe(slidesWrapper);
  });
  it("should be draggable", () => {
    expect(swiperObjectParent._draggable).toBeTruthy();
  });
  it("should be initialized", () => {
    expect(swiperObjectParent._state.initialized).toBeTruthy();
  });
  it("state should be well populated", () => {
    expect(swiperObjectParent._state.swiperWidth).toBe(500);
    expect(swiperObjectParent._state.currentIndex).toBe(0);
    expect(swiperObjectParent._state.currentPosition).toBe(175);
    expect(swiperObjectParent._slides.allSlidesLoaded).toBe(true);
  });
  it("should have slides well populated", () => {
    expect(Array.from(swiperObjectParent._slides.entries()).length).toBe(10);
    expect(Array.from(swiperObjectParent._slides.values())[0].element).toBe(
      slidesWrapper.children[0]
    );
    expect(Array.from(swiperObjectParent._slides.values())[9].element).toBe(
      slidesWrapper.children[9]
    );
    expect(Array.from(swiperObjectParent._slides.values())[0].width).toBe(150);
    expect(Array.from(swiperObjectParent._slides.values())[9].width).toBe(150);
    expect(Array.from(swiperObjectParent._slides.values())[0].position).toBe(0);
    expect(Array.from(swiperObjectParent._slides.values())[9].position).toBe(1350);
    expect(Array.from(swiperObjectParent._slides.values())[0].loaded).toBeTruthy();
    expect(Array.from(swiperObjectParent._slides.values())[9].loaded).toBeTruthy();
  });
  const user = userEvent.setup();
  it("should navigate with buttons", async () => {
    await user.click(next);
    expect(swiperObjectParent._state.currentIndex).toBe(1); // push
    await user.click(next);
    expect(swiperObjectParent._state.currentIndex).toBe(2); // push
    await user.click(prev);
    expect(swiperObjectParent._state.currentIndex).toBe(1); // push
    jest.resetAllMocks();
  });

  it("should handle push events and remove listeners when session ends", () => {
    const removeListeners = jest.spyOn(document, "removeEventListener");
    const addEventListener = jest.spyOn(document, "addEventListener");
    // mouse events
    fireEvent.mouseDown(swiperContainer); // push
    expect(swiperObjectParent._swipeSession.active).toBe(true);
    expect(swiperObjectParent._swipeSession.type).toBe("mouse");
    //check if after a mousedown, mousemove and mouseup listener are active
    expect(addEventListener).toHaveBeenCalledWith(
      "mousemove",
      swiperObjectParent._handleMove,
      expect.any(Object)
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "mouseup",
      swiperObjectParent._handleRelease,
      expect.any(Object)
    );

    fireEvent.mouseUp(document); // release
    expect(swiperObjectParent._swipeSession.active).toBe(false);
    expect(removeListeners).toHaveBeenCalledWith(
      "mousemove",
      swiperObjectParent._handleMove
    );
    expect(removeListeners).toHaveBeenCalledWith(
      "mouseup",
      swiperObjectParent._handleRelease
    );

    //touch events
    fireEvent.touchStart(swiperContainer); // push

    expect(swiperObjectParent._swipeSession.type).toBe("touch");
    expect(swiperObjectParent._swipeSession.active).toBe(true);
    //check if after a mousedown, mousemove and mouseup listener are active
    expect(addEventListener).toHaveBeenCalledWith(
      "touchend",
      swiperObjectParent._handleRelease,
      expect.any(Object)
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "touchmove",
      swiperObjectParent._handleMove,
      expect.any(Object)
    );
    expect(addEventListener).toHaveBeenCalledWith(
      "touchcancel",
      swiperObjectParent._handleRelease,
      expect.any(Object)
    );

    fireEvent.touchCancel(document); // release
    expect(swiperObjectParent._swipeSession.active).toBe(false);
    expect(removeListeners).toHaveBeenCalledWith(
      "touchend",
      swiperObjectParent._handleRelease
    );
    expect(removeListeners).toHaveBeenCalledWith(
      "touchmove",
      swiperObjectParent._handleMove
    );
    expect(removeListeners).toHaveBeenCalledWith(
      "touchcancel",
      swiperObjectParent._handleRelease
    );
    //retore document.addEventListener mock
    jest.restoreAllMocks();
  });

  it("should translate when mousemove and detect active index", () => {
    jest.resetAllMocks();
    swiperObjectParent._setIndex(0, true);

    const triggerFunc = jest.spyOn(swiperObjectParent, "_triggerEvent");
    const getIndexFunc = jest.spyOn(swiperObjectParent, "_getIndexByPosition");
    const translateFunc = jest.spyOn(swiperObjectParent, "_translate");

    //activate a drag session
    swiperObjectParent._swipeSession = {
      active: true,
      type: "mouse",
      startX: 0,
      startTime: 0,
      velocity: 0,
      isClick: false,
      deltaX: 0,
      lastEvent: { clientX: 0, timeStamp: 0 } as MouseEvent,
      lastEventDeltaX: 0,
      lastEventVelocity: 0,
      direction: 0,
    };
    expect(swiperObjectParent._state.currentPosition).toBe(175);
    //move the mouse
    swiperObjectParent._handleMove({
      clientX: -350,
      timeStamp: 200,
    } as MouseEvent);

    expect(swiperObjectParent._swipeSession.lastEventDeltaX).toBe(-350);
    expect(triggerFunc).toHaveBeenCalledWith("move");
    expect(translateFunc).toHaveBeenCalledTimes(1);
    expect(swiperObjectParent._state.currentPosition).toBe(-175);
    expect(slidesWrapper.style.transform).toBe("translate3d(-175px, 0, 0)");
    expect(getIndexFunc).toHaveBeenCalledTimes(1);
    console.log(swiperObjectParent._limitToEdges)
    expect(getIndexFunc).toHaveReturnedWith(2);

    expect(swiperObjectParent._state.currentIndex).toBe(2);

    //move a delta of 150px
    swiperObjectParent._handleMove({
      clientX: -200,
      timeStamp: 200,
    } as MouseEvent);
    expect(swiperObjectParent._swipeSession.lastEventDeltaX).toBe(150);
    expect(triggerFunc).toHaveBeenNthCalledWith(1, "move");
    expect(translateFunc).toHaveBeenCalledTimes(2);
    expect(swiperObjectParent._state.currentPosition).toBe(-25);
    expect(slidesWrapper.style.transform).toBe("translate3d(-25px, 0, 0)");
    expect(getIndexFunc).toHaveBeenCalledTimes(2);
    expect(swiperObjectParent._state.currentIndex).toBe(1);
    jest.restoreAllMocks();
  });
  it("should remove initialized state and all listeners when stop is called", () => {
    document.removeEventListener = jest
      .fn()
      .mockImplementation((ev, callback) => {
        return true;
      });
    jest.restoreAllMocks();
  });

  it("should translate when touchmove and detect active index", () => {
    swiperObjectParent._setIndex(0, true);
    const triggerFunc = jest.spyOn(swiperObjectParent, "_triggerEvent");
    const getIndexFunc = jest.spyOn(swiperObjectParent, "_getIndexByPosition");
    const translateFunc = jest.spyOn(swiperObjectParent, "_translate");

    //activate a drag session
    swiperObjectParent._swipeSession = {
      active: true,
      type: "touch",
      startX: 0,
      startTime: 0,
      velocity: 0,
      isClick: false,
      deltaX: 0,
      // @ts-ignore
      lastEvent: { touches: { 0: { clientX: 0 } }, timeStamp: 0 } as TouchEvent,
      lastEventDeltaX: 0,
      lastEventVelocity: 0,
      direction: 0,
    };
    expect(swiperObjectParent._state.currentPosition).toBe(175);
    //move
    //@ts-ignore
    swiperObjectParent._handleMove({
      touches: { 0: { clientX: -350 } },
      timeStamp: 200,
    } as TouchEvent);

    expect(swiperObjectParent._swipeSession.lastEventDeltaX).toBe(-350);
    expect(triggerFunc).toHaveBeenNthCalledWith(1, "move");
    expect(translateFunc).toHaveBeenCalledTimes(1);
    expect(swiperObjectParent._state.currentPosition).toBe(-175);
    expect(slidesWrapper.style.transform).toBe("translate3d(-175px, 0, 0)");
    expect(getIndexFunc).toHaveBeenCalledTimes(1);
    expect(swiperObjectParent._state.currentIndex).toBe(2);

    //move a delta of 150px
    //@ts-ignore
    swiperObjectParent._handleMove({
      touches: { 0: { clientX: -200 } },
      timeStamp: 200,
    } as TouchEvent);

    expect(swiperObjectParent._swipeSession.lastEventDeltaX).toBe(150);
    expect(triggerFunc).toHaveBeenNthCalledWith(1, "move");
    expect(translateFunc).toHaveBeenCalledTimes(2);
    expect(swiperObjectParent._state.currentPosition).toBe(-25);
    expect(slidesWrapper.style.transform).toBe("translate3d(-25px, 0, 0)");
    expect(getIndexFunc).toHaveBeenCalledTimes(2);
    expect(swiperObjectParent._state.currentIndex).toBe(1);
  });
  it("should remove initialized state and all listeners when stop is called", () => {
    jest.restoreAllMocks();
    pushListener.mockImplementation(() => { });
    const placeholderCallback = jest.fn();
    document.removeEventListener = jest
      .fn()
      .mockImplementation((ev, callback) => {
        placeholderCallback(ev, callback);
      });
    window.removeEventListener = jest
      .fn()
      .mockImplementation((ev, callback) => {
        placeholderCallback(ev, callback);
      });
    Object.defineProperty(swiperContainer, "removeEventListener", {
      value: jest.fn((ev, callback) => {
        placeholderCallback(ev, callback);
      }),
    });
    slidesWrapper.childNodes.forEach((slide) => {
      Object.defineProperty(slide, "removeEventListener", {
        value: jest.fn((ev, callback) => {
          placeholderCallback(ev, callback);
        }),
      });
    });
    Object.defineProperty(next, "removeEventListener", {
      value: jest.fn((ev, callback) => {
        placeholderCallback(ev, callback);
      }),
    });
    Object.defineProperty(prev, "removeEventListener", {
      value: jest.fn((ev, callback) => {
        placeholderCallback(ev, callback);
      }),
    });

    swiperObjectParent.stop();
    expect(placeholderCallback).toHaveBeenCalled();
    expect(placeholderCallback).toHaveBeenCalledWith(
      "touchstart",
      expect.any(Function)
    );
    expect(placeholderCallback).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function)
    );
    expect(placeholderCallback).toHaveBeenCalledWith(
      "click",
      expect.any(Function)
    );
    swiperObjectParent.start();
    jest.restoreAllMocks();
  });
});



describe("Swiper with no element", () => {
  //@ts-ignore
  let swiper = new Swiper(null, {});

  it("should throw an error", () => {
    expect(swiper).toBeInstanceOf(Swiper);
    expect(swiper._state.initialized).toBeFalsy();
  });
});

describe("Swiper with no slides", () => {
  let swiper = new Swiper(document.createElement("div"), {});

  it("should throw an error", () => {
    expect(swiper).toBeInstanceOf(Swiper);
    expect(swiper._state.initialized).toBeFalsy();
    expect(swiper._slideCount).toBe(0);
  });
});

describe("Swiper with no arguments", () => {
  let swiperContainer = document.createElement("div");
  swiperContainer.style.width = "500px";
  swiperContainer.style.height = "500px";
  let slidesWrapper = document.createElement("div");
  slidesWrapper.style.display = "flex";
  slidesWrapper.style.flexWrap = "nowrap";
  slidesWrapper.style.height = "100%";
  slidesWrapper.style.overflow = "hidden";
  for (let i = 0; i < 10; i++) {
    const slide = document.createElement("div");
    slide.style.flex = "0 0 30%";
    slide.style.height = "100%";
    slide.classList.add("slide");
    slidesWrapper.appendChild(slide);
  }
  swiperContainer.appendChild(slidesWrapper);

  let swiper = new Swiper(swiperContainer, {});

  it("should be initialized", () => {
    expect(swiper).toBeInstanceOf(Swiper);
    expect(swiper._state.initialized).toBeTruthy();
    expect(swiper._slideCount).toBe(10);
  });
});

describe("Swiper not draggable", () => {
  jest.restoreAllMocks();
  const { args, swiperContainer, slidesWrapper, next, prev } =
    createSwiperElements(500, 150, 10);

  let swiperObject = new Swiper(swiperContainer, {
    slideLoad: () => Promise.resolve(),
    slideClassName: "slide",
    onSlideClick: jest.fn(() => { }),
    draggable: false,
  });
  const pushHandler = jest.spyOn(swiperObject, "_handlePush");
  it("should be marked as not draggable", () => {
    expect(swiperObject._draggable).toBe(false);
  });
  it("should not listen to mousedown events", () => {
    fireEvent.mouseDown(swiperContainer);
    fireEvent.touchStart(swiperContainer);
    expect(pushHandler).toHaveBeenCalledTimes(0);
  });
});
