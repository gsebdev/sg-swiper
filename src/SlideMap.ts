import { SwiperSlide } from "./interfaces/Swiper";

export default class SlideMap extends Map<string, SwiperSlide> {
    _allSlidesLoaded: boolean = false;
    _firstKey: string | undefined
    _lastKey: string | undefined
    /**
   * Retrieves the slide given the index position.
   */
    getSlideByIndex = (index: number): [string, SwiperSlide] | null => {
        for (const [id, slide] of this.entries()) {
            if (index === slide.index) {
                return [id, slide];
            }
        }
        return null;
    }
    
    getSlidesScrollWidth = (): number => {
        const { width, position } = Array.from(this.values()).pop() ?? {};
        return width && position ? width + position : 0;
    }

    updateSlideDimensions = (id: string, args?: {width?: number, position?: number}) => {
        const slide = this.get(id)
        if(slide) {
            slide.width = args?.width ?? slide.element.offsetWidth;
            slide.position = args?.position ?? slide.element.offsetLeft;
        }
    }

    set(id: string, slide: SwiperSlide) {
        if(this.entries.length === 0) {
            this._firstKey = id;
        }
        super.set(id, slide);
        this._lastKey = id;
        return this;
    }

    delete(key: string): boolean {
        const deleted = super.delete(key);
        if(deleted) {
            Array.from(this.keys())
            this._lastKey = Array.from(this.keys()).pop();
            this._firstKey = Array.from(this.keys())[0];
        }
        return deleted
    }

    /**
     * getter to know if all slides are loaded.
     */
    get allSlidesLoaded(): boolean {
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
    get last(): SwiperSlide | undefined {
        if(this._lastKey === undefined) {
            return;
        }
        return this.get(this._lastKey);
    }

    get first(): SwiperSlide | undefined {
        if(this._firstKey === undefined) {
            return;
        }
        return this.get(this._firstKey);
    }
}