export interface SwiperState {
  currentIndex: number;
  currentPosition: number;
  initialized: boolean;
  swiperWidth: number;
  slidesWrapperWidth: number;
  slidesLoaded: boolean;
  fixedTranslate: boolean | number;
}
