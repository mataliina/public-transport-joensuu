export const setCookie = (name, value, days) => {
	const date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // days until expire
	const expires = 'expires=' + date.toUTCString();
	const valueToStore = Array.isArray(value) ? value.join(',') : value;
	document.cookie = name + '=' + encodeURIComponent(valueToStore) + ';' + expires + ';path=/';
};

export const getCookie = (name) => {
	const nameEQ = name + '=';
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
};
