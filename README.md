# sg-swiper
a lightweight typescript slides swiper.

[Demo here](https://gsebdev.github.io/sg-swiper/)

## Installation

```bash
npm install sg-swiper
```

## Usage
```js
import Swiper from 'sg-swiper';

// Create a new Swiper instance
const swiperElement = document.getElementById('swiper-container');
const swiper = new Swiper(swiperElement, {
  // Optional configuration options
  // ...
});

```


## Options
The Swiper class can be configured with the following options:

**onSlideChange?: (index: number) => void** Callback function triggered when the active slide changes.

**auto?: number** Auto-advances to the next slide at a specified interval (in milliseconds).

**slideClassName?: string** class name for selecting the slides.

**navigation?: {next?: HTMLElement[] | null, prev?: HTMLElement[] | null}** Object with previous and next navigation elements.

**linkedSwipers?: (Swiper instance)[]** An array of linked Swiper instances.

**slideLoad?: (slide: HTMLElement) => Promise<void>** A function to load lazy-loaded slides, must return a Promise that will resolve when it's loaded.

**onSlideClick?: (index: number, element: HTMLElement) => void** Callback function triggered when a slide is clicked.

**draggable?: boolean** Enable or disable dragging slides.

**slideStart?: number** At init, the starting position of the slider.


### Example

```js
const swiper = new Swiper(swiperElement, {
  onSlideChange: (index) => {
    console.log(`Active slide changed to index ${index}`);
  },
  auto: 3000,
  slideClassName: 'my-slide',
  navigation: {
    prev: [prevButtonElement1, prevButtonElement2],
    next: [nextButtonElement1, nextButtonElement2],
  },
  linkedSwipers: [linkedSwiper1, linkedSwiper2],
  slideLoad: (slideElement) => {
    // Load slide content dynamically
    return new Promise(/* ... */);
  },
  onSlideClick: (index, element) => {
    console.log(`Clicked on slide ${index}`);
  },
  draggable: true,
});
```

## Methods

### `start(index?: number)`
Starts the swiper at the specified index.

**Parameters:**
- `index` (optional): The index at which to start the swiper.

**Example:**
```javascript
const swiper = new Swiper(swiperElement);
swiper.start(2); // Starts the swiper at index 2
```

### `stop()`
Stops the swiper and removes all event listeners.

**Example:**
```javascript
const swiper = new Swiper(swiperElement);
swiper.stop(); // Stops the swiper
```

### `index = index: number`
setter to put the swiper at a specified index

**Example:**
```javascript
const swiper = new Swiper(swiperElement);
swiper.index = 10;
```

### `slideClick = (index: number, element: HTMLElement) => void`
setter to pass a callback function to handle a click on a slide

**Example:**
```javascript
const swiper = new Swiper(swiperElement);
swiper.slideclick = (index, el) => { console.log('click')}; 
```