// Mobile menu: open/close, swap the icon, close on link tap or Escape
(function () {
	const hamburger = document.querySelector('.hamburger');
	const mobileMenu = document.querySelector('.mobile-menu');
	if (!hamburger || !mobileMenu) return;

	const icon = hamburger.querySelector('span');

	function setOpen(open) {
		mobileMenu.classList.toggle('is-open', open);
		document.body.classList.toggle('menu-open', open);
		hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
		hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
		icon.textContent = open ? 'close' : 'menu';
	}

	hamburger.addEventListener('click', () => {
		setOpen(!mobileMenu.classList.contains('is-open'));
	});

	mobileMenu.querySelectorAll('a').forEach((link) => {
		link.addEventListener('click', () => setOpen(false));
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') setOpen(false);
	});

	// Leaving mobile width with the menu open: reset it
	window.addEventListener('resize', () => {
		if (window.innerWidth >= 870) setOpen(false);
	});

	setOpen(false);
})();
