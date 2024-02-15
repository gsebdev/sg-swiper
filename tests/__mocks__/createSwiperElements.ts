import { SwiperArgs } from "../../src/interfaces/SwiperArgs";

export const customizeHTMLElement = () => {
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
        value: 0,
        configurable: true,
        writable: true
    });

    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        value: 0,
        configurable: true,
        writable: true
    });
    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
        value: 0,
        configurable: true,
        writable: true
    });
}


const createSwiperElements = (containerWidth, slideWidth, quantity) => {

    let swiperContainer = document.createElement("div");
    //@ts-ignore
    swiperContainer.offsetWidth = containerWidth;
    //@ts-ignore
    swiperContainer.clientWidth = containerWidth;
    let slidesWrapper = document.createElement("div");
    for (let i = 0; i < quantity; i++) {
        const slide = document.createElement("div");
        //@ts-ignore
        slide.offsetLeft = slideWidth * i ;
        //@ts-ignore
        slide.offsetWidth = slideWidth ;
        //@ts-ignore
        slide.clientWidth = slideWidth ;
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

export default createSwiperElements