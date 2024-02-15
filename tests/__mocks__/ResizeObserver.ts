class ResizeObserver {
    _entries: any = []
    _callback;

    constructor(callback) {
        this._callback = callback;
        window.addEventListener('resize', this.fireResizeEvent.bind(this));
    }
    observe(entry: HTMLElement) {
        this._entries.push({
            target: entry,
            contentRect: {
                width: entry.offsetWidth,
                height: entry.offsetHeight
            },
            contentBoxSize: [{
                inlineSize: entry.clientWidth,
                blockSize: entry.clientHeight
            }],
            devicePixelContentBoxSize: [{
                inlineSize: entry.clientWidth,
                blockSize: entry.clientHeight
            }],
            borderBoxSize: [{
                inlineSize: entry.offsetWidth,
                blockSize: entry.offsetHeight
            }]
        });
    }
    unobserve() {
        // console.log("unobserve")
    }
    disconnect() {
        this._entries = [];
    }

    fireResizeEvent = () => {
        for( const entry of this._entries ) {
            entry.contentRect.width = entry.target.offsetWidth
            entry.contentRect.height = entry.target.offsetHeight
            entry.contentBoxSize[0].inlineSize = entry.target.clientWidth
            entry.contentBoxSize[0].blockSize = entry.target.clientHeight
            entry.devicePixelContentBoxSize[0].inlineSize = entry.target.clientWidth
            entry.devicePixelContentBoxSize[0].blockSize = entry.target.clientHeight
            entry.borderBoxSize[0].inlineSize = entry.target.offsetWidth
            entry.borderBoxSize[0].blockSize = entry.target.offsetHeight
        }

        this._callback(this._entries)
    }

    get entries() { return this._entries }
}

function addResizeObserver() {
    window.ResizeObserver = ResizeObserver
}
export default addResizeObserver;