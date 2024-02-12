import { NavigationElements, SwiperInterface } from "./Swiper";

export interface SwiperArgs {
  navigation?: NavigationElements;
  auto?: number;
  slideClassName?: string;
  onSlideChange?: (index: number) => void;
  slideLoad?: (slide: HTMLElement) => Promise<void>;
  onSlideClick?: (index: number, element: HTMLElement) => void;
  linkedSwipers?: SwiperInterface[];
  slideStart?: number;
  draggable?: boolean;
}
