import Swiper from "./src/sg-swiper";
let activeSwipers: Swiper[] = [];
const initSwipers = () => {
  const limitToEdges = (
    document.querySelector("#limit-edges") as HTMLInputElement
  )?.checked;
  const auto = (document.querySelector("#auto") as HTMLInputElement)?.checked;
  const draggable = (document.querySelector("#draggable") as HTMLInputElement)
    ?.checked;
  const navigation = (document.querySelector("#navigation") as HTMLInputElement)
    ?.checked;
  const linkedswiper = (
    document.querySelector("#linked-swiper") as HTMLInputElement
  )?.checked;

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
        draggable: draggable,
        limitToEdges: limitToEdges,
      }
    );

      document.querySelectorAll(".swiper-nav").forEach((el) => {
        if(navigation) {
          (el as HTMLElement).style.display = "";
        } else {
           (el as HTMLElement).style.display = "none";
        }
       
      })

    const swiper = new Swiper(
      document.querySelector(".swiper-demo") as HTMLElement,
      {
        slideClassName: "swiper-slide",
        draggable: draggable,
        onSlideClick: (index) => {
          swiper.index = index;
          console.log("slide click : " + index);
        },
        navigation: navigation
          ? {
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
            }
          : undefined,
        slideStart: 0,
        auto: auto ? 1500 : undefined,
        onSlideChange: handleChangeSlide,
        slideLoad: slideLoad,
        linkedSwipers: linkedswiper ? [thumnailSwiper] : undefined,
        limitToEdges: limitToEdges,
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
    return [swiper, thumnailSwiper];
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const checkboxes = document.querySelectorAll("input[type=checkbox]");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      activeSwipers.forEach((swiper) => {
        swiper.stop();
      });
      const swipers = initSwipers();
      activeSwipers = swipers ? swipers : [];
    });
  });
  const swipers = initSwipers();
  activeSwipers = swipers ? swipers : [];
});
