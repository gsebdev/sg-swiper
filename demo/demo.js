(()=>{"use strict";function e(t){return e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},e(t)}function t(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,s)}return i}function i(e){for(var i=1;i<arguments.length;i++){var s=null!=arguments[i]?arguments[i]:{};i%2?t(Object(s),!0).forEach((function(t){r(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):t(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}function s(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var i=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=i){var s,n,l,r,o=[],a=!0,d=!1;try{if(l=(i=i.call(e)).next,0===t){if(Object(i)!==i)return;a=!1}else for(;!(a=(s=l.call(i)).done)&&(o.push(s.value),o.length!==t);a=!0);}catch(e){d=!0,n=e}finally{try{if(!a&&null!=i.return&&(r=i.return(),Object(r)!==r))return}finally{if(d)throw n}}return o}}(e,t)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var i=Object.prototype.toString.call(e).slice(8,-1);return"Object"===i&&e.constructor&&(i=e.constructor.name),"Map"===i||"Set"===i?Array.from(e):"Arguments"===i||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i)?n(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var i=0,s=new Array(t);i<t;i++)s[i]=e[i];return s}function l(e,t){for(var i=0;i<t.length;i++){var s=t[i];s.enumerable=s.enumerable||!1,s.configurable=!0,"value"in s&&(s.writable=!0),Object.defineProperty(e,o(s.key),s)}}function r(e,t,i){return(t=o(t))in e?Object.defineProperty(e,t,{value:i,enumerable:!0,configurable:!0,writable:!0}):e[t]=i,e}function o(t){var i=function(t,i){if("object"!=e(t)||!t)return t;var s=t[Symbol.toPrimitive];if(void 0!==s){var n=s.call(t,"string");if("object"!=e(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t);return"symbol"==e(i)?i:String(i)}var a=function(){function e(t){var i=this,s=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),r(this,"_state",{currentIndex:0,currentPosition:0,initialized:!1,swiperWidth:0,slidesLoaded:!0}),r(this,"_swipeSession",{active:!1,type:"mouse",startX:0,startTime:0,velocity:0,isClick:!1,deltaX:0,lastEvent:null,lastEventDeltaX:0,lastEventVelocity:0,direction:0}),r(this,"_indexChangeCallback",null),r(this,"_navigationElements",{}),r(this,"_childrenSwipers",null),r(this,"_slideClassName",null),r(this,"_swiperElement",null),r(this,"_breakpoint",null),r(this,"_auto",null),r(this,"_slides",[]),r(this,"_slideCount",0),r(this,"_draggable",!1),r(this,"_slideLoad",null),r(this,"_slideClick",null),r(this,"_activeSessionEventListeners",{mouse:[["mousemove",this._handleMove.bind(this)],["mouseup",this._handleRelease.bind(this)]],touch:[["touchmove",this._handleMove.bind(this)],["touchend",this._handleRelease.bind(this)],["touchcancel",this._handleRelease.bind(this)]]}),t){var n,l,o,a,d,h,c,u,_;this._swiperElement=t,s&&(this._indexChangeCallback=null!==(n=s.onSlideChange)&&void 0!==n?n:null,this._auto=null!==(l=s.auto)&&void 0!==l?l:null,this._slideClassName=null!==(o=s.slideClassName)&&void 0!==o?o:null,this._navigationElements=null!==(a=s.navigation)&&void 0!==a?a:{},this._childrenSwipers=null!==(d=s.linkedSwipers)&&void 0!==d?d:null,this._breakpoint=null!==(h=s.breakpoint)&&void 0!==h?h:null,this._slideLoad=null!==(c=s.slideLoad)&&void 0!==c?c:null,this._slideClick=null!==(u=s.onSlideClick)&&void 0!==u?u:null,this._state.slidesLoaded=!s.slideLoad,this._draggable=null!==(_=s.draggable)&&void 0!==_&&_);var v=this._slideClassName?this._swiperElement.querySelectorAll("."+this._slideClassName):this._swiperElement.children;0!==v.length?(this._slidesWrapper=v[0].parentElement,this._slides=Array.from(v).map((function(e){var t;return{id:e.id?e.id:(t="slide-"+Math.random().toString(36).substring(2,15),e.id=t,t),element:e,position:0,width:0,loaded:!i._slideLoad||"false"!==e.dataset.loaded}})),this._slideCount=this._slides.length,this._eventListeners=[[this._swiperElement,"mouseover",this._handleHover.bind(this)],[window,"resize",this._getDimensions.bind(this)]],this._draggable&&this._eventListeners.push([this._swiperElement,"mousedown",this._handlePush.bind(this)],[this._swiperElement,"touchstart",this._handlePush.bind(this)]),this.start(null==s?void 0:s.slideStart)):console.error("Cannot initialize Swiper: no slides found.")}else console.error("Cannot initialize Swiper: no element provided.")}var t,n;return t=e,n=[{key:"start",value:function(e){var t=this;!this._state.initialized&&this._swiperElement&&(!this._breakpoint||window.innerWidth<this._breakpoint)&&(this._getDimensions(),this._eventListeners.forEach((function(e){var t=s(e,3),i=t[0],n=t[1],l=t[2];null==i||i.addEventListener(n,l,{passive:!0})})),this._slides.forEach((function(e,i){var s=e.element;s.addEventListener("click",(function(e){t._handleSlideClick(e,s,i)}))})),this._navigationElements.prev&&this._navigationElements.prev.forEach((function(e){e.addEventListener("click",t._handlePrevClick.bind(t))})),this._navigationElements.next&&this._navigationElements.next.forEach((function(e){e.addEventListener("click",t._handleNextClick.bind(t))})),this._state.initialized=!0,this._setIndex(null!=e?e:0),this._auto&&(this._autoInterval=setInterval((function(){t._slides[t._state.currentIndex].loaded&&t._handleNextClick()}),this._auto)))}},{key:"_handleHover",value:function(){clearInterval(this._autoInterval)}},{key:"_handlePrevClick",value:function(){var e=this._state.currentIndex-1<0?this._slideCount-1:this._state.currentIndex-1;this._setIndex(e)}},{key:"_handleNextClick",value:function(){var e=this._state.currentIndex+1>this._slideCount-1?0:this._state.currentIndex+1;this._setIndex(e)}},{key:"_handleSlideClick",value:function(e,t,i){e.preventDefault(),!this._swipeSession.isClick&&this._draggable||!this._slideClick||this._slideClick(i,t)}},{key:"_getDimensions",value:function(){var e,t;this._state.swiperWidth=null!==(e=null===(t=this._swiperElement)||void 0===t?void 0:t.offsetWidth)&&void 0!==e?e:0,this._slides=this._slides.map((function(e){return i(i({},e),{},{width:e.element.offsetWidth,position:e.element.offsetLeft})})),this._state.initialized&&this._slides[this._state.currentIndex]&&this._translate((this._state.swiperWidth-this._slides[this._state.currentIndex].width)/2-this._slides[this._state.currentIndex].position)}},{key:"stop",value:function(){var e=this;this._eventListeners.forEach((function(e){var t=s(e,3),i=t[0],n=t[1],l=t[2];null==i||i.removeEventListener(n,l)})),this._slides.forEach((function(t,i){var s=t.element;s.removeEventListener("click",(function(t){e._handleSlideClick(t,s,i)}))})),this._navigationElements.prev&&this._navigationElements.prev.forEach((function(t){t.removeEventListener("click",e._handlePrevClick.bind(e))})),this._navigationElements.next&&this._navigationElements.next.forEach((function(t){t.removeEventListener("click",e._handleNextClick.bind(e))})),this._translate(0),this._state.initialized=!1}},{key:"_translate",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;this._slidesWrapper&&(this._slidesWrapper.style.transform="translate3d(".concat(e,"px, 0, 0)"),t&&(this._slidesWrapper.style.transition="".concat(t,"ms cubic-bezier(.08,.5,.2,1) transform"))),this._state.currentPosition=e}},{key:"_handlePush",value:function(e){var t,i;null===(t=this._swiperElement)||void 0===t||t.focus(),null===(i=window.getSelection())||void 0===i||i.removeAllRanges(),this._swipeSession={active:!0,type:"mousedown"===e.type?"mouse":"touch",startX:"mousedown"===e.type?e.clientX:e.touches[0].clientX,startTime:e.timeStamp,velocity:0,isClick:!1,deltaX:0,lastEvent:e,lastEventDeltaX:0,lastEventVelocity:0,direction:0},this._activeSessionEventListeners[this._swipeSession.type].forEach((function(e){var t=s(e,2),i=t[0],n=t[1];document.addEventListener(i,n,{passive:!0})})),this._triggerEvent("push")}},{key:"_handleRelease",value:function(){this._swipeSession.active=!1,this._activeSessionEventListeners[this._swipeSession.type].forEach((function(e){var t=s(e,2),i=t[0],n=t[1];document.removeEventListener(i,n)})),this._swipeSession.deltaX<5&&this._swipeSession.lastEvent.timeStamp-this._swipeSession.startTime<200&&(this._swipeSession.isClick=!0),this._triggerEvent("release")}},{key:"_triggerEvent",value:function(e){if("release"===e&&this._setIndex(this._state.currentIndex),"move"===e){var t=this._state.currentPosition+this._swipeSession.lastEventDeltaX;this._translate(t);var i=this._getIndexByPosition(-t);i>-1&&this._setIndex(i,!1)}"push"===e&&"touch"===this._swipeSession.type&&this._handleHover()}},{key:"_handleMove",value:function(e){if(this._swipeSession.active){var t=this._swipeSession,i=t.type,s=t.startX,n=t.lastEvent,l="mouse"===i?e.clientX:e.touches[0].clientX,r="mouse"===i?n.clientX:n.touches[0].clientX;this._swipeSession.lastEvent=e,this._swipeSession.deltaX=l-s,this._swipeSession.velocity=this._swipeSession.deltaX/(e.timeStamp-this._swipeSession.startTime),this._swipeSession.lastEventDeltaX=l-r,this._swipeSession.lastEventVelocity=0===this._swipeSession.lastEventDeltaX?this._swipeSession.lastEventVelocity:this._swipeSession.lastEventDeltaX/(e.timeStamp-n.timeStamp),this._swipeSession.direction=Math.sign(this._swipeSession.lastEventDeltaX),this._triggerEvent("move")}}},{key:"_setIndex",value:function(e){var t,i,s,n,l=this,r=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(!this._state.slidesLoaded&&this._slideLoad&&this._slideLoad(null===(s=this._slides[e])||void 0===s?void 0:s.element).then((function(){l._slides[e].loaded=!0,l._checkIfAllLoaded(),!l._state.slidesLoaded&&l._slides[e+1]&&l._slideLoad(l._slides[e+1].element).then((function(){l._slides[e+1].loaded=!0,l._checkIfAllLoaded()}))})).catch((function(e){console.error(e)})),r&&this._slides[e]&&this._translate((this._state.swiperWidth-this._slides[e].width)/2-this._slides[e].position,500),null===(t=this._slides[e])||void 0===t||t.element.classList.add("is-active"),null===(i=this._swiperElement)||void 0===i||i.classList.remove("is-first","is-last"),0===e)null===(n=this._swiperElement)||void 0===n||n.classList.add("is-first");else if(e===this._slideCount-1){var o;null===(o=this._swiperElement)||void 0===o||o.classList.add("is-last")}e!==this._state.currentIndex&&(this._slides[this._state.currentIndex].element.classList.remove("is-active"),this._state.currentIndex=e,this._indexChangeCallback&&this._indexChangeCallback(e),this._childrenSwipers&&this._childrenSwipers.forEach((function(t){t.index=e})))}},{key:"_getIndexByPosition",value:function(e){return this._slides.findIndex((function(t){return t.position+t.width/2>e&&e>t.position-t.width/2}))}},{key:"_checkIfAllLoaded",value:function(){this._state.slidesLoaded=this._slides.every((function(e){return e.loaded}))}},{key:"index",get:function(){return this._state.currentIndex},set:function(e){this._setIndex(e)}},{key:"slideClick",set:function(e){this._slideClick=e}}],n&&l(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}();document.addEventListener("DOMContentLoaded",(function(){document.querySelector(".swiper-demo")&&new a(document.querySelector(".swiper-demo"),{slideClassName:"swiper-slide",draggable:!0})}))})();