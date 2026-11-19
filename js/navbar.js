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

// Footer icons: dock-style magnify that follows the pointer (mouse or finger).
// Each icon eases towards its target size every frame, so the wave of icons
// glides with the pointer instead of snapping.
function makeDock(footer, list, selector, enabled) {
	if (!footer || !list) return;
	const items = Array.from(list.querySelectorAll(selector)).map((el) => ({ el: el, now: 0, target: 0, centre: 0 }));
	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let frame = null;
	let touch = false;
	let leaveTimer = null;

	function measure() {
		// untransformed centres: offsetLeft ignores the scale we apply
		const origin = list.getBoundingClientRect().left;
		items.forEach((item) => { item.centre = origin + item.el.offsetLeft - list.offsetLeft + item.el.offsetWidth / 2; });
	}

	function aim(x) {
		clearTimeout(leaveTimer);
		if (enabled && !enabled()) return;
		const reach = touch ? 120 : 140;
		items.forEach((item) => {
			const d = Math.min(1, Math.abs(x - item.centre) / reach);
			item.target = (Math.cos(d * Math.PI) + 1) / 2;      // 1 under the pointer, easing to 0
		});
		run();
	}

	function relax() {
		items.forEach((item) => { item.target = 0; });
		run();
	}

	function run() {
		if (frame === null) frame = requestAnimationFrame(step);
	}

	function step() {
		frame = null;
		let moving = false;
		const grow = touch ? 0.85 : 0.65;
		const lift = touch ? 34 : 14;
		items.forEach((item) => {
			const gap = item.target - item.now;
			item.now = reduce || Math.abs(gap) < 0.002 ? item.target : item.now + gap * 0.13;
			if (item.now !== item.target) moving = true;
			const scale = 1 + grow * item.now;
			item.el.style.transform = item.now ? 'translateY(' + (-lift * item.now).toFixed(2) + 'px) scale(' + scale.toFixed(3) + ')' : '';
			item.el.style.zIndex = item.now > 0.5 ? '2' : '';
		});
		list.classList.toggle('is-docking', items.some((item) => item.now > 0.02));
		if (moving) run();
	}

	function onMove(event) {
		touch = event.pointerType === 'touch' || event.pointerType === 'pen';
		aim(event.clientX);
	}

	measure();
	window.addEventListener('resize', measure);
	window.addEventListener('load', measure);
	footer.addEventListener('pointerenter', measure);
	footer.addEventListener('pointerdown', (event) => { measure(); onMove(event); });
	footer.addEventListener('pointermove', onMove);
	footer.addEventListener('pointerleave', relax);
	footer.addEventListener('pointercancel', relax);
	footer.addEventListener('pointerup', (event) => {
		if (event.pointerType !== 'mouse') leaveTimer = setTimeout(relax, 450);   // let the finger see it
	});
}

// the social icons in the footer
makeDock(document.querySelector('footer'), document.querySelector('footer .social_icons'), '.social_icon_item');
// the two round icon buttons on the home page (only while they are icons, i.e. on phones)
makeDock(document.querySelector('.hero-actions'), document.querySelector('.hero-actions'), 'a', function () {
	return window.matchMedia('(max-width: 900px)').matches;
});
