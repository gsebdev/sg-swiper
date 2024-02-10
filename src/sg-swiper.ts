import { SwipeSession } from "./interfaces/SwipeSession";
import { SwiperState } from "./interfaces/SwipeState";
import {
  NavigationElements,
  SwiperInterface,
  SwiperSlide,
} from "./interfaces/Swiper";
import { SwiperArgs } from "./interfaces/SwiperArgs";

export default class Swiper implements SwiperInterface {
  private _state: SwiperState = {
    currentIndex: 0,
    currentPosition: 0,
    initialized: false,
    swiperWidth: 0,
    slidesLoaded: true,
  };
  private _swipeSession: SwipeSession = {
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

  private _indexChangeCallback: ((index: number) => void) | null = null;

  private _navigationElements: NavigationElements = {};

  private _childrenSwipers: SwiperInterface[] | null = null;
  private _slideClassName: string | null = null;
  private _swiperElement: HTMLElement | null = null;
  private _slidesWrapper: HTMLElement | null;
  private _breakpoint: number | null = null;
  private _auto: number | null = null;
  private _autoInterval: NodeJS.Timeout | undefined;
  private _slides: SwiperSlide[] = [];
  private _slideCount: number = 0;
  private _draggable: boolean = false;
  private _slideLoad: ((slide: HTMLElement) => Promise<void>) | null = null;
  private _slideClick: ((index: number, element: HTMLElement) => void) | null =
    null;
  private _eventListeners: [
    HTMLElement | null | Window,
    string,
    (e: Event) => void
  ][];
  private _activeSessionEventListeners: {
    mouse: [keyof DocumentEventMap, (e: MouseEvent | TouchEvent) => void][];
    touch: [keyof DocumentEventMap, (e: MouseEvent | TouchEvent) => void][];
  } = {
      mouse: [
        ["mousemove", this._handleMove.bind(this)],
        ["mouseup", this._handleRelease.bind(this)],
      ],
      touch: [
        ["touchmove", this._handleMove.bind(this)],
        ["touchend", this._handleRelease.bind(this)],
        ["touchcancel", this._handleRelease.bind(this)],
      ],
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
      this._breakpoint = args.breakpoint ?? null;
      this._slideLoad = args.slideLoad ?? null;
      this._slideClick = args.onSlideClick ?? null;
      this._state.slidesLoaded = args.slideLoad ? false : true;
      this._draggable = args.draggable ?? false;
    }

    // create the list of slides
    const slideCollection = this._slideClassName
      ? this._swiperElement.querySelectorAll("." + this._slideClassName)
      : this._swiperElement.children;
    if (slideCollection.length === 0) {
      console.error("Cannot initialize Swiper: no slides found.");
      return;
    }

    //extract the slides wrapper
    this._slidesWrapper = slideCollection[0].parentElement;

    //create the list of slides
    this._slides = (Array.from(slideCollection) as HTMLElement[]).map(
      (slide) => {
        const id = slide.id
          ? slide.id
          : (() => {
            const generatedId =
              "slide-" + Math.random().toString(36).substring(2, 15);
            slide.id = generatedId;
            return generatedId;
          })();

        return {
          id,
          element: slide,
          position: 0,
          width: 0,
          loaded: this._slideLoad && slide.dataset.loaded === "false" ? false : true,
        };
      }
    );

    //set the number of slides
    this._slideCount = this._slides.length;

    // add the event listeners
    this._eventListeners = [
      [this._swiperElement, "mouseover", this._handleHover.bind(this)],
      //[this._swiperElement, 'mouseleave', this._handleLeave.bind(this)],
      [window, "resize", this._getDimensions.bind(this)],
    ];

    // add the draggable event listeners
    if (this._draggable) {
      this._eventListeners.push(
        [this._swiperElement, "mousedown", this._handlePush.bind(this)],
        [this._swiperElement, "touchstart", this._handlePush.bind(this)]
      );
    }

    // start the swiper
    this.start(args?.slideStart);
  }

  /**
   * Start the slider at the specified index, if provided.
   *
   * @param {number} index - The index at which to start the slider
   */
  public start(index?: number) {
    if (
      !this._state.initialized &&
      this._swiperElement &&
      (!this._breakpoint || window.innerWidth < this._breakpoint)
    ) {
      // get the dimensions of elements to calculate properly the translations values 
      this._getDimensions();

      // add the event listeners
      this._eventListeners.forEach(([element, event, callback]) => {
        element?.addEventListener(event, callback, { passive: true });
      });

      // add the slide click event listeners to each slides
      this._slides.forEach(({ element }, index) => {
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

      // set the swiper initialized
      this._state.initialized = true;

      // set the starting index
      this._setIndex(index ?? 0);

      // set the auto slide interval if provided
      if (this._auto) {
        this._autoInterval = setInterval(() => {
          if (this._slides[this._state.currentIndex].loaded) {
            this._handleNextClick();
          }
        }, this._auto);
      }
    }
  }

  /**
   * A private function to handle hover behavior.
   */
  private _handleHover() {
    clearInterval(this._autoInterval);
  }
  /*
  private _handleLeave() {
        if(this._auto) {
                this._autoInterval = setInterval(() => {
                    if(this._slides[this._state.currentIndex].loaded) {
                        this._handleNextClick();
                    }
                }, this._auto);
            }
    }
  */
  /**
  * Handles the click event for the previous button.
  */
  private _handlePrevClick() {
    const newIndex =
      this._state.currentIndex - 1 < 0
        ? this._slideCount - 1
        : this._state.currentIndex - 1;
    this._setIndex(newIndex);
  }
  /**
   * Handles the click event for navigating to the next item.
   */
  private _handleNextClick() {
    const newIndex =
      this._state.currentIndex + 1 > this._slideCount - 1
        ? 0
        : this._state.currentIndex + 1;
    this._setIndex(newIndex);
  }

  /**
   * Handle the click event on a slide element.
   *
   * @param {Event} e - the click event
   * @param {HTMLElement} element - the slide element
   * @param {number} index - the index of the slide
   */
  private _handleSlideClick(e: Event, element: HTMLElement, index: number) {
    e.preventDefault();
    if ((this._swipeSession.isClick || !this._draggable) && this._slideClick) {
      this._slideClick(index, element);
    }
  }

  /**
   * Update dimensions and positions of slides
   */
  private _getDimensions() {
    // Update swiper width
    this._state.swiperWidth = this._swiperElement?.offsetWidth ?? 0;

    // Update slides dimensions and positions
    this._slides = this._slides.map((slide) => ({
      ...slide,
      width: slide.element.offsetWidth,
      position: slide.element.offsetLeft,
    }));

    // Translate to current slide if initialized
    if (this._state.initialized && this._slides[this._state.currentIndex]) {
      this._translate(
        (this._state.swiperWidth - this._slides[this._state.currentIndex].width) / 2 -
        this._slides[this._state.currentIndex].position
      );
    }
  }

  /**
   * Stops all event listeners and resets the state of the component.
   */
  public stop() {

    // Remove all event listeners
    this._eventListeners.forEach(([element, event, callback]) => {
      element?.removeEventListener(event, callback);
    });

    // Remove slides click event listeners
    this._slides.forEach(({ element }, index) => {
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
  private _translate(value: number, duration: number | null = null) {
    if (this._slidesWrapper) {
      this._slidesWrapper.style.transform = `translate3d(${value}px, 0, 0)`;
      if (duration)
        this._slidesWrapper.style.transition = `${duration}ms cubic-bezier(.08,.5,.2,1) transform`;
    }

    this._state.currentPosition = value;
  }

  /**
   * Handles the push event triggered by a mouse click or touch on the swiper element.
   *
   * @param {MouseEvent | TouchEvent} e - The event object.
   * @return {void} 
   */
  private _handlePush(e: MouseEvent | TouchEvent) {
    // get focus and remose text selection in window when starting to interact with the swiper
    this._swiperElement?.focus();
    window.getSelection()?.removeAllRanges();

    // start a new swipe session
    this._swipeSession = {
      active: true,
      type: e.type === "mousedown" ? "mouse" : "touch",
      startX:
        e.type === "mousedown"
          ? (e as MouseEvent).clientX
          : (e as TouchEvent).touches[0].clientX,
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
  private _handleRelease() {
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
   * @param {("release" | "push" | "move")} ev - The type of event to trigger
   */
  private _triggerEvent(ev: "release" | "push" | "move") {
    if (ev === "release") {
      this._setIndex(this._state.currentIndex);
      /*
      if(this._swipeSession.type === 'touch') {
              this._handleLeave();
      }
      */
    }

    if (ev === "move") {
      // calculate the new translate position and translate slider
      const newTranslate = this._state.currentPosition + this._swipeSession.lastEventDeltaX;
      this._translate(newTranslate);
      // calculate the new index based on slider position
      const newIndex = this._getIndexByPosition(-newTranslate);
      // set the new index
      if (newIndex > -1) this._setIndex(newIndex, false);
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
   *
   * @param {MouseEvent | TouchEvent} e - The mouse or touch event
   * @return {void} 
   */
  private _handleMove(e: MouseEvent | TouchEvent) {
    if (!this._swipeSession.active) return;
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
  private _setIndex(index: number, translate: boolean = true) {

    //Slides need to be lazy loaded
    if (!this._state.slidesLoaded && this._slideLoad) {
      this._slideLoad(this._slides[index]?.element)
        .then(() => {
          this._slides[index].loaded = true;
          this._checkIfAllLoaded();
          if (!this._state.slidesLoaded && this._slides[index + 1])
            (this._slideLoad as any)(this._slides[index + 1].element).then(
              () => {
                this._slides[index + 1].loaded = true;
                this._checkIfAllLoaded();
              }
            );
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // if translate is needed then perform translation
    if (translate && this._slides[index]) this._translate(
      (this._state.swiperWidth - this._slides[index].width) / 2 -
      this._slides[index].position,
      500
    );

    // handle classnames
    this._slides[index]?.element.classList.add("is-active");
    this._swiperElement?.classList.remove("is-first", "is-last");
    if (index === 0) {
      this._swiperElement?.classList.add("is-first");
    } else if (index === this._slideCount - 1) {
      this._swiperElement?.classList.add("is-last");
    }

    if (index === this._state.currentIndex) return; // no change

    // remose active classname to old active slide
    this._slides[this._state.currentIndex].element.classList.remove(
      "is-active"
    );
    // update current index
    this._state.currentIndex = index;

    // call index change callback
    if (this._indexChangeCallback) this._indexChangeCallback(index);

    //if children swipers are connected perform index change to connected swipers
    if (this._childrenSwipers) {
      this._childrenSwipers.forEach((swiper) => {
        swiper.index = index;
      });
    }
  }

  /**
   * Retrieves the active index based on the given position.
   *
   * @param {number} translate - the position to search for
   * @return {number} the index of the slide
   */
  private _getIndexByPosition(translate: number) {
    return this._slides.findIndex(
      (slide) =>
        slide.position + slide.width / 2 > translate &&
        translate > slide.position - slide.width / 2
    );
  }

  /**
   * Check if all slides are loaded.
   */
  private _checkIfAllLoaded() {
    this._state.slidesLoaded = this._slides.every((slide) => slide.loaded);
  }

  get index() {
    return this._state.currentIndex;
  }

  set index(index) {
    this._setIndex(index);
  }

  /**
   * setter for slide click callback
   *
   * @param {function} callback - callback function to be invoked on slide click
   * @return {void} 
   */
  set slideClick(callback: (index: number, element: HTMLElement) => void) {
    this._slideClick = callback;
  }
}