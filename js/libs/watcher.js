
function uniqArray(array) {
    return array.filter((function (item, index, self) {
        return self.indexOf(item) === index;
    }));
}
class ScrollWatcher {
    constructor(props) {
        let defaultConfig = {
            logging: true
        };
        this.config = Object.assign(defaultConfig, props);
        this.observer;
        !document.documentElement.classList.contains("watcher") ? this.scrollWatcherRun() : null;
    }
    scrollWatcherUpdate() {
        this.scrollWatcherRun();
    }
    scrollWatcherRun() {
        document.documentElement.classList.add("watcher");
        this.scrollWatcherConstructor(document.querySelectorAll("[data-watch]"));
    }
    scrollWatcherConstructor(items) {
        if (items.length) {
            let uniqParams = uniqArray(Array.from(items).map((function (item) {
                return `${item.dataset.watchRoot ? item.dataset.watchRoot : null}|${item.dataset.watchMargin ? item.dataset.watchMargin : "0px"}|${item.dataset.watchThreshold ? item.dataset.watchThreshold : 0}`;
            })));
            uniqParams.forEach((uniqParam => {
                let uniqParamArray = uniqParam.split("|");
                let paramsWatch = {
                    root: uniqParamArray[0],
                    margin: uniqParamArray[1],
                    threshold: uniqParamArray[2]
                };
                let groupItems = Array.from(items).filter((function (item) {
                    let watchRoot = item.dataset.watchRoot ? item.dataset.watchRoot : null;
                    let watchMargin = item.dataset.watchMargin ? item.dataset.watchMargin : "0px";
                    let watchThreshold = item.dataset.watchThreshold ? item.dataset.watchThreshold : 0;
                    if (String(watchRoot) === paramsWatch.root && String(watchMargin) === paramsWatch.margin && String(watchThreshold) === paramsWatch.threshold) return item;
                }));
                let configWatcher = this.getScrollWatcherConfig(paramsWatch);
                this.scrollWatcherInit(groupItems, configWatcher);
            }));
        }
    }
    getScrollWatcherConfig(paramsWatch) {
        let configWatcher = {};
        if (document.querySelector(paramsWatch.root)) configWatcher.root = document.querySelector(paramsWatch.root); else if ("null" !== paramsWatch.root);
        configWatcher.rootMargin = paramsWatch.margin;
        if (paramsWatch.margin.indexOf("px") < 0 && paramsWatch.margin.indexOf("%") < 0) {
            return;
        }
        if ("prx" === paramsWatch.threshold) {
            paramsWatch.threshold = [];
            for (let i = 0; i <= 1; i += .005) paramsWatch.threshold.push(i);
        } else paramsWatch.threshold = paramsWatch.threshold.split(",");
        configWatcher.threshold = paramsWatch.threshold;
        return configWatcher;
    }
    scrollWatcherCreate(configWatcher) {
        this.observer = new IntersectionObserver(((entries, observer) => {
            entries.forEach((entry => {
                this.scrollWatcherCallback(entry, observer);
            }));
        }), configWatcher);
    }
    scrollWatcherInit(items, configWatcher) {
        this.scrollWatcherCreate(configWatcher);
        items.forEach((item => this.observer.observe(item)));
    }
    scrollWatcherOff(targetElement, observer) {
        observer.unobserve(targetElement);
    }
    scrollWatcherIntersecting(entry, targetElement) {
        if (entry.isIntersecting) {
            !targetElement.classList.contains("_watcher-view") ? targetElement.classList.add("_watcher-view") : null;
        } else {
            targetElement.classList.contains("_watcher-view") ? targetElement.classList.remove("_watcher-view") : null;
        }
    }
    scrollWatcherCallback(entry, observer) {
        const targetElement = entry.target;
        this.scrollWatcherIntersecting(entry, targetElement);
        targetElement.hasAttribute("data-watch-once") && entry.isIntersecting ? this.scrollWatcherOff(targetElement, observer) : null;
        document.dispatchEvent(new CustomEvent("watcherCallback", {
            detail: {
                entry
            }
        }));
    }
}
const scrollWatcher = new ScrollWatcher({});
scrollWatcher.scrollWatcherRun();