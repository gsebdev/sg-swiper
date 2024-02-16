interface SwiperSlide {
    index: number;
    element: HTMLElement;
    position: number;
    width: number;
    loaded: boolean;
}
interface NavigationElements {
    next?: HTMLElement[] | null;
    prev?: HTMLElement[] | null;
}
interface SwiperInterface {
    start(index?: number): void;
    stop(): void;
    index: number | null | undefined;
    slideClick?: (index: number, element: HTMLElement) => void;
}

declare class SlideMap extends Map<string, SwiperSlide> {
    _allSlidesLoaded: boolean;
    _firstKey: string | undefined;
    _lastKey: string | undefined;
    /**
   * Retrieves the slide given the index position.
   */
    getSlideByIndex: (index: number | undefined) => [string, SwiperSlide] | null;
    getSlidesScrollWidth: () => number;
    updateSlideDimensions: (id?: string, args?: {
        width?: number;
        position?: number;
    }) => void;
    set(id: string, slide: SwiperSlide): this;
    delete(key: string): boolean;
    /**
     * getter to know if all slides are loaded.
     */
    get allSlidesLoaded(): boolean;
    get last(): SwiperSlide | undefined;
    get first(): SwiperSlide | undefined;
}

interface SwipeSession {
    active: boolean;
    type: "mouse" | "touch";
    startX: number;
    startTime: number;
    velocity: number;
    isClick: boolean;
    deltaX: number;
    lastEvent: Event | null;
    lastEventDeltaX: number;
    lastEventVelocity: number;
    direction: -1 | 1 | 0;
}

interface SwiperState {
    currentIndex: number | undefined;
    currentPosition: number;
    initialized: boolean;
    swiperWidth: number;
    slidesScrollWidth: number;
    noTranslate: boolean;
}

interface SwiperArgs {
    navigation?: NavigationElements;
    auto?: number;
    slideClassName?: string;
    onSlideChange?: (index: number) => void;
    slideLoad?: (slide: HTMLElement) => Promise<void>;
    onSlideClick?: (index: number, element: HTMLElement) => void;
    linkedSwipers?: SwiperInterface[];
    slideStart?: number;
    draggable?: boolean;
    limitToEdges?: boolean;
}

declare class Swiper implements SwiperInterface {
    _state: SwiperState;
    _swipeSession: SwipeSession;
    _indexChangeCallback: ((index: number) => void) | null;
    _resizeObserver: ResizeObserver | null;
    _resizeTimeout: NodeJS.Timeout | undefined;
    _navigationElements: NavigationElements;
    _childrenSwipers: SwiperInterface[] | null;
    _slideClassName: string | null;
    _swiperElement: HTMLElement | null;
    _slidesWrapper: HTMLElement | null;
    _auto: number | null;
    _autoInterval: NodeJS.Timeout | undefined;
    _slides: SlideMap;
    _slideCount: number;
    _draggable: boolean;
    _limitToEdges: boolean;
    _slideLoad: ((slide: HTMLElement) => Promise<void>) | null;
    _slideClick: ((index: number, element: HTMLElement) => void) | null;
    _eventListeners: [
        HTMLElement | null | Window,
        string,
        (e: Event) => void,
        {
            capture?: boolean;
            passive?: boolean;
        }?
    ][];
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
    constructor(element: HTMLElement, args?: SwiperArgs | null);
    /**
     * Start the slider at the specified index, if provided.
     *
     * @param {number} index - The index at which to start the slider
     */
    start: (index?: number) => void;
    /**
     * A function to handle hover behavior.
     */
    _handleHover: () => void;
    _preventDefault: (e: Event) => void;
    /**
    * Handles the click event for the previous button.
    */
    _handlePrevClick: () => void;
    /**
     * Handles the click event for navigating to the next item.
     */
    _handleNextClick: () => void;
    /**
     * Handle the click event on a slide element.
     *
     * @param {Event} e - the click event
     * @param {HTMLElement} element - the slide element
     * @param {number} index - the index of the slide
     */
    _handleSlideClick: (e: Event, element: HTMLElement, index: number) => void;
    _handleResize: (entries: ResizeObserverEntry[]) => void;
    /**
     * Update dimensions and positions of slides
     */
    _updateDimensions: () => boolean;
    /**
     * Stops all event listeners and resets the state of the component.
     */
    stop: () => void;
    /**
     * Translates the slides wrapper by the specified value.
     *
     * @param {number} value - The value to translate by
     * @param {number | null} duration - The duration of the translation, defaults to null
     */
    _translate: (value: number, duration?: number | null) => void;
    /**
     * Handles the push event triggered by a mouse click or touch on the swiper element.
     *
     */
    _handlePush: (e: MouseEvent | TouchEvent) => void;
    /**
     * Handles the release action triggered by a mouse up or touch end.
     *
     */
    _handleRelease: () => void;
    /**
     * Do an action based on the given event type.
     *
     * @param {("release" | "push" | "move")} ev - The type of event
     */
    _triggerEvent: (ev: "release" | "push" | "move") => void;
    /**
     * Handle the move event, updating swipe session data and triggering move to do related actions.
     */
    _handleMove: (e: MouseEvent | TouchEvent) => void;
    /**
     * Sets the index of the slider and optionally performs a translation.
     *
     * @param {number} index - The index to set.
     * @param {boolean} translate - Optional flag to perform translation. Defaults to true.
     */
    _setIndex: (index: number | null | undefined, translate?: boolean | number) => void;
    _clearPositionClassNames(): void;
    _setFirstClassNames(): void;
    _setLastClassNames(): void;
    /**
     * Retrieves the active index based on the given position.
     */
    _getIndexByPosition: (translate: number) => number | undefined;
    get index(): number;
    set index(index: number);
    /**
     * setter for slide click callback
     */
    set slideClick(callback: (index: number, element: HTMLElement) => void);
}

export { Swiper as default };
