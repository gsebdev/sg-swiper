/**
 * @jest-environment jsdom
 */
import Swiper from "../src/sg-swiper";
import createSwiperElements, { customizeHTMLElement } from "./__mocks__/createSwiperElements";
import addResizeObserver from "./__mocks__/ResizeObserver";

describe("Swiper with limit to edges for translate", () => {
  addResizeObserver();
  customizeHTMLElement();
  // create a new swiper
  const { args, swiperContainer, slidesWrapper, next, prev } =
    createSwiperElements(500, 90, 10);
  let swiperObject = new Swiper(swiperContainer, {
    ...args,
    navigation: { prev: [prev], next: [next] },
    limitToEdges: true
  });
  swiperObject._updateDimensions();
  it('should have been initilized with good dimensions', () => {
    expect(swiperObject._state.swiperWidth).toEqual(500);
    expect(swiperObject._state.slidesScrollWidth).toEqual(900);
    expect(Array.from(swiperObject._slides.values())[0].width).toEqual(90);
  })
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
    expect(swiperObject._state.currentIndex).toBe(3);
    expect(slidesWrapper.style.transform).toBe("translate3d(-65px, 0, 0)");

  })
  it('should snap to end edge', () => {
    swiperObject._setIndex(7);
    expect(slidesWrapper.style.transform).toBe("translate3d(-400px, 0, 0)");
    expect(swiperObject._state.currentIndex).toBe(7)
  });
  it('should snap to the good edge depending of the direction of dragging when both edges are in the snap range', () => {
    //@ts-ignore
    swiperContainer.offsetWidth = 850;
    //@ts-ignore
    swiperContainer.clientWidth = 850;

    window.dispatchEvent(new Event("resize"));
    swiperObject._setIndex(5);

    expect(swiperObject._state.currentPosition).toBe(-50);
    expect(slidesWrapper.style.transform).toBe("translate3d(-50px, 0, 0)");
    swiperObject._setIndex(4);
    expect(swiperObject._state.currentPosition).toBe(0);
    expect(slidesWrapper.style.transform).toBe("translate3d(0px, 0, 0)");
  })

});
