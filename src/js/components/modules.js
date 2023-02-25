const body = document.body;


//---Проверка браузера

(function () {
	let currentBrowser;

	if (navigator.userAgent.indexOf("Firefox") > -1) {
		currentBrowser = "firefox";
	} else if (navigator.userAgent.indexOf("Opera") > -1) {
		currentBrowser = "opera";
	} else if (navigator.userAgent.indexOf("Trident") > -1) {
		currentBrowser = "explorer";
	} else if (navigator.userAgent.indexOf("Edge") > -1) {
		currentBrowser = "edge";
	} else if (navigator.userAgent.indexOf("Chrome") > -1) {
		currentBrowser = "chrome";
	} else if (navigator.userAgent.indexOf("Safari") > -1) {
		currentBrowser = "safari";
	} else {
		currentBrowser = "unknown";
	}

	console.log("You are using: " + currentBrowser);

	document.documentElement.classList.add(currentBrowser)
})();

//---Is Mobile

let isMobile = {
	Android: function () { return navigator.userAgent.match(/Android/i); },
	BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); },
	iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
	Opera: function () { return navigator.userAgent.match(/Opera Mini/i); },
	Windows: function () { return navigator.userAgent.match(/IEMobile/i); },
	any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); }
};

(function checkMobile() {
	if (isMobile.any()) { document.documentElement.classList.add('_mobile'); }
})();

//---WEBP

(function isWebp() {
	function testWebP(callback) {
		var webP = new Image();
		webP.onload = webP.onerror = function () {
			callback(webP.height == 2);
		};
		webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
	}
	testWebP(function (support) {
		if (support === true) {
			document.documentElement.classList.add('_webp');
		} else {
			document.documentElement.classList.add('_no-webp');
		}
	});
})();

//---Smooth scroll

export function smoothScroll() {

	smoothscroll.polyfill();

	const anchors = document.querySelectorAll('a[href*="#"]')

	for (let anchor of anchors) {
		anchor.addEventListener('click', function (e) {
			e.preventDefault()

			const blockID = anchor.getAttribute('href').substring(1)

			document.getElementById(blockID).scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		})
	};
}

//---Fix header

export function addFixedHeader() {
	const header = document.querySelector('.header');
	let lastScroll = 0;

	function fixHeader() {
		const body = document.body;
		const currentScroll = window.scrollY;

		if (currentScroll <= 0) {
			body.classList.remove('_scroll-up')
		}

		if (currentScroll <= header.clientHeight) {
			header.classList.add('_header-default')
		} else {
			header.classList.remove('_header-default')
		}

		if (currentScroll > lastScroll && !body.classList.contains('_scroll-down')) {
			body.classList.remove('_scroll-up')
			body.classList.add('_scroll-down')
		}

		if (currentScroll < lastScroll && body.classList.contains('_scroll-down')) {
			body.classList.add('_scroll-up')
			body.classList.remove('_scroll-down')
		}

		lastScroll = currentScroll
	}

	fixHeader()

	window.addEventListener('scroll', fixHeader);
}

//---Menu

export function menuInit() {
	let burger = document.querySelector('.menu__icon');
	let menu = document.querySelector('.menu');

	if (burger && menu) {
		burger.onclick = () => {
			burger.classList.toggle('_active')
			menu.classList.toggle('_active')
			body.classList.toggle('_locked')
		}

		menu.querySelectorAll('.menu__link').forEach(link => {
			link.addEventListener('click', e => {
				if (e.target.closest('.menu__item')) {
					burger.classList.remove('_active')
					menu.classList.remove('_active')
					body.classList.remove('_locked')
				}
			})
		})
	}
};

//---Modals

export class Modal {
	constructor(selector, triggers) {
		this.modal = document.querySelector(selector);
		this.triggers = document.querySelectorAll(triggers) || null;

		this.modal.classList.add('_modal-init');

		this.triggerOpen()
		this.closeOnEsc()
		this.closeOnEmptySpace()

		this.init()
	}

	init() {
		console.log(`Modal initialised: ${this.modal.classList}`)
	}

	open() {
		this.modal.classList.add('_active')
		document.body.classList.add('_locked')
	}

	close() {
		this.modal.classList.remove('_active')
		document.body.classList.remove('_locked')
	}

	triggerOpen() {
		this.triggers.forEach(trigger => {
			trigger.addEventListener('click', () => this.open())
		})
	}

	closeOnEsc() {
		window.addEventListener('keydown', e => {
			if (e.key === "Escape" && this.modal.classList.contains('_active')) {
				this.close()
			}
		})
	}

	closeOnEmptySpace() {
		this.modal.addEventListener('click', e => {
			if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close') || e.target.classList.contains('modal-bg')) {
				this.modal.classList.remove('_active');
				document.body.classList.remove('_locked');
			}
		})
	}
}

//---Spoilers

export function spollersInit() {
	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabIndex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabIndex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
			}
		}
		// Закрытие при клике вне спойлера
		const spollersClose = document.querySelectorAll('[data-spoller-close]');
		if (spollersClose.length) {
			document.addEventListener("click", function (e) {
				const el = e.target;
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
						spollerClose.classList.remove('_spoller-active');
						_slideUp(spollerClose.nextElementSibling, spollerSpeed);
					});
				}
			});
		}
	}
}

//--- Вспомогательные модули для анимации объектов

export let _slideUp = (target, duration = 500, showMore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showMore ? `${showMore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.hidden = !showMore ? true : false;
			!showMore ? target.style.removeProperty('height') : null;
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			!showMore ? target.style.removeProperty('overflow') : null;
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Создаем событие 
			document.dispatchEvent(new CustomEvent("slideUpDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
export let _slideDown = (target, duration = 500, showMore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.hidden = target.hidden ? false : null;
		showMore ? target.style.removeProperty('height') : null;
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = showMore ? `${showMore}px` : `0px`;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = "height, margin, padding";
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
			// Создаем событие 
			document.dispatchEvent(new CustomEvent("slideDownDone", {
				detail: {
					target: target
				}
			}));
		}, duration);
	}
}
export let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//---Tabs

export function tabsInit() {
	let tabs = document.querySelectorAll("._tabs");
	for (let index = 0; index < tabs.length; index++) {
		let tab = tabs[index];
		let tabs_items = tab.querySelectorAll("._tabs-link");
		let tabs_blocks = tab.querySelectorAll("._tabs-content");
		for (let index = 0; index < tabs_items.length; index++) {
			let tabs_item = tabs_items[index];
			tabs_item.addEventListener("click", function (e) {
				for (let index = 0; index < tabs_items.length; index++) {
					let tabs_item = tabs_items[index];
					tabs_item.classList.remove('_active');
					tabs_blocks[index].classList.remove('_active');
				}
				tabs_item.classList.add('_active');
				tabs_blocks[index].classList.add('_active');
				e.preventDefault();
			});
		}
	}
}

//---Dynamic adaptive

export function daInit() {
	"use strict";

	(function () {
		let originalPositions = [];
		let daElements = document.querySelectorAll('[data-da]');
		let daElementsArray = [];
		let daMatchMedia = [];
		//Заполняем массивы
		if (daElements.length > 0) {
			let number = 0;
			for (let index = 0; index < daElements.length; index++) {
				const daElement = daElements[index];
				const daMove = daElement.getAttribute('data-da');
				if (daMove != '') {
					const daArray = daMove.split(',');
					const daPlace = daArray[1] ? daArray[1].trim() : 'last';
					const daBreakpoint = daArray[2] ? daArray[2].trim() : '767';
					const daType = daArray[3] === 'min' ? daArray[3].trim() : 'max';
					const daDestination = document.querySelector('.' + daArray[0].trim())
					if (daArray.length > 0 && daDestination) {
						daElement.setAttribute('data-da-index', number);
						//Заполняем массив первоначальных позиций
						originalPositions[number] = {
							"parent": daElement.parentNode,
							"index": indexInParent(daElement)
						};
						//Заполняем массив элементов 
						daElementsArray[number] = {
							"element": daElement,
							"destination": document.querySelector('.' + daArray[0].trim()),
							"place": daPlace,
							"breakpoint": daBreakpoint,
							"type": daType
						}
						number++;
					}
				}
			}
			dynamicAdaptSort(daElementsArray);

			//Создаем события в точке брейкпоинта
			for (let index = 0; index < daElementsArray.length; index++) {
				const el = daElementsArray[index];
				const daBreakpoint = el.breakpoint;
				const daType = el.type;

				daMatchMedia.push(window.matchMedia("(" + daType + "-width: " + daBreakpoint + "px)"));
				daMatchMedia[index].addListener(dynamicAdapt);
			}
		}
		//Основная функция
		function dynamicAdapt(e) {
			for (let index = 0; index < daElementsArray.length; index++) {
				const el = daElementsArray[index];
				const daElement = el.element;
				const daDestination = el.destination;
				const daPlace = el.place;
				const daBreakpoint = el.breakpoint;
				const daClassName = "_dynamic_adapt_" + daBreakpoint;

				if (daMatchMedia[index].matches) {
					//Перебрасываем элементы
					if (!daElement.classList.contains(daClassName)) {
						let actualIndex = indexOfElements(daDestination)[daPlace];
						if (daPlace === 'first') {
							actualIndex = indexOfElements(daDestination)[0];
						} else if (daPlace === 'last') {
							actualIndex = indexOfElements(daDestination)[indexOfElements(daDestination).length];
						}
						daDestination.insertBefore(daElement, daDestination.children[actualIndex]);
						daElement.classList.add(daClassName);
					}
				} else {
					//Возвращаем на место
					if (daElement.classList.contains(daClassName)) {
						dynamicAdaptBack(daElement);
						daElement.classList.remove(daClassName);
					}
				}
			}
			//customAdapt();
		}

		//Вызов основной функции
		dynamicAdapt();

		//Функция возврата на место
		function dynamicAdaptBack(el) {
			const daIndex = el.getAttribute('data-da-index');
			const originalPlace = originalPositions[daIndex];
			const parentPlace = originalPlace['parent'];
			const indexPlace = originalPlace['index'];
			const actualIndex = indexOfElements(parentPlace, true)[indexPlace];
			parentPlace.insertBefore(el, parentPlace.children[actualIndex]);
		}
		//Функция получения индекса внутри родителя
		function indexInParent(el) {
			var children = Array.prototype.slice.call(el.parentNode.children);
			return children.indexOf(el);
		}
		//Функция получения массива индексов элементов внутри родителя 
		function indexOfElements(parent, back) {
			const children = parent.children;
			const childrenArray = [];
			for (let i = 0; i < children.length; i++) {
				const childrenElement = children[i];
				if (back) {
					childrenArray.push(i);
				} else {
					//Исключая перенесенный элемент
					if (childrenElement.getAttribute('data-da') == null) {
						childrenArray.push(i);
					}
				}
			}
			return childrenArray;
		}
		//Сортировка объекта
		function dynamicAdaptSort(arr) {
			arr.sort(function (a, b) {
				if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
			});
			arr.sort(function (a, b) {
				if (a.place > b.place) { return 1 } else { return -1 }
			});
		}
		//Дополнительные сценарии адаптации
		function customAdapt() {
			//const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		}
	}());
};

//--- Show more

export function showMore() {
	window.addEventListener("load", function (e) {
		const showMoreBlocks = document.querySelectorAll('[data-showMore]');
		let showMoreBlocksRegular;
		let mdQueriesArray;
		if (showMoreBlocks.length) {
			// Получение обычных объектов
			showMoreBlocksRegular = Array.from(showMoreBlocks).filter(function (item, index, self) {
				return !item.dataset.showMoreMedia;
			});
			// Инициализация обычных объектов
			showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;

			document.addEventListener("click", showMoreActions);
			window.addEventListener("resize", showMoreActions);

			// Получение объектов с медиа запросами
			mdQueriesArray = dataMediaQueries(showMoreBlocks, "showMoreMedia");
			if (mdQueriesArray && mdQueriesArray.length) {
				mdQueriesArray.forEach(mdQueriesItem => {
					// Событие
					mdQueriesItem.matchMedia.addEventListener("change", function () {
						initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
					});
				});
				initItemsMedia(mdQueriesArray);
			}
		}
		function initItemsMedia(mdQueriesArray) {
			mdQueriesArray.forEach(mdQueriesItem => {
				initItems(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		function initItems(showMoreBlocks, matchMedia) {
			showMoreBlocks.forEach(showMoreBlock => {
				initItem(showMoreBlock, matchMedia);
			});
		}
		function initItem(showMoreBlock, matchMedia = false) {
			showMoreBlock = matchMedia ? showMoreBlock.item : showMoreBlock;
			let showMoreContent = showMoreBlock.querySelectorAll('[data-showMore-content]');
			let showMoreButton = showMoreBlock.querySelectorAll('[data-showMore-button]');
			showMoreContent = Array.from(showMoreContent).filter(item => item.closest('[data-showMore]') === showMoreBlock)[0];
			showMoreButton = Array.from(showMoreButton).filter(item => item.closest('[data-showMore]') === showMoreBlock)[0];
			const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
			if (matchMedia.matches || !matchMedia) {
				if (hiddenHeight < getOriginalHeight(showMoreContent)) {
					_slideUp(showMoreContent, 0, hiddenHeight);
					showMoreButton.hidden = false;
				} else {
					_slideDown(showMoreContent, 0, hiddenHeight);
					showMoreButton.hidden = true;
				}
			} else {
				_slideDown(showMoreContent, 0, hiddenHeight);
				showMoreButton.hidden = true;
			}
		}
		function getHeight(showMoreBlock, showMoreContent) {
			let hiddenHeight = 0;
			const showMoreType = showMoreBlock.dataset.showMore ? showMoreBlock.dataset.showMore : 'size';
			if (showMoreType === 'items') {
				const showMoreTypeValue = showMoreContent.dataset.showMoreContent ? showMoreContent.dataset.showMoreContent : 3;
				const showMoreItems = showMoreContent.children;
				for (let index = 1; index < showMoreItems.length; index++) {
					const showMoreItem = showMoreItems[index - 1];
					hiddenHeight += showMoreItem.offsetHeight;
					if (index == showMoreTypeValue) break
				}
			} else {
				const showMoreTypeValue = showMoreContent.dataset.showMoreContent ? showMoreContent.dataset.showMoreContent : 150;
				hiddenHeight = showMoreTypeValue;
			}
			return hiddenHeight;
		}
		function getOriginalHeight(showMoreContent) {
			let parentHidden;
			let hiddenHeight = showMoreContent.offsetHeight;
			showMoreContent.style.removeProperty('height');
			if (showMoreContent.closest(`[hidden]`)) {
				parentHidden = showMoreContent.closest(`[hidden]`);
				parentHidden.hidden = false;
			}
			let originalHeight = showMoreContent.offsetHeight;
			parentHidden ? parentHidden.hidden = true : null;
			showMoreContent.style.height = `${hiddenHeight}px`;
			return originalHeight;
		}
		function showMoreActions(e) {
			const targetEvent = e.target;
			const targetType = e.type;
			if (targetType === 'click') {
				if (targetEvent.closest('[data-showMore-button]')) {
					const showMoreButton = targetEvent.closest('[data-showMore-button]');
					const showMoreBlock = showMoreButton.closest('[data-showMore]');
					const showMoreContent = showMoreBlock.querySelector('[data-showMore-content]');
					const showMoreSpeed = showMoreBlock.dataset.showMoreButton ? showMoreBlock.dataset.showMoreButton : '500';
					const hiddenHeight = getHeight(showMoreBlock, showMoreContent);
					if (!showMoreContent.classList.contains('_slide')) {
						showMoreBlock.classList.contains('_showMore-active') ? _slideUp(showMoreContent, showMoreSpeed, hiddenHeight) : _slideDown(showMoreContent, showMoreSpeed, hiddenHeight);
						showMoreBlock.classList.toggle('_showMore-active');
					}
				}
			} else if (targetType === 'resize') {
				showMoreBlocksRegular && showMoreBlocksRegular.length ? initItems(showMoreBlocksRegular) : null;
				mdQueriesArray && mdQueriesArray.length ? initItemsMedia(mdQueriesArray) : null;
			}
		}
	});
}

//---Select

const getTemplate = (data = [], placeholder, selectedId) => {
	let text = placeholder ?? 'Placeholder по умолчанию'

	const items = data.map(item => {
		let cls = ''
		if (item.id === selectedId) {
			text = item.value
			cls = '_selected'
		}
		return `
		<li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
	  `
	})

	return `
	  <div class="select__value" data-type="input">
		<span data-type="value">${text}</span>
		<div class="select__icon _icon-dropdown"></div>
	  </div>
	  <div class="select__dropdown">
		<ul class="select__list">
		  ${items.join('')}
		</ul>
	  </div>
	`
}

export class Select {
	constructor(selector, options) {
		this.$el = document.querySelector(selector)
		this.options = options
		this.selectedId = options.selectedId

		this.#render()
		this.#setup()
	}

	#render() {
		const { placeholder, data } = this.options
		this.$el.classList.add('select')
		this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
	}

	#setup() {
		this.clickHandler = this.clickHandler.bind(this)
		this.$el.addEventListener('click', this.clickHandler)
		this.$value = this.$el.querySelector('[data-type="value"]')
	}

	clickHandler(event) {
		const { type } = event.target.dataset

		if (event.target.closest('.select__value')) {
			this.toggle()
		} else if (type === 'item') {
			const id = event.target.dataset.id
			this.select(id)
		} else if (type === 'backdrop') {
			this.close()
		}
	}

	get isOpen() {
		return this.$el.classList.contains('_select-open')
	}

	get current() {
		return this.options.data.find(item => item.id === this.selectedId)
	}

	select(id) {
		this.selectedId = id
		this.$value.textContent = this.current.value

		this.$el.querySelectorAll('[data-type="item"]').forEach(el => {
			el.classList.remove('_selected')
		})
		this.$el.querySelector(`[data-id="${id}"]`).classList.add('_selected')

		this.options.onSelect ? this.options.onSelect(this.current) : null

		this.close()
	}

	toggle() {
		this.isOpen ? this.close() : this.open()
	}

	open() {
		this.$el.classList.add('_select-open')
	}

	close() {
		this.$el.classList.remove('_select-open')
	}

	destroy() {
		this.$el.removeEventListener('click', this.clickHandler)
		this.$el.innerHTML = ''
	}
}

//---Quantity

export function counterInit() {
	const counters = document.querySelectorAll('[data-counter]');

	if (counters) {
		counters.forEach(counter => {
			counter.addEventListener('click', e => {
				const target = e.target;

				if (target.closest('.counter__button')) {
					if (target.closest('[data-counter]').querySelector('input').value == '' && (target.classList.contains('counter__button_minus') || target.classList.contains('counter__button_plus'))) {
						target.closest('[data-counter]').querySelector('input').value = 0;
					}

					let value = parseInt(target.closest('[data-counter]').querySelector('input').value);

					if (target.classList.contains('counter__button_plus')) {
						value++;
					} else {
						--value;
					}

					if (value <= 0) {
						value = '';
						target.closest('[data-counter]').querySelector('.counter__button_minus').classList.add('disabled')
					} else {
						target.closest('[data-counter]').querySelector('.counter__button_minus').classList.remove('disabled')
					}

					target.closest('[data-counter]').querySelector('input').value = value;
				}
			})
		})
	}
}

//---Range line

export function progressInit(slider) {
	console.log(slider);
	slider.nextElementSibling.style.width = slider.value / (slider.max / 100) + '%';
	slider.addEventListener('input', () => {
		slider.nextElementSibling.style.width = slider.value / (slider.max / 100) + '%';
	})
}

//---Star rating
export function starRatingInit() {
	const ratings = document.querySelectorAll('.rating');
	if (ratings.length > 0) {
		initRatings();
	}
	// Основная функция
	function initRatings() {
		let ratingActive, ratingValue;
		// "Бегаем" по всем рейтингам на странице
		for (let index = 0; index < ratings.length; index++) {
			const rating = ratings[index];
			initRating(rating);
		}
		// Инициализируем конкретный рейтинг
		function initRating(rating) {
			initRatingVars(rating);

			setRatingActiveWidth();

			if (rating.classList.contains('rating_set')) {
				setRating(rating);
			}
		}
		// Инициализация переменных
		function initRatingVars(rating) {
			ratingActive = rating.querySelector('.rating__active');
			ratingValue = rating.querySelector('.rating__value');
		}
		// Изменяем ширину активных звезд
		function setRatingActiveWidth(index = ratingValue.innerHTML) {
			const ratingActiveWidth = index / 0.05;
			ratingActive.style.width = `${ratingActiveWidth}%`;
		}
		// Возможность указать оценку 
		function setRating(rating) {
			const ratingItems = rating.querySelectorAll('.rating__item');
			for (let index = 0; index < ratingItems.length; index++) {
				const ratingItem = ratingItems[index];
				ratingItem.addEventListener("mouseenter", function (e) {
					// Обновление переменных
					initRatingVars(rating);
					// Обновление активных звезд
					setRatingActiveWidth(ratingItem.value);
				});
				ratingItem.addEventListener("mouseleave", function (e) {
					// Обновление активных звезд
					setRatingActiveWidth();
				});
				ratingItem.addEventListener("click", function (e) {
					// Обновление переменных
					initRatingVars(rating);

					if (rating.dataset.ajax) {
						// "Отправить" на сервер
						setRatingValue(ratingItem.value, rating);
					} else {
						// Отобразить указанную оценку
						ratingValue.innerHTML = index + 1;
						setRatingActiveWidth();
					}
				});
			}
		}
		async function setRatingValue(value, rating) {
			if (!rating.classList.contains('rating_sending')) {
				rating.classList.add('rating_sending');

				// Отправка данных (value) на сервер
				let response = await fetch('rating.json', {
					method: 'GET',

					//body: JSON.stringify({
					//	userRating: value
					//}),
					//headers: {
					//	'content-type': 'application/json'
					//}

				});
				if (response.ok) {
					const result = await response.json();

					// Получаем новый рейтинг
					const newRating = result.newRating;

					// Вывод нового среднего результата
					ratingValue.innerHTML = newRating;

					// Обновление активных звезд
					setRatingActiveWidth();

					rating.classList.remove('rating_sending');
				} else {
					alert("Ошибка");

					rating.classList.remove('rating_sending');
				}
			}
		}
	}
}

// Processing media queries from attributes
export function dataMediaQueries(array, dataSetValue) {
	// Получение объектов с медиа запросами
	const media = Array.from(array).filter(function (item, index, self) {
		if (item.dataset[dataSetValue]) {
			return item.dataset[dataSetValue].split(",")[0];
		}
	});
	// Инициализация объектов с медиа запросами
	if (media.length) {
		const breakpointsArray = [];
		media.forEach(item => {
			const params = item.dataset[dataSetValue];
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});
		// Получаем уникальные брейкпоинты
		let mdQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mdQueries = uniqArray(mdQueries);
		const mdQueriesArray = [];

		if (mdQueries.length) {
			// Работаем с каждым брейкпоинтом
			mdQueries.forEach(breakpoint => {
				const paramsArray = breakpoint.split(",");
				const mediaBreakpoint = paramsArray[1];
				const mediaType = paramsArray[2];
				const matchMedia = window.matchMedia(paramsArray[0]);
				// Объекты с нужными условиями
				const itemsArray = breakpointsArray.filter(function (item) {
					if (item.value === mediaBreakpoint && item.type === mediaType) {
						return true;
					}
				});
				mdQueriesArray.push({
					itemsArray,
					matchMedia
				})
			});
			return mdQueriesArray;
		}
	}
}

//---dynamic links
export function dynamicLinks() {
	let options = {
		root: null,
		threshold: .5,
	}

	const observer = new IntersectionObserver((entries, observer) => {
		// для каждой записи-целевого элемента
		entries.forEach(entry => {
			// если элемент является наблюдаемым
			if (entry.isIntersecting) {
				const blockID = entry.target.getAttribute('id');

				document.querySelectorAll(`a[href*="#"]`).forEach(link => link.classList.remove('_active'))
				document.querySelector(`a[href="#${blockID}"]`).classList.add('_active')
			}
		})
	}, options)

	let sections = document.querySelectorAll('._observe');
	sections.forEach(section => {
		observer.observe(section)
	})
}

//---Countdown
export function initCountdown(parent, to) {
	let decCache = [];
	let decCases = [2, 0, 1, 1, 1, 2];
	function decOfNum(number, titles) {
		if (!decCache[number]) decCache[number] = number % 100 > 4 && number % 100 < 20 ? 2 : decCases[Math.min(number % 10, 5)];
		return titles[decCache[number]];
	}

	let timer;
	parent && to ? timer = setInterval(countdown, 1000) : null;

	function countdown() {
		let toCountDate;
		to ? toCountDate = new Date(to) : console.error('Countdown error: no toCountDate mentioned');
		let currentDate = new Date();

		let totalSeconds = Math.floor((toCountDate - currentDate) / 1000);

		const seconds = totalSeconds % 60;
		const minutes = Math.floor((totalSeconds / 60) % 60);
		const hours = Math.floor((totalSeconds / 3600) % 24);
		const days = Math.floor((totalSeconds / 86400));

		const rootElements = document.querySelectorAll(parent);

		if (rootElements.length > 0) {
			rootElements.forEach(root => {
				if (days > 0 && root.querySelector('._days')) {
					root.querySelector('._days .num').textContent = days;
					root.querySelector('._days .name').textContent = decOfNum(days, ['день', 'дня', 'дней']);
				} else {
					root.querySelector('._days').style.display = 'none';
				}

				if (root.querySelector('._hours')) {
					root.querySelector('._hours .num').textContent = hours;
					root.querySelector('._hours .name').textContent = decOfNum(hours, ['час', 'часа', 'часов']);
				}

				if (root.querySelector('._minutes')) {
					root.querySelector('._minutes .num').textContent = minutes;
					root.querySelector('._minutes .name').textContent = decOfNum(minutes, ['минута', 'минуты', 'минут']);
				}

				if (root.querySelector('._seconds')) {
					root.querySelector('._seconds .num').textContent = seconds;
					root.querySelector('._seconds .name').textContent = decOfNum(seconds, ['секунда', 'секунды', 'секунд']);
				}

				if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
					clearInterval(timer)

					root.textContent = 'Timer ended'
				}
			})
		} else {
			console.error('Countdown error: no parent mentioned')
		}
	}
	countdown()
}

//---Theme switcher

export function initSwitcher() {
	const switcher = document.querySelector('.switcher');

	let colorScheme = localStorage.getItem('color-scheme');

	if (colorScheme) {
		switcher.querySelector(`.switcher__radio--${colorScheme}`).checked = true;
		document.documentElement.classList.add(`_${colorScheme}`)
	}

	function setAuto() {
		document.documentElement.classList.remove('_light', '_dark');
		localStorage.removeItem('color-scheme');
	}

	function setTheme(theme) {
		document.documentElement.classList.remove('_light', '_dark');
		document.documentElement.classList.add(`_${theme}`)
		localStorage.setItem('color-scheme', theme)
	}

	switcher.addEventListener('click', event => {
		console.log(event.target.value);
		if (event.target.value === 'auto') {
			setAuto();
		} else {
			setTheme(event.target.value);
		}
	})
}