// Tap/click to flip cards (hover handles it on desktop via CSS).
// On phones the cards are a swipeable row, one full card per screen,
// with dots underneath showing which one you are on.
(function () {
    var grid = document.querySelector('.flip-grid');
    var cards = document.querySelectorAll('.flip');
    if (!grid || !cards.length) return;

    cards.forEach(function (card) {
        card.addEventListener('click', function (event) {
            if (event.target.closest('a')) return;

            cards.forEach(function (other) {
                if (other !== card) other.classList.remove('is-flipped');
            });
            card.classList.toggle('is-flipped');
        });
    });

    var pager = document.createElement('div');
    pager.className = 'flip-pager';
    var dots = [];
    cards.forEach(function (card, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Card ' + (i + 1));
        dot.addEventListener('click', function () {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        pager.appendChild(dot);
        dots.push(dot);
    });
    grid.parentNode.insertBefore(pager, grid.nextSibling);

    function mark() {
        var middle = grid.getBoundingClientRect().left + grid.clientWidth / 2;
        var best = 0;
        var bestGap = Infinity;
        cards.forEach(function (card, i) {
            var rect = card.getBoundingClientRect();
            var gap = Math.abs(rect.left + rect.width / 2 - middle);
            if (gap < bestGap) { bestGap = gap; best = i; }
        });
        dots.forEach(function (dot, i) { dot.classList.toggle('is-on', i === best); });
    }

    grid.addEventListener('scroll', mark, { passive: true });
    window.addEventListener('resize', mark);
    mark();
})();
