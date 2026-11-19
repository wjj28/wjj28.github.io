var options = {
  strings: [
    "Tech Enthusiast",
    "Computer Scientist",
    "Community Builder",
    "Data-Driven CS",
    "Pythonista <i class=\"fab fa-python\"></i>",
    "Football fan <i class=\"fas fa-futbol\"></i>"
  ],
  typeSpeed: 100,
  backSpeed: 50,
  loop: true
};

var typed = new Typed('.auto_typed', options);

// Surprise box inside the globe: one curiosity at a time.
// A mouse resting on it pauses the flow; clicking moves on.
(function () {
  var box = document.querySelector('.hero-art');
  var facts = document.querySelectorAll('.globe-fact');
  if (!box || facts.length < 2) return;

  var INTERVAL = 9500;
  var current = 0;
  var timer = null;
  var paused = false;

  function start() {
    clearInterval(timer);
    if (paused) return;
    timer = setInterval(function () { go(current + 1); }, INTERVAL);
  }

  function go(i) {
    current = (i + facts.length) % facts.length;
    facts.forEach(function (fact, n) { fact.classList.toggle('is-on', n === current); });
    if (buddy) act(facts[current]);
    start();
  }

  // The little character: sits on top of my name, jumps down to the ground,
  // then runs over to the globe to present the curiosities. Every position
  // is measured from the page, so it follows the layout on any screen.
  var buddy = document.getElementById('buddy');
  var hero = document.querySelector('.hero');
  var title = document.querySelector('.hero-title');
  var nameMark = title ? title.querySelector('span') : null;
  var spot = 'sit';             // 'sit' -> 'ground' -> 'globe'
  var flipped = false;          // facing left while running leftwards
  var SIT_TIME = 2800;
  var JUMP_TIME = 750;
  var LAND_TIME = 650;
  var WALK_TIME = 2200;

  function buddyScale() {
    return parseFloat(getComputedStyle(buddy).getPropertyValue('--k')) || 1;
  }

  // top-left corner of the character for each spot
  function spotPosition(which) {
    var k = buddyScale();
    var base = hero.getBoundingClientRect();
    var width = 64 * k;
    var titleBox = title.getBoundingClientRect();
    var mark = (nameMark || title).getBoundingClientRect();
    var art = box.getBoundingClientRect();
    var stacked = art.top > titleBox.bottom + 40;       // phone: globe sits below the text
    var fontSize = parseFloat(getComputedStyle(title).fontSize);

    // seat (hips) on the top edge of the letters, legs dangling over them
    var sit = {
      x: mark.left + mark.width / 2 - base.left - width / 2,
      y: titleBox.top - base.top + fontSize * 0.1 - 68 * k
    };
    // standing next to the globe; on wide screens the feet are level with the foot of the name
    var globe = stacked
      ? { x: art.left - base.left - 6, y: art.top - base.top }
      : { x: art.left - base.left - width * 0.3, y: titleBox.bottom - base.top - 98 * k };
    // where the jump lands: straight down from the name, on the same ground line
    var ground = { x: stacked ? sit.x : sit.x + width * 1.6, y: globe.y };

    var at = which === 'sit' ? sit : which === 'ground' ? ground : globe;
    return {
      x: Math.max(2, Math.min(at.x, base.width - width - 2)) + hero.scrollLeft,
      y: at.y + hero.scrollTop,
      k: k,
      width: width
    };
  }

  function placeBuddy() {
    if (!buddy) return;
    var at = spotPosition(spot);
    buddy.style.transform = flipped
      ? 'translate(' + Math.round(at.x + at.width) + 'px,' + Math.round(at.y) + 'px) scale(' + -at.k + ',' + at.k + ')'
      : 'translate(' + Math.round(at.x) + 'px,' + Math.round(at.y) + 'px) scale(' + at.k + ')';
  }

  // What the character does to bring up each curiosity: kick a ball, drop a
  // basketball, pull the cable, open a book. Others get a hop and the gift box.
  var ACTS = ['kick', 'shark', 'drop', 'cable', 'book'];

  function act(fact) {
    ACTS.forEach(function (name) { buddy.classList.remove('act-' + name); });
    buddy.classList.remove('is-hop');
    if (!buddy.classList.contains('is-presenting')) return;

    // where the thing lands, in the character's own coordinates
    var k = buddyScale();
    var stage = fact.querySelector('.gift-stage').getBoundingClientRect();
    var me = buddy.getBoundingClientRect();
    var tx = (stage.left + stage.width / 2 - me.left) / k;
    var ty = (stage.top + stage.height / 2 - me.top) / k;
    buddy.style.setProperty('--tx', tx.toFixed(1) + 'px');
    buddy.style.setProperty('--ty', ty.toFixed(1) + 'px');
    buddy.style.setProperty('--len', Math.hypot(tx - 58, ty - 40).toFixed(1) + 'px');
    buddy.style.setProperty('--ang', Math.atan2(ty - 40, tx - 58).toFixed(3) + 'rad');

    void buddy.offsetWidth;             // restart the animation
    var name = fact.getAttribute('data-act');
    buddy.classList.add(name ? 'act-' + name : 'is-hop');
  }

  function jump() {
    buddy.classList.remove('is-sitting');
    buddy.classList.add('is-jumping');
    spot = 'ground';
    placeBuddy();
    setTimeout(land, JUMP_TIME);
  }

  function land() {
    buddy.classList.remove('is-jumping');
    buddy.classList.add('is-landing');
    setTimeout(run, LAND_TIME);
  }

  function run() {
    buddy.classList.remove('is-landing');
    flipped = spotPosition('globe').x < spotPosition('ground').x;   // face the way we run
    placeBuddy();
    void buddy.offsetWidth;
    buddy.classList.add('is-walking');
    spot = 'globe';
    placeBuddy();
    setTimeout(arrive, WALK_TIME);
  }

  function arrive() {
    buddy.classList.remove('is-walking');
    flipped = false;
    placeBuddy();
    buddy.classList.add('is-presenting');
    go(0);   // first box
  }

  if (buddy) {
    facts.forEach(function (fact) { fact.classList.remove('is-on'); });   // wait for the character
    placeBuddy();
    buddy.classList.add('is-ready', 'is-sitting');
    window.addEventListener('resize', placeBuddy);
    window.addEventListener('load', placeBuddy);
    setTimeout(jump, SIT_TIME);
  }

  // Only a real mouse pauses it; on touch screens it keeps flowing
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    box.addEventListener('mouseenter', function () { paused = true; clearInterval(timer); });
    box.addEventListener('mouseleave', function () { paused = false; start(); });
  }
  box.addEventListener('click', function (event) {
    if (!event.target.closest('a')) go(current + 1);
  });
  if (!buddy) start();
})();
