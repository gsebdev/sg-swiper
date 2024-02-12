import Swiper from "./src/sg-swiper";

document.addEventListener("DOMContentLoaded", () => {
  const indexInfoElement = document.querySelector(".active-slide-info");
  const handleChangeSlide = (index) => {
    if (indexInfoElement) indexInfoElement.textContent = index;
  };
  if (document.querySelector(".swiper-demo")) {
    const thumnailSwiper = new Swiper(
      document.querySelector(".thumbs-swiper") as HTMLElement,
      {
        onSlideClick: changeSlide,
        slideLoad: slideLoad,
        draggable: true
      }
    );
    const swiper = new Swiper(
      document.querySelector(".swiper-demo") as HTMLElement,
      {
        slideClassName: "swiper-slide",
        draggable: true,
        onSlideClick: (index) => {
          swiper.index = index;
          console.log("slide click : " + index);
        },
        navigation: {
          next: document.querySelector(".swiper-nav[data-direction=next]")
            ? [
                document.querySelector(
                  ".swiper-nav[data-direction=next]"
                ) as HTMLElement,
              ]
            : undefined,
          prev: document.querySelector(".swiper-nav[data-direction=prev]")
            ? [
                document.querySelector(
                  ".swiper-nav[data-direction=prev]"
                ) as HTMLElement,
              ]
            : undefined,
        },
        slideStart: 3,
        auto: 4000,
        onSlideChange: handleChangeSlide,
        slideLoad: slideLoad,
        linkedSwipers: [thumnailSwiper],
      }
    );

    function changeSlide(index) {
      swiper.index = index;
    }

    function slideLoad(slide: HTMLElement) {
      return new Promise<void>((resolve, reject) => {
        if (slide.dataset.loaded === "true") {
          resolve();
        }
        const img = slide.querySelector("img");
        if (img) {
          if (img.src && img.src.length > 0) {
            resolve();
          }
          img.src = img.dataset.src ?? "";
          img.removeAttribute("data-loaded");
          img.addEventListener("load", () => {
            slide.dataset.loaded = "true";
            resolve();
          });
        } else {
          reject();
        }
      });
    }
  }
});
