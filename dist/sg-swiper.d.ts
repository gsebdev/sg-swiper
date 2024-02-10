interface NavigationElements {
    next?: HTMLElement[] | null;
    prev?: HTMLElement[] | null;
}
interface SwiperInterface {
    start(index?: number): void;
    stop(): void;
    index: number;
    slideClick?: (index: number, element: HTMLElement) => void;
}

interface SwiperArgs {
    navigation?: NavigationElements;
    auto?: number;
    slideClassName?: string;
    onSlideChange?: (index: number) => void;
    slideLoad?: (slide: HTMLElement) => Promise<void>;
    onSlideClick?: (index: number, element: HTMLElement) => void;
    linkedSwipers?: SwiperInterface[];
    breakpoint?: number;
    slideStart?: number;
    draggable?: boolean;
}

declare class Swiper implements SwiperInterface {
    private _state;
    private _swipeSession;
    private _indexChangeCallback;
    private _navigationElements;
    private _childrenSwipers;
    private _slideClassName;
    private _swiperElement;
    private _slidesWrapper;
    private _breakpoint;
    private _auto;
    private _autoInterval;
    private _slides;
    private _slideCount;
    private _draggable;
    private _slideLoad;
    private _slideClick;
    private _eventListeners;
    private _activeSessionEventListeners;
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
    start(index?: number): void;
    /**
     * A private function to handle hover behavior.
     */
    private _handleHover;
    /**
    * Handles the click event for the previous button.
    */
    private _handlePrevClick;
    /**
     * Handles the click event for navigating to the next item.
     */
    private _handleNextClick;
    /**
     * Handle the click event on a slide element.
     *
     * @param {Event} e - the click event
     * @param {HTMLElement} element - the slide element
     * @param {number} index - the index of the slide
     */
    private _handleSlideClick;
    /**
     * Update dimensions and positions of slides
     */
    private _getDimensions;
    /**
     * Stops all event listeners and resets the state of the component.
     */
    stop(): void;
    /**
     * Translates the slides wrapper by the specified value.
     *
     * @param {number} value - The value to translate by
     * @param {number | null} duration - The duration of the translation, defaults to null
     */
    private _translate;
    /**
     * Handles the push event triggered by a mouse click or touch on the swiper element.
     *
     * @param {MouseEvent | TouchEvent} e - The event object.
     * @return {void}
     */
    private _handlePush;
    /**
     * Handles the release action triggered by a mouse up or touch end.
     *
     */
    private _handleRelease;
    /**
     * Do an action based on the given event type.
     *
     * @param {("release" | "push" | "move")} ev - The type of event to trigger
     */
    private _triggerEvent;
    /**
     * Handle the move event, updating swipe session data and triggering move to do related actions.
     *
     * @param {MouseEvent | TouchEvent} e - The mouse or touch event
     * @return {void}
     */
    private _handleMove;
    /**
     * Sets the index of the slider and optionally performs a translation.
     *
     * @param {number} index - The index to set.
     * @param {boolean} translate - Optional flag to perform translation. Defaults to true.
     */
    private _setIndex;
    /**
     * Retrieves the active index based on the given position.
     *
     * @param {number} translate - the position to search for
     * @return {number} the index of the slide
     */
    private _getIndexByPosition;
    /**
     * Check if all slides are loaded.
     */
    private _checkIfAllLoaded;
    get index(): number;
    set index(index: number);
    /**
     * setter for slide click callback
     *
     * @param {function} callback - callback function to be invoked on slide click
     * @return {void}
     */
    set slideClick(callback: (index: number, element: HTMLElement) => void);
}

export { Swiper as default };
