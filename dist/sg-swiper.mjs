// src/SlideMap.ts
var SlideMap = class extends Map {
  _allSlidesLoaded = false;
  _firstKey;
  _lastKey;
  /**
  * Retrieves the slide given the index position.
  */
  getSlideByIndex = (index) => {
    if (index === void 0)
      return null;
    for (const [id, slide] of this.entries()) {
      if (index === slide.index) {
        return [id, slide];
      }
    }
    return null;
  };
  getSlidesScrollWidth = () => {
    const { width, position } = Array.from(this.values()).pop() ?? {};
    return width && position ? width + position : 0;
  };
  updateSlideDimensions = (id, args) => {
    if (id) {
      const slide = this.get(id);
      if (slide) {
        slide.width = (args == null ? void 0 : args.width) ?? slide.element.offsetWidth;
        slide.position = (args == null ? void 0 : args.position) ?? slide.element.offsetLeft;
      }
    } else {
      for (const slide of this.values()) {
        slide.width = slide.element.offsetWidth;
        slide.position = slide.element.offsetLeft;
      }
    }
  };
  set(id, slide) {
    if (this.entries.length === 0) {
      this._firstKey = id;
    }
    super.set(id, slide);
    this._lastKey = id;
    return this;
  }
  delete(key) {
    const deleted = super.delete(key);
    if (deleted) {
      Array.from(this.keys());
      this._lastKey = Array.from(this.keys()).pop();
      this._firstKey = Array.from(this.keys())[0];
    }
    return deleted;
  }
  /**
   * getter to know if all slides are loaded.
   */
  get allSlidesLoaded() {
    if (this._allSlidesLoaded === true) {
      return true;
    } else {
      let allLoaded = true;
      for (const { loaded } of this.values()) {
        if (!loaded) {
          allLoaded = false;
          break;
        }
      }
      this._allSlidesLoaded = allLoaded;
      return allLoaded;
    }
  }
  get last() {
    if (this._lastKey === void 0) {
      return;
    }
    return this.get(this._lastKey);
  }
  get first() {
    if (this._firstKey === void 0) {
      return;
    }
    return this.get(this._firstKey);
  }
};

// src/sg-swiper.ts
var Swiper = class {
  _state = {
    currentIndex: void 0,
    currentPosition: 0,
    initialized: false,
    swiperWidth: 0,
    slidesScrollWidth: 0,
    noTranslate: false
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
  _resizeObserver = null;
  _resizeTimeout;
  _navigationElements = {};
  _childrenSwipers = null;
  _slideClassName = null;
  _swiperElement = null;
  _slidesWrapper;
  _auto = null;
  _autoInterval;
  _slides = new SlideMap();
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
      this._draggable = args.draggable ?? false;
      this._limitToEdges = args.limitToEdges ?? false;
    }
    const slideCollection = this._slideClassName ? this._swiperElement.querySelectorAll("." + this._slideClassName) : ((_a = this._swiperElement.firstElementChild) == null ? void 0 : _a.children) ?? [];
    if (slideCollection.length === 0) {
      console.error("Cannot initialize Swiper: no slides found.");
      return;
    }
    this._slidesWrapper = slideCollection[0].parentElement;
    Array.from(slideCollection).forEach((slide, index) => {
      const id = slide.id ? slide.id : (() => {
        const generatedId = "slide-" + Math.random().toString(36).substring(2, 15);
        slide.id = generatedId;
        return generatedId;
      })();
      this._slides.set(id, {
        index,
        element: slide,
        position: 0,
        width: 0,
        loaded: this._slideLoad ? false : true
      });
    });
    this._slideCount = slideCollection.length;
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
      [this._swiperElement, "mouseover", this._handleHover.bind(this), { passive: true }]
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
    this._resizeObserver = new ResizeObserver(this._handleResize);
    this.start(args == null ? void 0 : args.slideStart);
  }
  /**
   * Start the slider at the specified index, if provided.
   *
   * @param {number} index - The index at which to start the slider
   */
  start = (index) => {
    var _a;
    if (!this._state.initialized && this._swiperElement) {
      this._eventListeners.forEach(([element, event, callback, options]) => {
        element == null ? void 0 : element.addEventListener(event, callback, options);
      });
      this._slides.forEach(({ element, index: index2 }) => {
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
      (_a = this._resizeObserver) == null ? void 0 : _a.observe(this._swiperElement);
      this._state.swiperWidth = this._swiperElement.clientWidth;
      this._state.initialized = true;
      this._setIndex(index ?? 0);
      if (this._auto) {
        this._autoInterval = setInterval(() => {
          var _a2;
          const [, slide] = this._slides.getSlideByIndex((_a2 = this._state) == null ? void 0 : _a2.currentIndex) ?? [];
          if (slide == null ? void 0 : slide.loaded) {
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
  /**
  * Handles the click event for the previous button.
  */
  _handlePrevClick = () => {
    if (this._state.currentIndex) {
      const newIndex = this._state.currentIndex - 1 < 0 ? this._slideCount - 1 : this._state.currentIndex - 1;
      this._setIndex(newIndex);
    }
  };
  /**
   * Handles the click event for navigating to the next item.
   */
  _handleNextClick = () => {
    if (this._state.currentIndex) {
      const newIndex = this._state.currentIndex + 1 > this._slideCount - 1 ? 0 : this._state.currentIndex + 1;
      this._setIndex(newIndex);
    }
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
  _handleResize = (entries) => {
    clearTimeout(this._resizeTimeout);
    for (const entry of entries) {
      if (entry.target === this._swiperElement) {
        this._state.swiperWidth = entry.contentBoxSize[0].inlineSize;
      }
    }
    this._resizeTimeout = setTimeout(() => {
      this._setIndex(this._getIndexByPosition(this._state.currentPosition), 200);
    }, 80);
  };
  /**
   * Update dimensions and positions of slides
   */
  _updateDimensions = () => {
    const state = this._state;
    const swiper = this._swiperElement;
    this._slides.updateSlideDimensions();
    state.slidesScrollWidth = this._slides.getSlidesScrollWidth();
    if (state.slidesScrollWidth <= state.swiperWidth) {
      this._translate(0);
      state.currentIndex = 0;
      state.noTranslate = true;
      swiper == null ? void 0 : swiper.classList.add("no-translate");
      return false;
    } else {
      state.noTranslate = false;
      swiper == null ? void 0 : swiper.classList.remove("no-translate");
      return true;
    }
  };
  /**
   * Stops all event listeners and resets the state of the component.
   */
  stop = () => {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this._eventListeners.forEach(([element, event, callback, options]) => {
      element == null ? void 0 : element.removeEventListener(event, callback, options);
    });
    this._slides.forEach(({ element, index }) => {
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
    var _a;
    if (ev === "release") {
      this._setIndex((_a = this._state) == null ? void 0 : _a.currentIndex);
    }
    if (ev === "move") {
      if (this._state.noTranslate)
        return;
      const newTranslate = this._state.currentPosition + this._swipeSession.lastEventDeltaX;
      this._translate(newTranslate);
      const newIndex = this._getIndexByPosition(newTranslate);
      if (newIndex !== this._state.currentIndex)
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
    if (!this._swipeSession.active || this._state.noTranslate)
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
    const state = this._state;
    if (!state.initialized || index === void 0 || index === null)
      return;
    const [, activeSlide] = this._slides.getSlideByIndex(index) ?? [];
    const [, lastActiveSlide] = this._slides.getSlideByIndex(state.currentIndex) ?? [];
    if (!activeSlide) {
      console.error("no active slide", index);
      return;
    }
    if (!this._slides.allSlidesLoaded && this._slideLoad) {
      if (state.noTranslate) {
        this._slides.forEach((slide) => {
          this._slideLoad(slide.element).then(() => {
            slide.loaded = true;
            this._slides.allSlidesLoaded;
          });
        });
      } else {
        if (activeSlide) {
          const numOfAdjacentSlidesVisible = Math.max(0, Math.ceil(state.swiperWidth / activeSlide.width - 1));
          this._slideLoad(activeSlide.element).then(() => {
            activeSlide.loaded = true;
            if (!this._slides.allSlidesLoaded && numOfAdjacentSlidesVisible <= this._slideCount) {
              for (let i = 1; i <= numOfAdjacentSlidesVisible; i++) {
                const [, adjRightSlide] = this._slides.getSlideByIndex(index + i) ?? [];
                const [, adjLeftSlide] = this._slides.getSlideByIndex(index - i) ?? [];
                if (adjRightSlide && !adjRightSlide.loaded) {
                  this._slideLoad(adjRightSlide.element).then(() => {
                    adjRightSlide.loaded = true;
                  });
                }
                if (adjLeftSlide && !adjLeftSlide.loaded) {
                  this._slideLoad(adjLeftSlide.element).then(() => {
                    adjLeftSlide.loaded = true;
                  });
                }
              }
            }
          }).catch((err) => {
            console.error(err);
          });
        }
      }
    }
    if (translate !== false && this._updateDimensions() && !state.noTranslate) {
      let value = (state.swiperWidth - activeSlide.width) / 2 - activeSlide.position;
      if (this._limitToEdges) {
        const limit = state.swiperWidth - state.slidesScrollWidth;
        const [, firstSlide] = this._slides.getSlideByIndex(0) ?? [];
        const [, lastSlide] = this._slides.getSlideByIndex(this._slideCount - 1) ?? [];
        const stickToStart = firstSlide && value > -1 * firstSlide.width / 2 ? true : false;
        const stickToEnd = lastSlide && value < limit + lastSlide.width / 2 ? true : false;
        this._clearPositionClassNames();
        if (stickToEnd && stickToStart) {
          if (state.currentPosition < value) {
            value = limit;
            this._setLastClassNames();
          } else {
            value = 0;
            this._setFirstClassNames;
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
    activeSlide.element.classList.add("is-active");
    if (index === 0) {
      this._setFirstClassNames();
    } else if (index === this._slideCount - 1) {
      this._setLastClassNames();
    }
    if (index === state.currentIndex)
      return;
    state.currentIndex = index;
    lastActiveSlide == null ? void 0 : lastActiveSlide.element.classList.remove("is-active");
    if (this._indexChangeCallback)
      this._indexChangeCallback(index);
    if (this._childrenSwipers) {
      this._childrenSwipers.forEach((swiper) => {
        swiper.index = index;
      });
    }
  };
  _clearPositionClassNames() {
    var _a, _b;
    (_a = this._swiperElement) == null ? void 0 : _a.classList.remove("is-first");
    (_b = this._swiperElement) == null ? void 0 : _b.classList.remove("is-last");
  }
  _setFirstClassNames() {
    var _a, _b;
    (_a = this._swiperElement) == null ? void 0 : _a.classList.remove("is-last");
    (_b = this._swiperElement) == null ? void 0 : _b.classList.add("is-first");
  }
  _setLastClassNames() {
    var _a, _b;
    (_a = this._swiperElement) == null ? void 0 : _a.classList.remove("is-first");
    (_b = this._swiperElement) == null ? void 0 : _b.classList.add("is-last");
  }
  /**
   * Retrieves the active index based on the given position.
   */
  _getIndexByPosition = (translate) => {
    const { swiperWidth, slidesScrollWidth, currentIndex } = this._state;
    const scrollAvailable = slidesScrollWidth - swiperWidth;
    const minScrollAvailableToDetectByMiddle = this._slides.first && this._slides.last ? this._slides.first.width / 2 + this._slides.last.width / 2 : 0;
    if (!this._limitToEdges || scrollAvailable > minScrollAvailableToDetectByMiddle) {
      const offset = swiperWidth / 2;
      for (const { position, width, index } of this._slides.values()) {
        const leftLimit = offset - position - width;
        const rightLimit = offset - position;
        if (translate <= rightLimit && translate >= leftLimit) {
          return index;
        }
      }
      return void 0;
    } else {
      const positionRatio = translate / -scrollAvailable;
      const index = Math.round(positionRatio * this._slideCount);
      return Math.max(0, Math.min(this._slideCount - 1, index));
    }
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