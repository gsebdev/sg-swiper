import { SwipeSession } from "./SwipeSession";
import { SwiperState } from "./SwipeState";

export interface SwiperSlide {
  element: HTMLElement;
  id: string;
  position: number;
  width: number;
  loaded: boolean;
}
export interface NavigationElements {
  next?: HTMLElement[] | null;
  prev?: HTMLElement[] | null;
}

export interface SwiperInterface {
  start(index?: number): void;
  stop(): void;
  index: number;
  slideClick?: (index: number, element: HTMLElement) => void;
}
