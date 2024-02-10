import Swiper from "./src/sg-swiper";

document.addEventListener("DOMContentLoaded", () => {
    if(document.querySelector(".swiper-demo")) {
        new Swiper(document.querySelector(".swiper-demo") as HTMLElement, {
            slideClassName: "swiper-slide",
            draggable: true
        } );
    }
});