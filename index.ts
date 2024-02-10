import Swiper from "./src/sg-swiper";

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".swiper-demo")) {
    const swiper = new Swiper(
      document.querySelector(".swiper-demo") as HTMLElement,
      {
        slideClassName: "swiper-slide",
        draggable: true,
        onSlideClick: (index) => {
          swiper.index = index;
        },
      }
    );
  }
});
