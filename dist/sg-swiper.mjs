// src/sg-swiper.ts
var Swiper = class {
  _state = {
    currentIndex: 0,
    currentPosition: 0,
    initialized: false,
    swiperWidth: 0,
    slidesWrapperWidth: 0,
    slidesLoaded: true,
    fixedTranslate: false
  };
  _swipeSession = {
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
    direction: 0
  };
  _indexChangeCallback = null;
  _navigationElements = {};
  _childrenSwipers = null;
  _slideClassName = null;
  _swiperElement = null;
  _slidesWrapper;
  _auto = null;
  _autoInterval;
  _slides = [];
  _slideCount = 0;
  _draggable = false;
  _limitToEdges = false;
  _slideLoad = null;
  _slideClick = null;
  _eventListeners;
  _activeSessionEventListeners;
  /**
  * Constructor for the Swiper class.
  *
  * @param {HTMLElement} element - the HTML container element to initialize the Swiper
  * @param {SwiperArgs} args - optional arguments to configure the Swiper
  */
  constructor(element, args = null) {
    var _a;
    if (!element) {
      console.error("Cannot initialize Swiper: no element provided.");
      return;
    }
    this._swiperElement = element;
    if (args) {
      this._indexChangeCallback = args.onSlideChange ?? null;
      this._auto = args.auto ?? null;
      this._slideClassName = args.slideClassName ?? null;
      this._navigationElements = args.navigation ?? {};
      this._childrenSwipers = args.linkedSwipers ?? null;
      this._slideLoad = args.slideLoad ?? null;
      this._slideClick = args.onSlideClick ?? null;
      this._state.slidesLoaded = args.slideLoad ? false : true;
      this._draggable = args.draggable ?? false;
      this._limitToEdges = args.limitToEdges ?? false;
    }
    const slideCollection = this._slideClassName ? this._swiperElement.querySelectorAll("." + this._slideClassName) : ((_a = this._swiperElement.firstElementChild) == null ? void 0 : _a.children) ?? [];
    if (slideCollection.length === 0) {
      console.error("Cannot initialize Swiper: no slides found.");
      return;
    }
    this._slidesWrapper = slideCollection[0].parentElement;
    this._slides = Array.from(slideCollection).map(
      (slide) => {
        const id = slide.id ? slide.id : (() => {
          const generatedId = "slide-" + Math.random().toString(36).substring(2, 15);
          slide.id = generatedId;
          return generatedId;
        })();
        return {
          id,
          element: slide,
          position: 0,
          width: 0,
          loaded: this._slideLoad ? false : true
        };
      }
    );
    this._slideCount = this._slides.length;
    this._activeSessionEventListeners = {
      mouse: [
        ["mousemove", this._handleMove],
        ["mouseup", this._handleRelease]
      ],
      touch: [
        ["touchmove", this._handleMove],
        ["touchend", this._handleRelease],
        ["touchcancel", this._handleRelease]
      ]
    };
    this._eventListeners = [
      [this._swiperElement, "mouseover", this._handleHover.bind(this), { passive: true }],
      //[this._swiperElement, 'mouseleave', this._handleLeave.bind(this)],
      [window, "resize", this._getDimensions, { passive: true }]
    ];
    if (this._draggable) {
      this._eventListeners.push(
        //@ts-ignore
        [this._swiperElement, "mousedown", this._handlePush, { passive: true }],
        [this._swiperElement, "touchstart", this._handlePush, { passive: true }],
        [this._swiperElement, "selectstart", this._preventDefault, { capture: true }],
        [this._swiperElement, "dragstart", this._preventDefault, { capture: true }]
      );
    }
    this.start(args == null ? void 0 : args.slideStart);
  }
  /**
   * Start the slider at the specified index, if provided.
   *
   * @param {number} index - The index at which to start the slider
   */
  start = (index) => {
    if (!this._state.initialized && this._swiperElement) {
      this._getDimensions();
      this._eventListeners.forEach(([element, event, callback, options]) => {
        element == null ? void 0 : element.addEventListener(event, callback, options);
      });
      this._slides.forEach(({ element }, index2) => {
        element.addEventListener("click", (e) => {
          this._handleSlideClick(e, element, index2);
        });
      });
      if (this._navigationElements.prev)
        this._navigationElements.prev.forEach((el) => {
          el.addEventListener("click", this._handlePrevClick.bind(this));
        });
      if (this._navigationElements.next)
        this._navigationElements.next.forEach((el) => {
          el.addEventListener("click", this._handleNextClick.bind(this));
        });
      this._state.initialized = true;
      this._setIndex(index ?? 0);
      if (this._auto) {
        this._autoInterval = setInterval(() => {
          if (this._slides[this._state.currentIndex].loaded) {
            this._handleNextClick();
          }
        }, this._auto);
      }
    }
  };
  /**
   * A function to handle hover behavior.
   */
  _handleHover = () => {
    clearInterval(this._autoInterval);
  };
  _preventDefault = (e) => {
    e.preventDefault();
  };
  /*
  _handleLeave() {
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
  _handlePrevClick = () => {
    const newIndex = this._state.currentIndex - 1 < 0 ? this._slideCount - 1 : this._state.currentIndex - 1;
    this._setIndex(newIndex);
  };
  /**
   * Handles the click event for navigating to the next item.
   */
  _handleNextClick = () => {
    const newIndex = this._state.currentIndex + 1 > this._slideCount - 1 ? 0 : this._state.currentIndex + 1;
    this._setIndex(newIndex);
  };
  /**
   * Handle the click event on a slide element.
   *
   * @param {Event} e - the click event
   * @param {HTMLElement} element - the slide element
   * @param {number} index - the index of the slide
   */
  _handleSlideClick = (e, element, index) => {
    e.preventDefault();
    if ((this._swipeSession.isClick || !this._draggable) && this._slideClick) {
      this._slideClick(index, element);
    }
  };
  /**
   * Update dimensions and positions of slides
   */
  _getDimensions = () => {
    var _a, _b;
    this._state.swiperWidth = ((_a = this._swiperElement) == null ? void 0 : _a.offsetWidth) ?? 0;
    this._state.slidesWrapperWidth = ((_b = this._slidesWrapper) == null ? void 0 : _b.scrollWidth) ?? 0;
    if (this._slidesWrapper) {
      if (this._state.slidesWrapperWidth <= this._state.swiperWidth) {
        const fixed = (this._state.swiperWidth - this._state.slidesWrapperWidth) / 2;
        this._translate(fixed, 0);
        this._state.fixedTranslate = fixed;
      } else {
        this._state.fixedTranslate = false;
      }
    }
    this._slides = this._slides.map(
      (slide) => {
        const width = slide.element.offsetWidth;
        const position = slide.element.offsetLeft;
        return {
          ...slide,
          width,
          position
        };
      }
    );
    if (this._state.initialized && this._slides[this._state.currentIndex]) {
      this._translate(
        (this._state.swiperWidth - this._slides[this._state.currentIndex].width) / 2 - this._slides[this._state.currentIndex].position
      );
    }
  };
  /**
   * Stops all event listeners and resets the state of the component.
   */
  stop = () => {
    this._eventListeners.forEach(([element, event, callback, options]) => {
      element == null ? void 0 : element.removeEventListener(event, callback, options);
    });
    this._slides.forEach(({ element }, index) => {
      element.removeEventListener("click", (e) => {
        this._handleSlideClick(e, element, index);
      });
    });
    if (this._navigationElements.prev)
      this._navigationElements.prev.forEach((el) => {
        el.removeEventListener("click", this._handlePrevClick.bind(this));
      });
    if (this._navigationElements.next)
      this._navigationElements.next.forEach((el) => {
        el.removeEventListener("click", this._handleNextClick.bind(this));
      });
    if (this._autoInterval) {
      clearInterval(this._autoInterval);
    }
    this._translate(0);
    this._state.initialized = false;
  };
  /**
   * Translates the slides wrapper by the specified value.
   *
   * @param {number} value - The value to translate by
   * @param {number | null} duration - The duration of the translation, defaults to null
   */
  _translate = (value, duration = null) => {
    if (this._state.fixedTranslate === this._state.currentPosition)
      return;
    if (this._slidesWrapper) {
      this._slidesWrapper.style.transform = `translate3d(${value}px, 0, 0)`;
      if (duration)
        this._slidesWrapper.style.transition = `${duration}ms cubic-bezier(.08,.5,.2,1) transform`;
    }
    this._state.currentPosition = value;
  };
  /**
   * Handles the push event triggered by a mouse click or touch on the swiper element.
   *
   */
  _handlePush = (e) => {
    var _a, _b, _c;
    (_a = this._swiperElement) == null ? void 0 : _a.focus();
    (_b = window.getSelection()) == null ? void 0 : _b.removeAllRanges();
    const clientX = e.clientX ?? ((_c = e.touches[0]) == null ? void 0 : _c.clientX) ?? null;
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
      direction: 0
    };
    this._activeSessionEventListeners[this._swipeSession.type].forEach(
      ([event, callback]) => {
        document.addEventListener(event, callback, { passive: true });
      }
    );
    this._triggerEvent("push");
  };
  /**
   * Handles the release action triggered by a mouse up or touch end.
   *
   */
  _handleRelease = () => {
    this._swipeSession.active = false;
    this._activeSessionEventListeners[this._swipeSession.type].forEach(
      ([event, callback]) => {
        document.removeEventListener(event, callback);
      }
    );
    if (this._swipeSession.deltaX < 5 && this._swipeSession.lastEvent.timeStamp - this._swipeSession.startTime < 200) {
      this._swipeSession.isClick = true;
    }
    this._triggerEvent("release");
  };
  /**
   * Do an action based on the given event type.
   *
   * @param {("release" | "push" | "move")} ev - The type of event
   */
  _triggerEvent = (ev) => {
    if (ev === "release") {
      this._setIndex(this._state.currentIndex);
    }
    if (ev === "move") {
      const newTranslate = this._state.currentPosition + this._swipeSession.lastEventDeltaX;
      this._translate(newTranslate);
      const newIndex = this._getIndexByPosition(-newTranslate);
      if (newIndex > -1)
        this._setIndex(newIndex, false);
    }
    if (ev === "push") {
      if (this._swipeSession.type === "touch") {
        this._handleHover();
      }
    }
  };
  /**
   * Handle the move event, updating swipe session data and triggering move to do related actions.
   */
  _handleMove = (e) => {
    if (!this._swipeSession.active)
      return;
    const { type, startX, lastEvent } = this._swipeSession;
    const clientX = type === "mouse" ? e.clientX : e.touches[0].clientX;
    const lastClientX = type === "mouse" ? lastEvent.clientX : lastEvent.touches[0].clientX;
    this._swipeSession.lastEvent = e;
    this._swipeSession.deltaX = clientX - startX;
    this._swipeSession.velocity = this._swipeSession.deltaX / (e.timeStamp - this._swipeSession.startTime);
    this._swipeSession.lastEventDeltaX = clientX - lastClientX;
    this._swipeSession.lastEventVelocity = this._swipeSession.lastEventDeltaX === 0 ? this._swipeSession.lastEventVelocity : this._swipeSession.lastEventDeltaX / (e.timeStamp - lastEvent.timeStamp);
    this._swipeSession.direction = Math.sign(this._swipeSession.lastEventDeltaX);
    this._triggerEvent("move");
  };
  /**
   * Sets the index of the slider and optionally performs a translation.
   *
   * @param {number} index - The index to set.
   * @param {boolean} translate - Optional flag to perform translation. Defaults to true.
   */
  _setIndex = (index, translate = true) => {
    var _a, _b, _c, _d, _e;
    if (!this._state.slidesLoaded && this._slideLoad) {
      const numOfAdjacentSlidesVisible = Math.ceil((this._state.swiperWidth / this._slides[index].width - 1) / 2);
      this._slideLoad((_a = this._slides[index]) == null ? void 0 : _a.element).then(() => {
        this._slides[index].loaded = true;
        this._checkIfAllLoaded();
        if (!this._state.slidesLoaded) {
          for (let i = 1; i <= numOfAdjacentSlidesVisible; i++) {
            if (this._slides[index + i]) {
              this._slideLoad(this._slides[index + i].element).then(() => {
                this._slides[index + i].loaded = true;
                this._checkIfAllLoaded();
              });
            }
            if (this._slides[index - i]) {
              this._slideLoad(this._slides[index - i].element).then(() => {
                this._slides[index - i].loaded = true;
                this._checkIfAllLoaded();
              });
            }
          }
        }
      }).catch((err) => {
        console.error(err);
      });
    }
    if (translate && this._slides[index]) {
      let value = (this._state.swiperWidth - this._slides[index].width) / 2 - this._slides[index].position;
      if (this._limitToEdges) {
        const limit = this._state.swiperWidth - this._state.slidesWrapperWidth;
        const stickToStart = value > -(this._slides[0].width / 2);
        const stickToEnd = value < limit + this._slides[this._slideCount - 1].width / 2;
        if (stickToEnd && stickToStart) {
          value = this._swipeSession.direction < 0 ? limit : 0;
        } else if (stickToStart) {
          value = 0;
        } else if (stickToEnd) {
          value = limit;
        }
      }
      this._translate(value, 500);
    }
    (_b = this._slides[index]) == null ? void 0 : _b.element.classList.add("is-active");
    (_c = this._swiperElement) == null ? void 0 : _c.classList.remove("is-first", "is-last");
    if (index === 0) {
      (_d = this._swiperElement) == null ? void 0 : _d.classList.add("is-first");
    } else if (index === this._slideCount - 1) {
      (_e = this._swiperElement) == null ? void 0 : _e.classList.add("is-last");
    }
    if (index === this._state.currentIndex)
      return;
    this._slides[this._state.currentIndex].element.classList.remove(
      "is-active"
    );
    this._state.currentIndex = index;
    if (this._indexChangeCallback)
      this._indexChangeCallback(index);
    if (this._childrenSwipers) {
      this._childrenSwipers.forEach((swiper) => {
        swiper.index = index;
      });
    }
  };
  /**
   * Retrieves the active index based on the given position.
   */
  _getIndexByPosition = (translate) => {
    const offset = -1 * this._state.swiperWidth / 2;
    const ii = this._slides.findIndex(
      (slide) => offset + slide.position <= translate && offset + slide.position + slide.width >= translate
    );
    return this._slides.findIndex((slide) => offset + slide.position <= translate && offset + slide.position + slide.width >= translate);
  };
  /**
   * Check if all slides are loaded.
   */
  _checkIfAllLoaded = () => {
    this._state.slidesLoaded = this._slides.every((slide) => slide.loaded);
  };
  get index() {
    return this._state.currentIndex;
  }
  set index(index) {
    this._setIndex(index);
  }
  /**
   * setter for slide click callback
   */
  set slideClick(callback) {
    this._slideClick = callback;
  }
};
export {
  Swiper as default
};
//# sourceMappingURL=sg-swiper.mjs.map