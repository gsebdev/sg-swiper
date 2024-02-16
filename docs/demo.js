(()=>{"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){var i="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!i){if(Array.isArray(e)||(i=n(e))||t&&e&&"number"==typeof e.length){i&&(e=i);var r=0,o=function(){};return{s:o,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,l=!0,a=!1;return{s:function(){i=i.call(e)},n:function(){var e=i.next();return l=e.done,e},e:function(e){a=!0,s=e},f:function(){try{l||null==i.return||i.return()}finally{if(a)throw s}}}}function n(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function r(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,f(i.key),i)}}function o(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function s(){return s="undefined"!=typeof Reflect&&Reflect.get?Reflect.get.bind():function(e,t,n){var i=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=c(e)););return e}(e,t);if(i){var r=Object.getOwnPropertyDescriptor(i,t);return r.get?r.get.call(arguments.length<3?e:n):r.value}},s.apply(this,arguments)}function l(e){var t="function"==typeof Map?new Map:void 0;return l=function(e){if(null===e||!function(e){try{return-1!==Function.toString.call(e).indexOf("[native code]")}catch(t){return"function"==typeof e}}(e))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==t){if(t.has(e))return t.get(e);t.set(e,n)}function n(){return function(e,t,n){if(a())return Reflect.construct.apply(null,arguments);var i=[null];i.push.apply(i,t);var r=new(e.bind.apply(e,i));return n&&u(r,n.prototype),r}(e,arguments,c(this).constructor)}return n.prototype=Object.create(e.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),u(n,e)},l(e)}function a(){try{var e=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){})))}catch(e){}return(a=function(){return!!e})()}function u(e,t){return u=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},u(e,t)}function c(e){return c=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},c(e)}function d(e,t,n){return(t=f(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function f(t){var n=function(t,n){if("object"!=e(t)||!t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var r=i.call(t,"string");if("object"!=e(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(n)?n:String(n)}var v=function(i){function l(){var i,r,s,u;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l);for(var f=arguments.length,v=new Array(f),h=0;h<f;h++)v[h]=arguments[h];return d(o((r=this,s=l,u=[].concat(v),s=c(s),i=function(t,n){if(n&&("object"===e(n)||"function"==typeof n))return n;if(void 0!==n)throw new TypeError("Derived constructors may only return object or undefined");return o(t)}(r,a()?Reflect.construct(s,u||[],c(r).constructor):s.apply(r,u)))),"_allSlidesLoaded",!1),d(o(i),"getSlideByIndex",(function(e){var r,o,s,l=t(i.entries());try{for(l.s();!(r=l.n()).done;){var a=(o=r.value,s=2,function(e){if(Array.isArray(e))return e}(o)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,r,o,s,l=[],a=!0,u=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;a=!1}else for(;!(a=(i=o.call(n)).done)&&(l.push(i.value),l.length!==t);a=!0);}catch(e){u=!0,r=e}finally{try{if(!a&&null!=n.return&&(s=n.return(),Object(s)!==s))return}finally{if(u)throw r}}return l}}(o,s)||n(o,s)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),u=a[0],c=a[1];if(e===c.index)return[u,c]}}catch(e){l.e(e)}finally{l.f()}return null})),d(o(i),"getSlidesScrollWidth",(function(){var e,t=null!==(e=Array.from(i.values()).pop())&&void 0!==e?e:{},n=t.width,r=t.position;return n&&r?n+r:0})),d(o(i),"updateSlideDimensions",(function(e,t){var n,r,o=i.get(e);o&&(o.width=null!==(n=null==t?void 0:t.width)&&void 0!==n?n:o.element.offsetWidth,o.position=null!==(r=null==t?void 0:t.position)&&void 0!==r?r:o.element.offsetLeft)})),i}var f,v;return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),Object.defineProperty(e,"prototype",{writable:!1}),t&&u(e,t)}(l,i),f=l,(v=[{key:"set",value:function(e,t){return 0===this.entries.length&&(this._firstKey=e),s(c(l.prototype),"set",this).call(this,e,t),this._lastKey=e,this}},{key:"delete",value:function(e){var t=s(c(l.prototype),"delete",this).call(this,e);return t&&(Array.from(this.keys()),this._lastKey=Array.from(this.keys()).pop(),this._firstKey=Array.from(this.keys())[0]),t}},{key:"allSlidesLoaded",get:function(){if(!0===this._allSlidesLoaded)return!0;var e,n=!0,i=t(this.values());try{for(i.s();!(e=i.n()).done;)if(!e.value.loaded){n=!1;break}}catch(e){i.e(e)}finally{i.f()}return this._allSlidesLoaded=n,n}},{key:"last",get:function(){if(void 0!==this._lastKey)return this.get(this._lastKey)}},{key:"first",get:function(){if(void 0!==this._firstKey)return this.get(this._firstKey)}}])&&r(f.prototype,v),Object.defineProperty(f,"prototype",{writable:!1}),l}(l(Map));function h(e){return h="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},h(e)}function p(e,t){var n="undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!n){if(Array.isArray(e)||(n=m(e))||t&&e&&"number"==typeof e.length){n&&(e=n);var i=0,r=function(){};return{s:r,n:function(){return i>=e.length?{done:!0}:{done:!1,value:e[i++]}},e:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){throw e})),f:r}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,s=!0,l=!1;return{s:function(){n=n.call(e)},n:function(){var e=n.next();return s=e.done,e},e:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){l=!0,o=e})),f:function(){try{s||null==n.return||n.return()}finally{if(l)throw o}}}}function _(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,r,o,s,l=[],a=!0,u=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;a=!1}else for(;!(a=(i=o.call(n)).done)&&(l.push(i.value),l.length!==t);a=!0);}catch(e){u=!0,r=e}finally{try{if(!a&&null!=n.return&&(s=n.return(),Object(s)!==s))return}finally{if(u)throw r}}return l}}(e,t)||m(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function m(e,t){if(e){if("string"==typeof e)return y(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?y(e,t):void 0}}function y(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function b(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,g(i.key),i)}}function S(e,t,n){return(t=g(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function g(e){var t=function(e,t){if("object"!=h(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var i=n.call(e,"string");if("object"!=h(i))return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==h(t)?t:String(t)}var w=function(){function e(t){var n,i,r=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),S(this,"_state",{currentIndex:0,currentPosition:0,initialized:!1,swiperWidth:0,slidesScrollWidth:0,noTranslate:!1}),S(this,"_swipeSession",{active:!1,type:"mouse",startX:0,startTime:0,velocity:0,isClick:!1,deltaX:0,lastEvent:null,lastEventDeltaX:0,lastEventVelocity:0,direction:0}),S(this,"_indexChangeCallback",null),S(this,"_resizeObserver",null),S(this,"_navigationElements",{}),S(this,"_childrenSwipers",null),S(this,"_slideClassName",null),S(this,"_swiperElement",null),S(this,"_auto",null),S(this,"_slides",new v),S(this,"_slideCount",0),S(this,"_draggable",!1),S(this,"_limitToEdges",!1),S(this,"_slideLoad",null),S(this,"_slideClick",null),S(this,"start",(function(e){var t;!r._state.initialized&&r._swiperElement&&(r._slides.forEach((function(e,t){r._slides.updateSlideDimensions(t)})),r._state.swiperWidth=r._swiperElement.clientWidth,r._eventListeners.forEach((function(e){var t=_(e,4),n=t[0],i=t[1],r=t[2],o=t[3];null==n||n.addEventListener(i,r,o)})),r._slides.forEach((function(e){var t,n=e.element,i=e.index;n.addEventListener("click",(function(e){r._handleSlideClick(e,n,i)})),null===(t=r._resizeObserver)||void 0===t||t.observe(n)})),r._navigationElements.prev&&r._navigationElements.prev.forEach((function(e){e.addEventListener("click",r._handlePrevClick.bind(r))})),r._navigationElements.next&&r._navigationElements.next.forEach((function(e){e.addEventListener("click",r._handleNextClick.bind(r))})),null===(t=r._resizeObserver)||void 0===t||t.observe(r._swiperElement),r._state.initialized=!0,r._setIndex(null!=e?e:0),r._auto&&(r._autoInterval=setInterval((function(){var e,t=_(null!==(e=r._slides.getSlideByIndex(r._state.currentIndex))&&void 0!==e?e:[],2)[1];null!=t&&t.loaded&&r._handleNextClick()}),r._auto)))})),S(this,"_handleHover",(function(){clearInterval(r._autoInterval)})),S(this,"_preventDefault",(function(e){e.preventDefault()})),S(this,"_handlePrevClick",(function(){var e=r._state.currentIndex-1<0?r._slideCount-1:r._state.currentIndex-1;r._setIndex(e)})),S(this,"_handleNextClick",(function(){var e=r._state.currentIndex+1>r._slideCount-1?0:r._state.currentIndex+1;r._setIndex(e)})),S(this,"_handleSlideClick",(function(e,t,n){e.preventDefault(),!r._swipeSession.isClick&&r._draggable||!r._slideClick||r._slideClick(n,t)})),S(this,"_handleResize",(function(e){clearTimeout(r._getDimensionsTimeout);var t,n=p(e);try{for(n.s();!(t=n.n()).done;){var i=t.value;if(i.target===r._swiperElement)r._state.swiperWidth=i.devicePixelContentBoxSize[0].inlineSize;else{var o=i.target.id;r._slides.updateSlideDimensions(o,{width:i.borderBoxSize[0].inlineSize})}}}catch(e){n.e(e)}finally{n.f()}r._getDimensionsTimeout=setTimeout(r._getDimensions,75)})),S(this,"_getDimensions",(function(){var e=r._state,t=r._swiperElement;if(e.initialized){var n=r._slides.getSlidesScrollWidth();r._state.slidesScrollWidth=n,n<=e.swiperWidth?(r._translate(0),e.noTranslate=!0,null==t||t.classList.add("no-translate")):(e.noTranslate=!1,null==t||t.classList.remove("no-translate"),r._setIndex(r._getIndexByPosition(e.currentPosition)))}})),S(this,"stop",(function(){r._resizeObserver&&r._resizeObserver.disconnect(),r._eventListeners.forEach((function(e){var t=_(e,4),n=t[0],i=t[1],r=t[2],o=t[3];null==n||n.removeEventListener(i,r,o)})),r._slides.forEach((function(e){var t=e.element,n=e.index;t.removeEventListener("click",(function(e){r._handleSlideClick(e,t,n)}))})),r._navigationElements.prev&&r._navigationElements.prev.forEach((function(e){e.removeEventListener("click",r._handlePrevClick.bind(r))})),r._navigationElements.next&&r._navigationElements.next.forEach((function(e){e.removeEventListener("click",r._handleNextClick.bind(r))})),r._autoInterval&&clearInterval(r._autoInterval),r._translate(0),r._state.initialized=!1})),S(this,"_translate",(function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(r._state.noTranslate){if(0===r._state.currentPosition)return;e=0}r._slidesWrapper&&(r._slidesWrapper.style.transform="translate3d(".concat(e,"px, 0, 0)"),r._slidesWrapper.style.transition=t?"".concat(t,"ms cubic-bezier(.08,.5,.2,1) transform"):"none"),r._state.currentPosition=e})),S(this,"_handlePush",(function(e){var t,n,i,o,s;null===(t=r._swiperElement)||void 0===t||t.focus(),null===(n=window.getSelection())||void 0===n||n.removeAllRanges();var l=null!==(i=null!==(o=e.clientX)&&void 0!==o?o:null===(s=e.touches[0])||void 0===s?void 0:s.clientX)&&void 0!==i?i:null;r._swipeSession={active:!0,type:"mousedown"===e.type?"mouse":"touch",startX:l,startTime:e.timeStamp,velocity:0,isClick:!1,deltaX:0,lastEvent:e,lastEventDeltaX:0,lastEventVelocity:0,direction:0},r._activeSessionEventListeners[r._swipeSession.type].forEach((function(e){var t=_(e,2),n=t[0],i=t[1];document.addEventListener(n,i,{passive:!0})})),r._triggerEvent("push")})),S(this,"_handleRelease",(function(){r._swipeSession.active=!1,r._activeSessionEventListeners[r._swipeSession.type].forEach((function(e){var t=_(e,2),n=t[0],i=t[1];document.removeEventListener(n,i)})),r._swipeSession.deltaX<5&&r._swipeSession.lastEvent.timeStamp-r._swipeSession.startTime<200&&(r._swipeSession.isClick=!0),r._triggerEvent("release")})),S(this,"_triggerEvent",(function(e){if("release"===e&&r._setIndex(r._state.currentIndex),"move"===e){if(r._state.noTranslate)return;var t=r._state.currentPosition+r._swipeSession.lastEventDeltaX;r._translate(t);var n=r._getIndexByPosition(t);n>-1&&r._setIndex(n,!1)}"push"===e&&"touch"===r._swipeSession.type&&r._handleHover()})),S(this,"_handleMove",(function(e){if(r._swipeSession.active&&!r._state.noTranslate){var t=r._swipeSession,n=t.type,i=t.startX,o=t.lastEvent,s="mouse"===n?e.clientX:e.touches[0].clientX,l="mouse"===n?o.clientX:o.touches[0].clientX;r._swipeSession.lastEvent=e,r._swipeSession.deltaX=s-i,r._swipeSession.velocity=r._swipeSession.deltaX/(e.timeStamp-r._swipeSession.startTime),r._swipeSession.lastEventDeltaX=s-l,r._swipeSession.lastEventVelocity=0===r._swipeSession.lastEventDeltaX?r._swipeSession.lastEventVelocity:r._swipeSession.lastEventDeltaX/(e.timeStamp-o.timeStamp),r._swipeSession.direction=Math.sign(r._swipeSession.lastEventDeltaX),r._triggerEvent("move")}})),S(this,"_setIndex",(function(e){var t,n,i=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],o=r._state,s=o.noTranslate,l=o.swiperWidth,a=o.slidesScrollWidth,u=o.currentIndex,c=o.currentPosition,d=_(null!==(t=r._slides.getSlideByIndex(e))&&void 0!==t?t:[],2)[1],f=_(null!==(n=r._slides.getSlideByIndex(u))&&void 0!==n?n:[],2)[1];if(d){if(!r._slides.allSlidesLoaded&&r._slideLoad)if(s)r._slides.forEach((function(e){r._slideLoad(e.element).then((function(){e.loaded=!0,r._slides.allSlidesLoaded}))}));else if(d){var v=Math.max(0,Math.ceil(l/d.width-1));r._slideLoad(d.element).then((function(){if(d.loaded=!0,!r._slides.allSlidesLoaded)for(var t=function(){var t,i,o=_(null!==(t=r._slides.getSlideByIndex(e+n))&&void 0!==t?t:[],2)[1],s=_(null!==(i=r._slides.getSlideByIndex(e-n))&&void 0!==i?i:[],2)[1];o&&!o.loaded&&r._slideLoad(o.element).then((function(){o.loaded=!0})),s&&!s.loaded&&r._slideLoad(s.element).then((function(){s.loaded=!0}))},n=1;n<=v;n++)t()})).catch((function(e){console.error(e)}))}if(i&&!s){var h=(l-d.width)/2-d.position;if(r._limitToEdges){var p,m,y=l-a,b=_(null!==(p=r._slides.getSlideByIndex(0))&&void 0!==p?p:[],2)[1],S=_(null!==(m=r._slides.getSlideByIndex(r._slideCount-1))&&void 0!==m?m:[],2)[1],g=!!(b&&h>-1*b.width/2),w=!!(S&&h<y+S.width/2);r._clearPositionClassNames(),w&&g?c<h?(h=y,r._setLastClassNames()):(h=0,r._setFirstClassNames):g?(h=0,r._setFirstClassNames()):w?(h=y,r._setLastClassNames()):h=Math.min(0,Math.max(y,h))}r._translate(h,500)}d.element.classList.add("is-active"),0===e?r._setFirstClassNames():e===r._slideCount-1&&r._setLastClassNames(),e!==u&&(r._state.currentIndex=e,null==f||f.element.classList.remove("is-active"),r._indexChangeCallback&&r._indexChangeCallback(e),r._childrenSwipers&&r._childrenSwipers.forEach((function(t){t.index=e})))}else console.error("no active slide",e)})),S(this,"_getIndexByPosition",(function(e){var t=r._state,n=t.swiperWidth,i=t.slidesScrollWidth,o=t.currentIndex,s=i-n,l=r._slides.first&&r._slides.last?r._slides.first.width/2+r._slides.last.width/2:0;if(!r._limitToEdges||s>l){var a,u=n/2,c=p(r._slides.values());try{for(c.s();!(a=c.n()).done;){var d=a.value,f=d.position,v=d.width,h=d.index;if(e<=u-f&&e>=u-f-v)return h}}catch(e){c.e(e)}finally{c.f()}return o}var _=e/-s,m=Math.round(_*r._slideCount);return Math.max(0,Math.min(r._slideCount-1,m))})),t){var s,l,a,u,c,d,f,h,m;this._swiperElement=t,o&&(this._indexChangeCallback=null!==(s=o.onSlideChange)&&void 0!==s?s:null,this._auto=null!==(l=o.auto)&&void 0!==l?l:null,this._slideClassName=null!==(a=o.slideClassName)&&void 0!==a?a:null,this._navigationElements=null!==(u=o.navigation)&&void 0!==u?u:{},this._childrenSwipers=null!==(c=o.linkedSwipers)&&void 0!==c?c:null,this._slideLoad=null!==(d=o.slideLoad)&&void 0!==d?d:null,this._slideClick=null!==(f=o.onSlideClick)&&void 0!==f?f:null,this._draggable=null!==(h=o.draggable)&&void 0!==h&&h,this._limitToEdges=null!==(m=o.limitToEdges)&&void 0!==m&&m);var y=this._slideClassName?this._swiperElement.querySelectorAll("."+this._slideClassName):null!==(n=null===(i=this._swiperElement.firstElementChild)||void 0===i?void 0:i.children)&&void 0!==n?n:[];0!==y.length?(this._slidesWrapper=y[0].parentElement,Array.from(y).forEach((function(e,t){var n,i=e.id?e.id:(n="slide-"+Math.random().toString(36).substring(2,15),e.id=n,n);r._slides.set(i,{index:t,element:e,position:0,width:0,loaded:!r._slideLoad})})),this._slideCount=y.length,this._activeSessionEventListeners={mouse:[["mousemove",this._handleMove],["mouseup",this._handleRelease]],touch:[["touchmove",this._handleMove],["touchend",this._handleRelease],["touchcancel",this._handleRelease]]},this._eventListeners=[[this._swiperElement,"mouseover",this._handleHover.bind(this),{passive:!0}]],this._draggable&&this._eventListeners.push([this._swiperElement,"mousedown",this._handlePush,{passive:!0}],[this._swiperElement,"touchstart",this._handlePush,{passive:!0}],[this._swiperElement,"selectstart",this._preventDefault,{capture:!0}],[this._swiperElement,"dragstart",this._preventDefault,{capture:!0}]),this._resizeObserver=new ResizeObserver(this._handleResize),this.start(null==o?void 0:o.slideStart)):console.error("Cannot initialize Swiper: no slides found.")}else console.error("Cannot initialize Swiper: no element provided.")}var t,n;return t=e,(n=[{key:"_clearPositionClassNames",value:function(){var e,t;null===(e=this._swiperElement)||void 0===e||e.classList.remove("is-first"),null===(t=this._swiperElement)||void 0===t||t.classList.remove("is-last")}},{key:"_setFirstClassNames",value:function(){var e,t;null===(e=this._swiperElement)||void 0===e||e.classList.remove("is-last"),null===(t=this._swiperElement)||void 0===t||t.classList.add("is-first")}},{key:"_setLastClassNames",value:function(){var e,t;null===(e=this._swiperElement)||void 0===e||e.classList.remove("is-first"),null===(t=this._swiperElement)||void 0===t||t.classList.add("is-last")}},{key:"index",get:function(){return this._state.currentIndex},set:function(e){this._setIndex(e)}},{key:"slideClick",set:function(e){this._slideClick=e}}])&&b(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}(),E=[],x=function(){var e,t,n,i,r,o=null===(e=document.querySelector("#limit-edges"))||void 0===e?void 0:e.checked,s=null===(t=document.querySelector("#auto"))||void 0===t?void 0:t.checked,l=null===(n=document.querySelector("#draggable"))||void 0===n?void 0:n.checked,a=null===(i=document.querySelector("#navigation"))||void 0===i?void 0:i.checked,u=null===(r=document.querySelector("#linked-swiper"))||void 0===r?void 0:r.checked,c=document.querySelector(".active-slide-info");if(document.querySelector(".swiper-demo")){var d=function(e){return new Promise((function(t,n){"true"===e.dataset.loaded&&t();var i,r=e.querySelector("img");r?(r.src&&r.src.length>0&&t(),r.src=null!==(i=r.dataset.src)&&void 0!==i?i:"",r.removeAttribute("data-loaded"),r.addEventListener("load",(function(){e.dataset.loaded="true",t()}))):n()}))},f=new w(document.querySelector(".thumbs-swiper"),{onSlideClick:function(e){v.index=e},slideLoad:d,draggable:l,limitToEdges:o});document.querySelectorAll(".swiper-nav").forEach((function(e){e.style.display=a?"":"none"}));var v=new w(document.querySelector(".swiper-demo"),{slideClassName:"swiper-slide",draggable:l,onSlideClick:function(e){v.index=e,console.log("slide click : "+e)},navigation:a?{next:document.querySelector(".swiper-nav[data-direction=next]")?[document.querySelector(".swiper-nav[data-direction=next]")]:void 0,prev:document.querySelector(".swiper-nav[data-direction=prev]")?[document.querySelector(".swiper-nav[data-direction=prev]")]:void 0}:void 0,slideStart:0,auto:s?1500:void 0,onSlideChange:function(e){c&&(c.textContent=e)},slideLoad:d,linkedSwipers:u?[f]:void 0,limitToEdges:o});return[v,f]}};document.addEventListener("DOMContentLoaded",(function(){document.querySelectorAll("input[type=checkbox]").forEach((function(e){e.addEventListener("change",(function(){E.forEach((function(e){e.stop()}));var e=x();E=e||[]}))}));var e=x();E=e||[]}))})();