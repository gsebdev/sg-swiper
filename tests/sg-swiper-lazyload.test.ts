/**
 * @jest-environment jsdom
 */
import Swiper from "../src/sg-swiper";
import createSwiperElements, { customizeHTMLElement } from "./__mocks__/createSwiperElements";
import addResizeObserver from "./__mocks__/ResizeObserver";

describe("Swiper with lazyload", () => {
    addResizeObserver();
    customizeHTMLElement();

    // create and init the new swiper
    const { swiperContainer, slidesWrapper } = createSwiperElements(500, 150, 10);
    Array.from(slidesWrapper.children).forEach((slide) =>
        slide.setAttribute("data-loaded", "false")
    );

    let swiperObject = new Swiper(swiperContainer, {
        slideLoad: () => Promise.resolve(),
        slideClassName: "slide",
    });

    swiperObject._updateDimensions();
    const slides = Array.from(swiperObject._slides.values());
    
    /// tests start

    it("should be initialized", () => {
        expect(swiperObject._state.initialized).toBe(true);
        expect(swiperObject._state.currentIndex).toBe(0);
        expect(swiperObject._slides.allSlidesLoaded).toBe(false);
    });
    it("should have loaded visible slides at beginning", () => {
        // must load 3 adjacent slides in this case
        expect(slides[0].loaded).toBe(true);
        expect(slides[1].loaded).toBe(true);
        expect(slides[2].loaded).toBe(true);
        expect(slides[3].loaded).toBe(true);

        expect(slides.slice(4).every((slide) => !slide.loaded)).toBe(true);
        expect(swiperObject._slides.allSlidesLoaded).toBe(false);
    });

    it("should load 4, 5, 6, 7, 8 when index is set to 5", async () => {
        swiperObject.index = 5;
        await new Promise((resolve) => { setTimeout( resolve, 10)});
        // must laod 3 adjacent slides before and after in this case
        expect(swiperObject._state.currentIndex).toBe(5);
        expect(swiperObject._slides.allSlidesLoaded).toBe(false);
        expect(swiperObject._state.currentPosition).toBe(-575);

        expect(slides.slice(0, 9).every((slide) => slide.loaded)).toBe(true);
        expect(slides[9].loaded).toBe(false);
    });
    it("should be all loaded when every slides have been set", async () => {
        swiperObject.index = 9;
        await new Promise((resolve) => { setTimeout( resolve, 10)});
        expect(swiperObject._slides.allSlidesLoaded).toBe(true);
        expect(swiperObject._state.currentIndex).toBe(9);
        expect(slides[9].loaded).toBe(true);
    });
});