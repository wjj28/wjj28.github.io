const hamburger = document.querySelector('.hamburger');

const hamburger_icon = hamburger.querySelector('span');

const mobile_menu = document.querySelector('.mobile-menu');

console.log(hamburger_icon);

hamburger.addEventListener('click', () => {
	// this.classList.toggle('is-open');
	hamburger_icon.innertText = hamburger_icon.innertText ===
	'menu' ? 'close'
	: 'menu';

	mobile_menu.classList.toggle('is-open');
});