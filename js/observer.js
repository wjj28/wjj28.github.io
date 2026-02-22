// Section fade-in via IntersectionObserver
(function () {
    var fadeTargets = document.querySelectorAll('.fade-in');

    if (fadeTargets.length === 0) return;

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    fadeTargets.forEach(function (el) {
        observer.observe(el);
    });
})();
