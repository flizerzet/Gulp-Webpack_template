'use strict'

/*===========================================*/
//---Connecting modules

import * as modules from './components/modules.js'

/*===========================================*/
//---Smooth scroll to an anchor

// import smoothscroll from 'smoothscroll-polyfill';
// modules.smoothScroll();

/*===========================================*/
//---Fixing header

// modules.addFixedHeader();

/*===========================================*/
//---Menu

// modules.menuInit();

/*===========================================*/
//---Spoilers

// Для родителя слойлеров пишем атрибут data-spollers
// Для заголовков слойлеров пишем атрибут data-spoller
// Если нужно включать\выключать работу спойлеров на разных размерах экранов
// пишем параметры ширины и типа брейкпоинта.
// Например:
// data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
// data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

// Если нужно что бы в блоке открывался только один слойлер добавляем атрибут data-one-spoller

// modules.spollersInit();

// Подключить модули анимации (в самом конце)

/*===========================================*/
//---Tabs

// modules.tabsInit();

/*===========================================*/
//---Dynamic adaptive

// HTML data-da="where(uniq class name),position(digit),when(breakpoint)"
// e.x. data-da="item,2,992"

// modules.daInit();

/*===========================================*/
//---Show more

// modules.showMore();

// Подключить модули анимации (в самом конце)

/*===========================================*/
//---Select

// const select = new modules.Select('.select', {
// 	placeholder: 'Выбери пожалуйста элемент',
// 	selectedId: '2',
// 	data: [
// 	  {id: '1', value: 'React'},
// 	  {id: '2', value: 'Angular'},
// 	  {id: '3', value: 'Vue'},
// 	  {id: '4', value: 'React Native'},
// 	  {id: '5', value: 'Next'},
// 	  {id: '6', value: 'Nest'}
// 	],
// 	onSelect(item) {
// 	  console.log('Selected Item', item)
// 	}
// })

// window.s = select;

/*===========================================*/
//---Quantity

// modules.quantityInit();

/*===========================================*/
//---Range line

// modules.progressInit() // <- получить элемент

/*===========================================*/
//---Star rating

// modules.starRatingInit();

/*===========================================*/
//---Dynamic links

// modules.dynamicLinks();

/*===========================================*/
//---Countdown

// modules.initCountdown(parent, to);

/*===========================================*/
//---Theme switcher

// modules.initSwitcher();

/*===========================================*/
//---Вспомогательные функции анимаций (для spoilers, showMore)

// modules._slideDown();
// modules._slideToggle();
// modules._slideUp();

/*===========================================*/
//---Основной скрипт

import './components/script.js'