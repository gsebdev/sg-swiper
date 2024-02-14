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



describe("Swiper with limit to edges for translate", () => {
    // create a new swiper
    const { args, swiper2, swiperContainer, slidesWrapper, next, prev } =
      createSwiperElements(500, 90, 10);
    let swiperObject = new Swiper(swiperContainer, {
      ...args,
      navigation: { prev: [prev], next: [next] },
      limitToEdges: true
    });

    it('should have a stick to edges state', () => {
        expect(swiperObject._limitToEdges).toBe(true);
    })

    it('should be at position 0', () => {
        expect(swiperObject._state.currentPosition).toBe(0);
        expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
    })
    it('it should snap to start edge', () => {
      swiperObject._setIndex(2)
      expect(swiperObject._state.currentIndex).toBe(2)
      expect(swiperObject._state.currentPosition).toBe(0);
      expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
        
    })
    it('should be able to translate', () => {
        swiperObject._setIndex(3);
        expect(slidesWrapper.style.transform).toBe("translate3d(-65px, 0, 0)");
        expect(swiperObject._state.currentIndex).toBe(3)
    })
    it('should snap to end edge', () => {
      swiperObject._setIndex(7);
        expect(slidesWrapper.style.transform).toBe("translate3d(-400px, 0, 0)");
        expect(swiperObject._state.currentIndex).toBe(7)
    });
    it('should snap to the good edge depending of the direction of dragging when both edges are in the snap range', () => {
        Object.defineProperty(swiperContainer, "offsetWidth", { value: 850, configurable: true });
        window.dispatchEvent(new Event("resize"));
        swiperObject._swipeSession.direction = -1;
        swiperObject._setIndex(5);
        expect(swiperObject._state.currentPosition).toBe(-50);
        expect(slidesWrapper.style.transform).toBe("translate3d(-50px, 0, 0)");
        swiperObject._swipeSession.direction = 1;
        swiperObject._setIndex(4);
        expect(swiperObject._state.currentPosition).toBe(0);
        expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
    })
  
});
  