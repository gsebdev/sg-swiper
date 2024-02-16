/**
 * @jest-environment jsdom
 */
import Swiper from "../src/sg-swiper";
import createSwiperElements, { customizeHTMLElement } from "./__mocks__/createSwiperElements";
import addResizeObserver from "./__mocks__/ResizeObserver";

describe("Swiper with container bigger than wrapper", () => {
  addResizeObserver();
  customizeHTMLElement();
  // create a new swiper
  const { args, swiper2, swiperContainer, slidesWrapper, next, prev } =
    createSwiperElements(500, 90, 5);
  let swiperObject = new Swiper(swiperContainer, {
    ...args,
    navigation: { prev: [prev], next: [next] },
  });
  swiperObject._updateDimensions();

  it('should have a no-translate state', () => {
    expect(swiperObject._state.noTranslate).toBe(true);
    expect(swiperObject._state.slidesScrollWidth).toEqual(450)
  })
  it('should be at position 0', () => {
    expect(swiperObject._state.currentPosition).toBe(0);
    expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
  })
  it('should have a class named .no-translate', () => {
    expect(swiperContainer.classList.contains('no-translate')).toBe(true)
  })
  it('should prevent translating after setIndex', () => {
    swiperObject._setIndex(3);
    expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
    expect(swiperObject._state.currentIndex).toBe(undefined)
  })
  it('should prevent translating after mouse move', () => {
    swiperObject._swipeSession.active = true;
    swiperObject._swipeSession.lastEvent = { clientX: 0, timeStamp: 0 } as MouseEvent
    swiperObject._swipeSession.startX = 0
    swiperObject._handleMove({ clientX: -30, timeStamp: 300 } as MouseEvent)
    expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
    expect(swiperObject._state.currentIndex).toBe(undefined)
  })

  it('should remove the no translate state after window resize and wrapper bigger than container', async () => {
    expect(swiperObject._state.swiperWidth).toEqual(500)
    // @ts-ignore
    swiperContainer.offsetWidth = 400;
    // @ts-ignore
    swiperContainer.clientWidth = 400;
    //@ts-ignore
    window.dispatchEvent(new Event("resize"));

    expect(swiperObject._swiperElement?.clientWidth).toEqual(400)
    expect(swiperObject._state.swiperWidth).toEqual(400)

    // wait for get dimensions wich is asynchrous
    await new Promise((resolve) => { setTimeout( resolve, 1000)});
    expect(swiperObject._state.noTranslate).toBe(false)
    expect(swiperContainer.classList.contains('no-translate')).toBe(false);
  })
});

describe("Swiper with container smaller than wrapper", () => {
  addResizeObserver();
  customizeHTMLElement();
  const { args, swiper2, swiperContainer, slidesWrapper, next, prev } =
    createSwiperElements(500, 200, 5);
  let swiperObject = new Swiper(swiperContainer, {
    ...args,
    navigation: { prev: [prev], next: [next] },
  });

  it('should not have a no-translate state', () => {
    expect(swiperObject._state.noTranslate).toBe(false);
  })
  it('should be at position 0', () => {
    expect(swiperObject._state.currentPosition).toBe(150);
    expect(slidesWrapper.style.transform).toBe("translate3d(150px, 0, 0)");
  })
  it('should not have a class named .no-translate', () => {
    expect(swiperContainer.classList.contains('no-translate')).toBe(false)
  })
  it('should add a no translate state when resizing and wrapper getting smaller than container', async () => {
    swiperObject._setIndex(2);
    expect(slidesWrapper.style.transform).toBe("translate3d(-250px, 0, 0)");
    // @ts-ignore
    swiperContainer.offsetWidth = 1200;
    // @ts-ignore
    swiperContainer.clientWidth = 1200;
    window.dispatchEvent(new Event("resize"));
    // wait for get dimensions wich is asynchrous
    await new Promise((resolve) => { setTimeout( resolve, 1000)});

    expect(swiperObject._state.noTranslate).toBe(true)
    expect(swiperContainer.classList.contains('no-translate')).toBe(true)
    expect(swiperObject._state.currentIndex).toBe(undefined)
    expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
  })
})
