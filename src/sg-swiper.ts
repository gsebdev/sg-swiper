import SlideMap from "./SlideMap";
import { SwipeSession } from "./interfaces/SwipeSession";
import { SwiperState } from "./interfaces/SwipeState";
import {
  NavigationElements,
  SwiperInterface,
} from "./interfaces/Swiper";
import { SwiperArgs } from "./interfaces/SwiperArgs";

export default class Swiper implements SwiperInterface {
  _state: SwiperState = {
    currentIndex: undefined,
    currentPosition: 0,
    initialized: false,
    swiperWidth: 0,
    slidesScrollWidth: 0,
    noTranslate: false
  };
  _swipeSession: SwipeSession = {
    active: false,
    type: "mouse",
    startX: 0,
    startTime: 0,
    velocity: 0,
    isClick: false,
    deltaX: 0,
    lastEvent: null,
    lastEventDeltaX: 0,
    lastEventVelocity: 0,
    direction: 0,
  };

  _indexChangeCallback: ((index: number) => void) | null = null;
  _resizeObserver: ResizeObserver | null = null;
  _resizeTimeout: NodeJS.Timeout | undefined;

  _navigationElements: NavigationElements = {};

  _childrenSwipers: SwiperInterface[] | null = null;
  _slideClassName: string | null = null;
  _swiperElement: HTMLElement | null = null;
  _slidesWrapper: HTMLElement | null;
  _auto: number | null = null;
  _autoInterval: NodeJS.Timeout | undefined;
  _slides: SlideMap = new SlideMap();
  _slideCount: number = 0;
  _draggable: boolean = false;
  _limitToEdges: boolean = false;
  _slideLoad: ((slide: HTMLElement) => Promise<void>) | null = null;
  _slideClick: ((index: number, element: HTMLElement) => void) | null =
    null;
  _eventListeners: [
    HTMLElement | null | Window,
    string,
    (e: Event) => void,
    { capture?: boolean, passive?: boolean }?
  ][] = [];
  _activeSessionEventListeners: {
    mouse: [keyof DocumentEventMap, (e: MouseEvent | TouchEvent) => void][];
    touch: [keyof DocumentEventMap, (e: MouseEvent | TouchEvent) => void][];
  };

  /**
  * Constructor for the Swiper class.
  *
  * @param {HTMLElement} element - the HTML container element to initialize the Swiper
  * @param {SwiperArgs} args - optional arguments to configure the Swiper
  */
  constructor(element: HTMLElement, args: SwiperArgs | null = null) {
    // check if element is provided and extract it
    if (!element) {
      console.error("Cannot initialize Swiper: no element provided.");
      return;
    }
    this._swiperElement = element;

    // extract the arguments
    if (args) {
      this._indexChangeCallback = args.onSlideChange ?? null;
      this._auto = args.auto ?? null;
      this._slideClassName = args.slideClassName ?? null;
      this._navigationElements = args.navigation ?? {};
      this._childrenSwipers = args.linkedSwipers ?? null;
      this._slideLoad = args.slideLoad ?? null;
      this._slideClick = args.onSlideClick ?? null;
      this._draggable = args.draggable ?? false;
      this._limitToEdges = args.limitToEdges ?? false;
    }

    // create the list of slides
    const slideCollection = this._slideClassName
      ? this._swiperElement.querySelectorAll("." + this._slideClassName)
      : this._swiperElement.firstElementChild?.children ?? [];
    if (slideCollection.length === 0) {
      console.error("Cannot initialize Swiper: no slides found.");
      return;
    }

    //extract the slides wrapper
    this._slidesWrapper = slideCollection[0].parentElement;

    //create the list of slides
    (Array.from(slideCollection) as HTMLElement[]).forEach((slide, index) => {
      const id = slide.id
        ? slide.id
        : (() => {
          const generatedId =
            "slide-" + Math.random().toString(36).substring(2, 15);
          slide.id = generatedId;
          return generatedId;
        })();

      this._slides.set(id, {
        index,
        element: slide,
        position: 0,
        width: 0,
        loaded: this._slideLoad ? false : true,
      });
    });

    //set the number of slides
    this._slideCount = slideCollection.length;

    // set the eventListeners when a swiper session is activated
    this._activeSessionEventListeners = {
      mouse: [
        ["mousemove", this._handleMove],
        ["mouseup", this._handleRelease],
      ],
      touch: [
        ["touchmove", this._handleMove],
        ["touchend", this._handleRelease],
        ["touchcancel", this._handleRelease],
      ],
    };
    // add the auto event listeners
    if(this._auto && this._auto > 1000 ) {
      this._eventListeners.push(
        [this._swiperElement, "mouseover", this._handleHover.bind(this), { passive: true }],
        [this._swiperElement, "mouseout", this._handleLeave.bind(this), { passive: true }]
      );
      this._childrenSwipers?.forEach((swiper) => {
        if(!swiper.container) return;
        this._eventListeners.push(
          [swiper.container, "mouseover", this._handleHover.bind(this), { passive: true }],
          [swiper.container, "mouseout", this._handleLeave.bind(this), { passive: true }]
        );
      });
    }

    // add the draggable event listeners
    if (this._draggable) {
      this._eventListeners.push(
        //@ts-ignore
        [this._swiperElement, "mousedown", this._handlePush, { passive: true }],
        [this._swiperElement, "touchstart", this._handlePush, { passive: true }],
        [this._swiperElement, "selectstart", this._preventDefault, { capture: true }],
        [this._swiperElement, "dragstart", this._preventDefault, { capture: true }]
      );
    }
    this._resizeObserver = new ResizeObserver(this._handleResize);
    // start the swiper
    this.start(args?.slideStart);
  }

  /**
   * Start the slider at the specified index, if provided.
   *
   * @param {number} index - The index at which to start the slider
   */
  start = (index?: number) => {
    if (!this._state.initialized && this._swiperElement) {

      // add the event listeners
      this._eventListeners.forEach(([element, event, callback, options]) => {
        element?.addEventListener(event, callback, options);
      });

      // add the slide click event listeners to each slides
      this._slides.forEach(({ element, index }) => {
        element.addEventListener("click", (e: Event) => {
          this._handleSlideClick(e, element, index);
        });
      });

      // add the navigation previous slide click event listeners
      if (this._navigationElements.prev)
        this._navigationElements.prev.forEach((el) => {
          el.addEventListener("click", this._handlePrevClick.bind(this));
        });

      // add the navigation next slide click event listeners
      if (this._navigationElements.next)
        this._navigationElements.next.forEach((el) => {
          el.addEventListener("click", this._handleNextClick.bind(this));
        });

      // add the resize observer
      this._resizeObserver?.observe(this._swiperElement);
      this._state.swiperWidth = this._swiperElement.clientWidth

      // set the swiper initialized
      this._state.initialized = true;
      this._setIndex(index ?? 0);

      // set the auto slide interval if provided
      if (this._auto && this._auto > 1000) {
        this._handleLeave();
      }
    }
  }

  /**
   * A function to handle hover behavior.
   */
  _handleHover = () => {
    clearInterval(this._autoInterval);

  }
  /**
   * A function to handle hover behavior.
   */
  _handleLeave = () => {
    if(!this._auto) return;
    
    clearInterval(this._autoInterval);
    
    this._autoInterval = setInterval(() => {
      const [, slide] = this._slides.getSlideByIndex(this._state?.currentIndex) ?? [];
      if (slide?.loaded) {
        this._handleNextClick();
      }
    }, this._auto);
  }

  /**
   * A function to prevent the default behavior of the event.
   *
   * @param {Event} e - the event
   */
  _preventDefault = (e: Event) => {
    e.preventDefault();
  }

  /**
  * Handles the click event for the previous button.
  */
  _handlePrevClick = () => {
    if (this._state.currentIndex !== undefined) {
      const newIndex =
        this._state.currentIndex - 1 < 0
          ? this._slideCount - 1
          : this._state.currentIndex - 1;
      this._setIndex(newIndex);
    }

  }
  /**
   * Handles the click event for navigating to the next item.
   */
  _handleNextClick = () => {
    if (this._state.currentIndex !== undefined) {
      const newIndex =
        this._state.currentIndex + 1 > this._slideCount - 1
          ? 0
          : this._state.currentIndex + 1;
      this._setIndex(newIndex);
    }
  }

  /**
   * Handle the click event on a slide element.
   *
   * @param {Event} e - the click event
   * @param {HTMLElement} element - the slide element
   * @param {number} index - the index of the slide
   */
  _handleSlideClick = (e: Event, element: HTMLElement, index: number) => {
    e.preventDefault();
    if ((this._swipeSession.isClick || !this._draggable) && this._slideClick) {
      this._slideClick(index, element);
    }
  }

  _handleResize = (entries: ResizeObserverEntry[]) => {
    clearTimeout(this._resizeTimeout);
    for (const entry of entries) {
      if (entry.target === this._swiperElement) {
        this._state.swiperWidth = entry.contentBoxSize[0].inlineSize;
      }
    }
    this._resizeTimeout = setTimeout(() => {
      this._setIndex(this._getIndexByPosition(this._state.currentPosition), 200);
    }, 80);
  }

  /**
   * Update dimensions and positions of slides
   */
  _updateDimensions = (): boolean => {
    const state = this._state;
    const swiper = this._swiperElement;

    this._slides.updateSlideDimensions();
    state.slidesScrollWidth = this._slides.getSlidesScrollWidth();

    // check translate ability
    if (state.slidesScrollWidth <= state.swiperWidth) {
      // stop translating
      this._translate(0);
      state.noTranslate = true;
      swiper?.classList.add('no-translate');
      return false;
    } else {
      state.noTranslate = false;
      swiper?.classList.remove('no-translate');
      return true
    }
  }

  /**
   * Stops all event listeners and resets the state of the component.
   */
  stop = () => {
    // Remove resize observer
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    // Remove all event listeners
    this._eventListeners.forEach(([element, event, callback, options]) => {
      element?.removeEventListener(event, callback, options);
    });

    // Remove slides click event listeners
    this._slides.forEach(({ element, index }) => {
      element.removeEventListener("click", (e: Event) => {
        this._handleSlideClick(e, element, index);
      });
    });

    // Remove navigation click event listeners
    if (this._navigationElements.prev)
      this._navigationElements.prev.forEach((el) => {
        el.removeEventListener("click", this._handlePrevClick.bind(this));
      });
    if (this._navigationElements.next)
      this._navigationElements.next.forEach((el) => {
        el.removeEventListener("click", this._handleNextClick.bind(this));
      });

    // Clear auto slide interval
    if (this._autoInterval) {
      clearInterval(this._autoInterval);
    }
    // Reset swiper state
    this._translate(0);
    this._state.initialized = false;
  }

  /**
   * Translates the slides wrapper by the specified value.
   *
   * @param {number} value - The value to translate by
   * @param {number | null} duration - The duration of the translation, defaults to null
   */
  _translate = (value: number, duration: number | null = null) => {
    // prevnet translating if no translate
    if (this._state.noTranslate) {
      if (this._state.currentPosition !== 0) {
        value = 0;
      } else {
        return;
      }
    }
    if (this._slidesWrapper) {
      this._slidesWrapper.style.transform = `translate3d(${value}px, 0, 0)`;
      if (duration) {
        this._slidesWrapper.style.transition = `${duration}ms cubic-bezier(.08,.5,.2,1) transform`;
      } else {
        this._slidesWrapper.style.transition = "none";
      }

    }
    this._state.currentPosition = value;
  }

  /**
   * Handles the push event triggered by a mouse click or touch on the swiper element.
   *
   */
  _handlePush = (e: MouseEvent | TouchEvent): void => {
    // get focus and remose text selection in window when starting to interact with the swiper
    this._swiperElement?.focus();
    window.getSelection()?.removeAllRanges();
    const clientX = (e as MouseEvent).clientX ?? (e as TouchEvent).touches[0]?.clientX ?? null
    // start a new swipe session
    this._swipeSession = {
      active: true,
      type: e.type === "mousedown" ? "mouse" : "touch",
      startX: clientX,
      startTime: e.timeStamp,
      velocity: 0,
      isClick: false,
      deltaX: 0,
      lastEvent: e,
      lastEventDeltaX: 0,
      lastEventVelocity: 0,
      direction: 0,
    };
    // add event listeners for the current swipe session (move and release)
    this._activeSessionEventListeners[this._swipeSession.type].forEach(
      ([event, callback]) => {
        document.addEventListener(event, callback as any, { passive: true });
      }
    );

    this._triggerEvent("push");
  }

  /**
   * Handles the release action triggered by a mouse up or touch end.
   *
   */
  _handleRelease = () => {

    // stop the current swipe session
    this._swipeSession.active = false;

    // remove event listeners for the current swipe session
    this._activeSessionEventListeners[this._swipeSession.type].forEach(
      ([event, callback]) => {
        document.removeEventListener(event, callback as any);
      }
    );
    // check if the swipe was a click
    if (
      this._swipeSession.deltaX < 5 &&
      (this._swipeSession.lastEvent as Event).timeStamp -
      this._swipeSession.startTime <
      200
    ) {
      this._swipeSession.isClick = true;
    }

    this._triggerEvent("release");
  }

  /**
   * Do an action based on the given event type.
   *
   * @param {("release" | "push" | "move")} ev - The type of event
   */
  _triggerEvent = (ev: "release" | "push" | "move") => {
    if (ev === "release") {
      this._setIndex(this._state?.currentIndex);
    }

    if (ev === "move") {
      if (this._state.noTranslate) return;

      // calculate the new translate position and translate slider
      const newTranslate = this._state.currentPosition + this._swipeSession.lastEventDeltaX;
      this._translate(newTranslate);
      // calculate the new index based on slider position
      const newIndex = this._getIndexByPosition(newTranslate);
      // set the new index
      if (newIndex !== this._state.currentIndex) this._setIndex(newIndex, false);
    }

    if (ev === "push") {
      // if the push was triggered by touch action, handle hover
      if (this._swipeSession.type === "touch") {
        this._handleHover();
      }
    }
  }

  /**
   * Handle the move event, updating swipe session data and triggering move to do related actions.
   */
  _handleMove = (e: MouseEvent | TouchEvent): void => {
    if (!this._swipeSession.active || this._state.noTranslate) return;
    const { type, startX, lastEvent } = this._swipeSession;

    // get the current mouse or touch position
    const clientX = type === "mouse"
      ? (e as MouseEvent).clientX
      : (e as TouchEvent).touches[0].clientX;
    const lastClientX = type === "mouse"
      ? (lastEvent as MouseEvent).clientX
      : (lastEvent as TouchEvent).touches[0].clientX;

    this._swipeSession.lastEvent = e;

    // calculate the delta and velocity
    this._swipeSession.deltaX = clientX - startX;
    this._swipeSession.velocity = this._swipeSession.deltaX / (e.timeStamp - this._swipeSession.startTime);
    this._swipeSession.lastEventDeltaX = clientX - lastClientX;

    this._swipeSession.lastEventVelocity = this._swipeSession.lastEventDeltaX === 0
      ? this._swipeSession.lastEventVelocity
      : this._swipeSession.lastEventDeltaX / (e.timeStamp - (lastEvent as MouseEvent | TouchEvent).timeStamp);
    this._swipeSession.direction = Math.sign(this._swipeSession.lastEventDeltaX) as -1 | 0 | 1;

    this._triggerEvent("move");
  }

  /**
   * Sets the index of the slider and optionally performs a translation.
   *
   * @param {number} index - The index to set.
   * @param {boolean} translate - Optional flag to perform translation. Defaults to true.
   */
  _setIndex = (index: number | null | undefined, translate: boolean | number = true): void => {

    const state = this._state;
    if (!state.initialized || index === undefined || index === null) return;

    const [, activeSlide] = this._slides.getSlideByIndex(index) ?? [];
    const [, lastActiveSlide] = this._slides.getSlideByIndex(state.currentIndex) ?? [];

    if (!activeSlide) {
      console.error('no active slide', index);
      return;
    }
    this._updateDimensions();
    //Slides need to be lazy loaded
    if (!this._slides.allSlidesLoaded && this._slideLoad) {
      // if no translate is set, that means slides are all visible, then load everything
      if (state.noTranslate) {
        this._slides.forEach((slide) => {
          (this._slideLoad as any)(slide.element).then(() => {
            slide.loaded = true;
            this._slides.allSlidesLoaded
          })
        })
      } else { /// swiper is translating, progressive load then        
        //load active slide
        if (activeSlide) {
          // calc adjacent visible slides
          const numOfAdjacentSlidesVisible = Math.max(0, Math.ceil(((state.swiperWidth / activeSlide.width) - 1)));
          // load active slide
          this._slideLoad(activeSlide.element)
            .then(() => {
              activeSlide.loaded = true;
              // load adjacent visible slides
              if (!this._slides.allSlidesLoaded && numOfAdjacentSlidesVisible <= this._slideCount) {
                for (let i = 1; i <= numOfAdjacentSlidesVisible; i++) {
                  const [, adjRightSlide] = this._slides.getSlideByIndex(index + i) ?? [];
                  const [, adjLeftSlide] = this._slides.getSlideByIndex(index - i) ?? [];
                  if (adjRightSlide && !adjRightSlide.loaded) {
                    (this._slideLoad as any)(adjRightSlide.element)
                      .then(() => {
                        adjRightSlide.loaded = true;
                      })
                  }
                  if (adjLeftSlide && !adjLeftSlide.loaded) {
                    (this._slideLoad as any)(adjLeftSlide.element)
                      .then(() => {
                        adjLeftSlide.loaded = true;
                      })
                  }
                }
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      }
    }

    // if translate is needed then perform translation
    if (translate !== false && !state.noTranslate) {

      let value = (state.swiperWidth - activeSlide.width) / 2 - activeSlide.position

      //if stick to edges
      if (this._limitToEdges) {
        const limit = state.swiperWidth - state.slidesScrollWidth;

        const [, firstSlide] = this._slides.getSlideByIndex(0) ?? [];
        const [, lastSlide] = this._slides.getSlideByIndex(this._slideCount - 1) ?? [];

        const stickToStart = firstSlide && (value > -1 * firstSlide.width / 2) ? true : false;
        const stickToEnd = lastSlide && (value < limit + (lastSlide.width / 2)) ? true : false;

        this._clearPositionClassNames();
        if (stickToEnd && stickToStart) {
          if (state.currentPosition < value) { // it goes towards the end
            value = limit;
            this._setLastClassNames();
          } else { // it goes towards the start
            value = 0;
            this._setFirstClassNames
          }
        } else if (stickToStart) {
          value = 0;
          this._setFirstClassNames();
        } else if (stickToEnd) {
          value = limit;
          this._setLastClassNames();
        } else {
          value = Math.min(0, Math.max(limit, value));
        }
      }
      this._translate(value, typeof translate === "number" ? translate : 500);
    }

    // handle classnames
    activeSlide.element.classList.add("is-active");
    if (index === 0) {
      this._setFirstClassNames();
    } else if (index === this._slideCount - 1) {
      this._setLastClassNames();
    }

    if (index === state.currentIndex) return; // no change

    // update current index
    state.currentIndex = state.noTranslate ? undefined :index;
    // remove active classname to old active slide
    lastActiveSlide?.element.classList.remove("is-active");
    // update current index

    // call index change callback
    if (this._indexChangeCallback) this._indexChangeCallback(index);

    //if children swipers are connected perform index change to connected swipers
    if (this._childrenSwipers) {
      this._childrenSwipers.forEach((swiper) => {
        swiper.index = index;
      });
    }
  }
  _clearPositionClassNames() {
    this._swiperElement?.classList.remove("is-first");
    this._swiperElement?.classList.remove("is-last");
  }
  _setFirstClassNames() {
    this._swiperElement?.classList.remove("is-last");
    this._swiperElement?.classList.add("is-first");
  }
  _setLastClassNames() {
    this._swiperElement?.classList.remove("is-first");
    this._swiperElement?.classList.add("is-last");
  }

  /**
   * Retrieves the active index based on the given position.
   */
  _getIndexByPosition = (translate: number): number | undefined => {
    const { swiperWidth, slidesScrollWidth, currentIndex } = this._state;
    const scrollAvailable = slidesScrollWidth - swiperWidth;
    const minScrollAvailableToDetectByMiddle = this._slides.first && this._slides.last ? (this._slides.first.width / 2 + this._slides.last.width / 2) : 0;
    if (!this._limitToEdges || scrollAvailable > minScrollAvailableToDetectByMiddle) { // detect the active index by the middle of the swiper element
      const offset = swiperWidth / 2
      for (const { position, width, index } of this._slides.values()) {
        const leftLimit = offset - position - width;
        const rightLimit = offset - position;
        if (translate <= rightLimit && translate >= leftLimit) {
          return index;
        }
      }
      return undefined;
    } else { // detect the index by the % of the total scroll available
      const positionRatio = (translate / -scrollAvailable);
      const index = Math.round(positionRatio * this._slideCount);
      return Math.max(0, Math.min(this._slideCount - 1, index));
    }
  }

  get index() {
    return this._state.currentIndex;
  }

  get container() {
    return this._swiperElement;
  }

  set index(index) {
    this._setIndex(index);
  }

  /**
   * setter for slide click callback
   */
  set slideClick(callback: (index: number, element: HTMLElement) => void) {
    this._slideClick = callback;
  }
}