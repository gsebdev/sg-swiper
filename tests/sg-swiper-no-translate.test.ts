/**
 * @jest-environment jsdom
 */

import { SwiperArgs } from "../src/interfaces/SwiperArgs";
import Swiper from "../src/sg-swiper";

const createSwiperElements = (containerWidth, slideWidth, quantity) => {
  let swiperContainer = document.createElement("div");
  Object.defineProperty(swiperContainer, "offsetWidth", { value: containerWidth, configurable: true });
  let slidesWrapper = document.createElement("div");
  for (let i = 0; i < quantity; i++) {
    const slide = document.createElement("div");
    Object.defineProperty(slide, "offsetWidth", { value: slideWidth });
    Object.defineProperty(slide, "offsetLeft", { value: i * slideWidth });
    slide.classList.add("slide");
    slidesWrapper.appendChild(slide);
  }
  swiperContainer.appendChild(slidesWrapper);
  let prev = document.createElement("div");
  let next = document.createElement("div");
  let args: SwiperArgs = {
    onSlideChange: jest.fn(),
    slideClassName: "slide",
    onSlideClick: jest.fn(),
    draggable: true,
  };

  swiperContainer.prepend(prev, next);
  let swiper2 = swiperContainer.cloneNode(true) as HTMLElement;

  return { args, swiper2, swiperContainer, slidesWrapper, next, prev };
};



describe("Swiper with container bigger than wrapper", () => {
    // create a new swiper
    const { args, swiper2, swiperContainer, slidesWrapper, next, prev } =
      createSwiperElements(500, 90, 5);
    let swiperObject = new Swiper(swiperContainer, {
      ...args,
      navigation: { prev: [prev], next: [next] },
    });

    it('should have a no-translate state', () => {
        expect(swiperObject._state.noTranslate).toBe(true);
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
        expect(swiperObject._state.currentIndex).toBe(3)
    })
    it('should prevent translating after mouse move', () => {
        swiperObject._swipeSession.active = true;
        swiperObject._swipeSession.lastEvent = {clientX: 0, timeStamp: 0} as MouseEvent
        swiperObject._swipeSession.startX = 0
        swiperObject._handleMove({clientX : -30, timeStamp: 300} as MouseEvent)
        expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
        expect(swiperObject._state.currentIndex).toBe(3)
    })
    it('should remove the no translate state after window resize and wrapper bigger than container', () => {
        Object.defineProperty(swiperContainer, "offsetWidth", { value: 400, configurable: true });
        window.dispatchEvent(new Event("resize"));
        expect(swiperObject._state.noTranslate).toBe(false)
        expect(swiperContainer.classList.contains('no-translate')).toBe(false)
        expect(swiperObject._state.currentIndex).toBe(3)
        expect(slidesWrapper.style.transform).toBe("translate3d(-115px, 0, 0)");
    })

  
});
describe("Swiper with container smaller than wrapper", () => {
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
it('should add a no translate state when resizing and wrapper getting smaller than container', () => {
    swiperObject._setIndex(2);
    expect(slidesWrapper.style.transform).toBe("translate3d(-250px, 0, 0)");
    Object.defineProperty(swiperContainer, "offsetWidth", { value: 1200, configurable: true });
    window.dispatchEvent(new Event("resize"));
    expect(swiperObject._state.noTranslate).toBe(true)
    expect(swiperContainer.classList.contains('no-translate')).toBe(true)
    expect(swiperObject._state.currentIndex).toBe(2)
    expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
})
})
  