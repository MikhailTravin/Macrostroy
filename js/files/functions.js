//Вспомогательные фунции
function uniqArray(array) {
	return array.filter((function (item, index, self) {
		return self.indexOf(item) === index;
	}));
}
function dataMediaQueries(array, dataSetValue) {
	const media = Array.from(array).filter((function (item, index, self) {
		if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
	}));
	if (media.length) {
		const breakpointsArray = [];
		media.forEach((item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		}));
		let mdQueries = breakpointsArray.map((function (item) {
			return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
		}));
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];
		if (mdQueries.length) {
			mdQueries.forEach((breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				const itemsArray = breakpointsArray.filter((function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) return true;
				}));
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				});
			}));
			return mdQueriesArray;
		}
	}
}
let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout((() => {
			target.hidden = !showmore ? true : false;
			!showmore ? target.style.removeProperty("height") : null;
			target.style.removeProperty("padding-top");
			target.style.removeProperty("padding-bottom");
			target.style.removeProperty("margin-top");
			target.style.removeProperty("margin-bottom");
			!showmore ? target.style.removeProperty("overflow") : null;
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("_slide");
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target
				}
			}));
		}), duration);
	}
};
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains("_slide")) {
		target.classList.add("_slide");
		target.hidden = target.hidden ? false : null;
		showmore ? target.style.removeProperty("height") : null;
		let height = target.offsetHeight;
		target.style.overflow = "hidden";
		target.style.height = showmore ? `${showmore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + "ms";
		target.style.height = height + "px";
		target.style.removeProperty("padding-top");
		target.style.removeProperty("padding-bottom");
		target.style.removeProperty("margin-top");
		target.style.removeProperty("margin-bottom");
		window.setTimeout((() => {
			target.style.removeProperty("height");
			target.style.removeProperty("overflow");
			target.style.removeProperty("transition-duration");
			target.style.removeProperty("transition-property");
			target.classList.remove("_slide");
			document.dispatchEvent(new CustomEvent("slideDownDone", {
				detail: {
					target
				}
			}));
		}), duration);
	}
};
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
	if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
};
let bodyUnlock = (delay = 500) => {
	let body = document.querySelector("body");
	const fixBlocks = document.querySelectorAll(".fix-block");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		setTimeout((() => {
			for (let index = 0; index < lock_padding.length; index++) {
				const el = lock_padding[index];
				el.style.paddingRight = "0px";
			}
			body.style.paddingRight = "0px";
			fixBlocks.forEach((el => {
				el.style.paddingRight = "0px";
			}));
			document.documentElement.classList.remove("lock");
		}), delay);
		bodyLockStatus = false;
		setTimeout((function () {
			bodyLockStatus = true;
		}), delay);
	}
};
let bodyLock = (delay = 500) => {
	let body = document.querySelector("body");
	const fixBlocks = document.querySelectorAll(".fix-block");
	if (bodyLockStatus) {
		let lock_padding = document.querySelectorAll("[data-lp]");
		for (let index = 0; index < lock_padding.length; index++) {
			const el = lock_padding[index];
			el.style.paddingRight = window.innerWidth - document.body.offsetWidth + "px";
		}
		body.style.paddingRight = window.innerWidth - document.body.offsetWidth + "px";
		fixBlocks.forEach((el => {
			el.style.paddingRight = window.innerWidth - document.body.offsetWidth + "px";
		}));
		document.documentElement.classList.add("lock");
		bodyLockStatus = false;
		setTimeout((function () {
			bodyLockStatus = true;
		}), delay);
	}
};

//Спойлеры
function spollers() {
	const spollersArray = document.querySelectorAll("[data-spollers]");
	if (spollersArray.length > 0) {
		const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		}));
		if (spollersRegular.length) initSpollers(spollersRegular);
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
			mdQueriesItem.matchMedia.addEventListener("change", (function () {
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			}));
			initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
		}));
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach((spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add("_spoller-init");
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove("_spoller-init");
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			}));
		}
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
				spollerTitles.forEach((spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute("tabindex");
						if (!spollerTitle.classList.contains("_spoller-active")) spollerTitle.nextElementSibling.hidden = true;
					} else {
						spollerTitle.setAttribute("tabindex", "-1");
						spollerTitle.nextElementSibling.hidden = false;
					}
				}));
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest("[data-spoller]")) {
				const spollerTitle = el.closest("[data-spoller]");
				const spollersBlock = spollerTitle.closest("[data-spollers]");
				const columnBlock = spollerTitle.closest(".product-card-tabs__column");
				const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll("._slide").length) {
					if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) hideSpollersBody(spollersBlock);
					if (spollerTitle.classList.contains("_spoller-active")) columnBlock.classList.remove("_active"); else columnBlock.classList.add("_active");
					spollerTitle.classList.toggle("_spoller-active");
					_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
				spollerActiveTitle.classList.remove("_spoller-active");
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
				const columnBlock = spollerActiveTitle.closest(".product-card-tabs__column");
				if (columnBlock) columnBlock.classList.remove("_active");
			}
		}
		const spollersClose = document.querySelectorAll("[data-spoller-close]");
		if (spollersClose.length) document.addEventListener("click", (function (e) {
			const el = e.target;
			if (!el.closest("[data-spollers]")) spollersClose.forEach((spollerClose => {
				const spollersBlock = spollerClose.closest("[data-spollers]");
				const columnBlock = spollerClose.closest(".product-card-tabs__column");
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				spollerClose.classList.remove("_spoller-active");
				_slideUp(spollerClose.nextElementSibling, spollerSpeed);
				if (columnBlock) columnBlock.classList.remove("_active");
			}));
		}));
	}
}
spollers()

//Табы
function tabs() {
	const tabs = document.querySelectorAll("[data-tabs]");
	if (tabs.length > 0) {
		tabs.forEach(((tabsBlock, index) => {
			tabsBlock.classList.add("_tab-init");
			tabsBlock.setAttribute("data-tabs-index", index);
			tabsBlock.addEventListener("click", setTabsAction);
			initTabs(tabsBlock);
		}));
	}
	function initTabs(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-titles]>*");
		let tabsContent = tabsBlock.querySelectorAll("[data-tabs-body]>*");
		if (tabsContent.length) {
			tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
			tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
			tabsContent.forEach(((tabsContentItem, index) => {
				tabsTitles[index].setAttribute("data-tabs-title", "");
				tabsContentItem.setAttribute("data-tabs-item", "");
				tabsContentItem.hidden = !tabsTitles[index].classList.contains("_tab-active");
			}));
		}
	}
	function setTabsStatus(tabsBlock) {
		let tabsTitles = tabsBlock.querySelectorAll("[data-tabs-title]");
		let tabsContent = tabsBlock.querySelectorAll("[data-tabs-item]");
		const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
		function isTabsAnamate(tabsBlock) {
			if (tabsBlock.hasAttribute("data-tabs-animate")) return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
		}
		const tabsBlockAnimate = isTabsAnamate(tabsBlock);
		if (tabsContent.length > 0) {
			tabsContent = Array.from(tabsContent).filter((item => item.closest("[data-tabs]") === tabsBlock));
			tabsTitles = Array.from(tabsTitles).filter((item => item.closest("[data-tabs]") === tabsBlock));
			tabsContent.forEach(((tabsContentItem, index) => {
				if (tabsTitles[index].classList.contains("_tab-active")) {
					if (tabsBlockAnimate) _slideDown(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = false;
				} else if (tabsBlockAnimate) _slideUp(tabsContentItem, tabsBlockAnimate); else tabsContentItem.hidden = true;
			}));
		}
	}
	function setTabsAction(e) {
		const el = e.target;
		if (el.closest("[data-tabs-title]")) {
			const tabTitle = el.closest("[data-tabs-title]");
			const tabsBlock = tabTitle.closest("[data-tabs]");
			if (!tabTitle.classList.contains("_tab-active") && !tabsBlock.querySelector("._slide")) {
				let tabActiveTitle = tabsBlock.querySelectorAll("[data-tabs-title]._tab-active");
				tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item => item.closest("[data-tabs]") === tabsBlock)) : null;
				tabActiveTitle.length ? tabActiveTitle[0].classList.remove("_tab-active") : null;
				tabTitle.classList.add("_tab-active");
				setTabsStatus(tabsBlock);
			}
			e.preventDefault();
		}
	}
}
tabs()

//Меню
function menuInit() {
	if (document.querySelector(".menu__icon")) {
		document.addEventListener("click", function (e) {
			const spollerItems = document.querySelectorAll('.spollers-menu__item');
			if (bodyLockStatus && e.target.closest('.menu__icon')) {
				const isMenuOpen = document.documentElement.classList.toggle("menu-open");

				if (!isMenuOpen) {
					document.documentElement.classList.remove("menu-hovered");
					spollerItems.forEach(item => {
						item.classList.remove("menu-hovered");
					});
				}
				bodyLockToggle();
			}
		});
	}
}
menuInit()