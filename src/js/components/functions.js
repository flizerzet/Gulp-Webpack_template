//---Throttle

export const throttle = (fn, ms) => {
	let isThrottled = false;
	let savedArgs;
	let savedThis;

	function wrapper() {
		if (isThrottled) {
			savedArgs = arguments;
			savedThis = this;

			return;
		}

		fn.apply(this, arguments);

		isThrottled = true;

		setTimeout(function () {
			isThrottled = false;

			if (savedArgs) {
				wrapper.apply(savedThis, savedArgs);
				savedArgs = savedThis = null;
			}
		}, ms)
	}

	return wrapper;
}

//---Debounce

export const debounce = (fn, ms) => {
	let timeout;

	return function () {
		const fnCall = () => { fn.apply(this, arguments) }

		clearTimeout(timeout)
		timeout = setTimeout(fnCall, ms)
	}
}

//---День недели

export const getDay = lang => {
	let day;
	if (lang === 'rus') {
		const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

		day = days[new Date().getDay() - 1]
	} else {
		const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

		day = days[new Date().getDay()]
	}

	return day;
}

//---Месяц

export const getMonth = (lang = 'eng', format = 'full') => {
	let month;

	if (format === 'short') {
		if (lang === 'rus') {
			const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июня', 'Июля', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

			month = months[new Date().getMonth()];
		} else {
			const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

			month = months[new Date().getMonth()];
		}
	} else {
		if (lang === 'rus') {
			const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря']

			month = months[new Date().getMonth()];
		} else {
			const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

			month = months[new Date().getMonth()];
		}
	}

	return month;
}

//---Случайное число

export const getRandom = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}