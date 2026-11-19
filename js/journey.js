// About page: a small globe where a plane keeps flying between the places
// I studied and worked. It flies slowly, stops, and shows a work/study badge,
// what I did there and a couple of curiosities (the place, football, Python…).
// The card text lives in about.html (.journey-stop blocks).
(function () {
    var wrap = document.querySelector('.journey');
    var svgEl = document.getElementById('journey-globe');
    var status = document.getElementById('journey-status');
    if (!wrap || !svgEl || !window.d3 || !window.topojson) return;

    var WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
    var SIZE = 320;
    var BASE_SCALE = SIZE / 2 - 12;
    var CY = 132;   // stops sit a little above the centre, leaving room for the info box

    // Map points. dx/dy/anchor only position the label.
    var points = {
        cv: { name: 'Praia', lon: -23.51, lat: 14.93, iso: '132', zoom: 1.3, dx: 0, dy: -11, anchor: 'middle' },
        nj: { name: 'Nanjing', lon: 118.8, lat: 32.06, iso: '156', zoom: 4, dx: -8, dy: -7, anchor: 'end', with: 'sh' },
        sh: { name: 'Shanghai', lon: 121.47, lat: 31.23, iso: '156', zoom: 4, dx: 8, dy: 13, anchor: 'start', with: 'nj' },
        bh: { name: 'Belo Horizonte', lon: -43.94, lat: -19.92, iso: '076', zoom: 1.3, dx: 0, dy: -11, anchor: 'middle' }
    };
    var LEGS = [['cv', 'sh'], ['sh', 'nj'], ['nj', 'bh'], ['port', 'cv']];
    // Legs not done by plane: 'from>to' -> vehicle
    var MODES = { 'sh>nj': 'train', 'bh>cv': 'boat' };

    var pointList = Object.keys(points).map(function (id) {
        points[id].id = id;
        return points[id];
    });

    // One scene per card in about.html, visited in order. Two scenes in a row
    // at the same place (studies, then work) swap the card without a flight.
    var scenes = [];
    wrap.querySelectorAll('.journey-stop').forEach(function (card) {
        scenes.push({
            card: card,
            point: card.getAttribute('data-stop'),
            kind: card.getAttribute('data-kind'),
            title: card.querySelector('.journey-stop-title').textContent,
            facts: card.querySelectorAll('.journey-fact'),
            fact: -1        // last curiosity shown; the next visit continues from it
        });
    });
    if (!scenes.length) return;
    var badge = document.getElementById('journey-badge');
    var ICONS = { work: 'fa-solid fa-briefcase', study: 'fa-solid fa-book' };

    var projection = d3.geoOrthographic()
        .scale(BASE_SCALE * points.cv.zoom)
        .translate([SIZE / 2, CY])
        .clipAngle(90)
        .rotate([-points.cv.lon, -points.cv.lat, 0]);
    var path = d3.geoPath(projection);

    var svg = d3.select(svgEl);
    // Everything is clipped to the globe's disc so zooming in stays round
    svg.append('defs').append('clipPath').attr('id', 'journey-clip')
        .append('circle').attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', BASE_SCALE);
    var root = svg.append('g').attr('clip-path', 'url(#journey-clip)');
    root.append('rect').attr('class', 'globe-sphere').attr('width', SIZE).attr('height', SIZE);
    root.append('path').attr('class', 'globe-graticule').datum(d3.geoGraticule10());
    var landLayer = root.append('g');

    var arcs = root.append('g').selectAll('path')
        .data(LEGS.map(function (leg) {
            var a = leg[0] === 'port' ? { lon: -40.3, lat: -20.3 } : points[leg[0]];
            var b = points[leg[1]];
            return {
                type: 'LineString',
                coordinates: [[a.lon, a.lat], [b.lon, b.lat]],
                mode: leg[0] === 'port' ? 'boat' : (MODES[leg[0] + '>' + leg[1]] || 'plane')
            };
        }))
        .join('path')
        .attr('class', function (d) { return 'globe-arc globe-arc-' + d.mode; });

    var markers = root.append('g').selectAll('g')
        .data(pointList)
        .join('g')
        .attr('class', 'globe-marker')
        .on('click', function (event, d) {
            // go straight to that place; a second click there shows its next card
            var first = -1;
            var after = -1;
            scenes.forEach(function (scene, i) {
                if (scene.point !== d.id) return;
                if (first < 0) first = i;
                if (after < 0 && i > index) after = i;
            });
            if (first < 0) return;
            next(landed === d.id && after >= 0 ? after : first);
        });
    markers.append('circle').attr('class', 'globe-hit').attr('r', 13);
    markers.append('circle').attr('class', 'globe-pulse').attr('r', 8);
    markers.append('circle').attr('class', 'globe-dot').attr('r', 3.5);
    markers.append('text')
        .attr('x', function (d) { return d.dx; })
        .attr('y', function (d) { return d.dy; })
        .attr('text-anchor', function (d) { return d.anchor; })
        .text(function (d) { return d.name; });

    var plane = root.append('g').attr('class', 'globe-plane')
        .attr('transform', 'translate(' + SIZE / 2 + ',' + CY + ')')
        .style('opacity', 0);
    plane.append('path')
        .attr('d', 'M0,-10 L2,-3 L10,3 L10,5 L2,3 L1.5,8 L4,10 L4,11 L0,10 L-4,11 L-4,10 L-1.5,8 L-2,3 L-10,5 L-10,3 L-2,-3 Z');
    // Top-down bullet train for the rail leg
    var train = root.append('g').attr('class', 'globe-plane globe-train')
        .attr('transform', 'translate(' + SIZE / 2 + ',' + CY + ')')
        .style('opacity', 0);
    train.append('path')
        .attr('d', 'M0,-9 C2.8,-9 3.2,-5.5 3.2,-3 L3.2,7.5 Q3.2,9 2,9 L-2,9 Q-3.2,9 -3.2,7.5 L-3.2,-3 C-3.2,-5.5 -2.8,-9 0,-9 Z');
    train.append('path').attr('class', 'globe-train-window').attr('d', 'M-1.6,-4.5 L1.6,-4.5 M-1.6,0 L1.6,0 M-1.6,4.5 L1.6,4.5');
    // Top-down boat for the sea leg
    var boat = root.append('g').attr('class', 'globe-plane globe-boat')
        .attr('transform', 'translate(' + SIZE / 2 + ',' + CY + ')')
        .style('opacity', 0);
    boat.append('path').attr('d', 'M0,-10 C4,-5 4.4,2 3.4,9 L-3.4,9 C-4.4,2 -4,-5 0,-10 Z');
    boat.append('path').attr('class', 'globe-boat-cabin').attr('d', 'M-1.8,-1 L1.8,-1 L1.8,5 L-1.8,5 Z');
    // Small car: Belo Horizonte is inland, so the sea leg starts with a drive to the coast
    var car = root.append('g').attr('class', 'globe-plane globe-car')
        .attr('transform', 'translate(' + SIZE / 2 + ',' + CY + ')')
        .style('opacity', 0);
    car.append('rect').attr('x', -3.2).attr('y', -6).attr('width', 6.4).attr('height', 12).attr('rx', 2.4);
    car.append('rect').attr('class', 'globe-boat-cabin').attr('x', -2.2).attr('y', -2.6).attr('width', 4.4).attr('height', 4.6).attr('rx', 1);
    // Parachute: used when a place is clicked directly
    var chute = root.append('g').attr('class', 'globe-plane globe-chute')
        .attr('transform', 'translate(' + SIZE / 2 + ',' + CY + ')')
        .style('opacity', 0);
    chute.append('path').attr('class', 'globe-chute-lines').attr('d', 'M-13,-18 L0,-1 M13,-18 L0,-1 M0,-18 L0,-1');
    chute.append('path').attr('d', 'M-14,-18 A14,13 0 0 1 14,-18 Q9.5,-21.5 4.7,-18 Q0,-21.5 -4.7,-18 Q-9.5,-21.5 -14,-18 Z');
    chute.append('circle').attr('class', 'globe-chute-rider').attr('r', 3).attr('cy', 1);
    var PORT = [-40.3, -20.3];      // on the coast, east of Belo Horizonte
    var crafts = { plane: plane, train: train, boat: boat };
    var vehicles = root.selectAll('.globe-plane');
    svg.append('circle').attr('class', 'globe-rim')
        .attr('cx', SIZE / 2).attr('cy', SIZE / 2).attr('r', BASE_SCALE);

    var landed = scenes[0].point;   // place whose card is showing (null while flying)
    var index = 0;                  // position in scenes
    var flight = null;              // d3 timer of the current flight
    var wait = null;                // timeout before the next move
    var factWait = null;            // timeout before the second curiosity of a stop
    var FACT_TIME = 5000;           // how long each curiosity stays up
    var paused = false;             // true while a mouse hovers the globe or its box
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function centre() {
        var rotate = projection.rotate();
        return [-rotate[0], -rotate[1]];
    }

    function render() {
        svg.select('.globe-graticule').attr('d', path);
        landLayer.selectAll('path').attr('d', path);
        arcs.attr('d', path);

        var c = centre();
        markers
            .attr('transform', function (d) {
                var xy = projection([d.lon, d.lat]);
                return 'translate(' + xy[0] + ',' + xy[1] + ')';
            })
            .style('display', function (d) {
                return d3.geoDistance(c, [d.lon, d.lat]) > Math.PI / 2 - 0.05 ? 'none' : null;
            })
            .classed('is-active', function (d) {
                return landed && (d.id === landed || d.with === landed);
            });
        landLayer.selectAll('.globe-country').classed('is-active', function (d) {
            return landed && points[landed].iso === d.id;
        });
    }

    // Show one scene's card and its work/study badge on the globe (null = in flight)
    function show(scene) {
        landed = scene ? scene.point : null;
        scenes.forEach(function (other) {
            other.card.classList.toggle('is-current', other === scene);
        });
        wrap.classList.toggle('is-flying', !scene);
        if (badge) {
            badge.classList.remove('is-on');
            if (scene) {
                badge.innerHTML = '<i class="' + (ICONS[scene.kind] || ICONS.work) + '" aria-hidden="true"></i>';
                void badge.offsetWidth;     // restart the pop animation
                badge.classList.add('is-on');
            }
        }
        render();
    }

    // Each stop has a few curiosities; rotate through them across visits.
    function nextFact(scene) {
        if (!scene.facts.length) return;
        scene.fact = (scene.fact + 1) % scene.facts.length;
        scene.facts.forEach(function (fact, i) {
            fact.classList.toggle('is-on', i === scene.fact);
        });
    }

    function schedule(delay) {
        clearTimeout(wait);
        if (paused) return;         // mouse is resting on it: stay on this stop
        wait = setTimeout(next, delay);
    }

    function land(scene) {
        vehicles.interrupt().transition().duration(600).style('opacity', 0);
        show(scene);

        // up to two curiosities per visit, one after the other
        var perVisit = Math.min(2, scene.facts.length);
        clearTimeout(factWait);
        nextFact(scene);
        if (perVisit > 1) {
            factWait = setTimeout(function () { nextFact(scene); }, FACT_TIME);
        }
        var reading = 2500 + scene.card.querySelectorAll('li').length * 1000;
        schedule(Math.max(reading + FACT_TIME, perVisit * FACT_TIME));
    }

    // Move on to the next scene: fly there slowly along the great circle,
    // with the globe following the plane, then stop and show the card.
    function next(jumpTo) {
        clearTimeout(wait);
        clearTimeout(factWait);
        if (flight) {                   // a click interrupted a flight
            flight.stop();
            flight = null;
        }
        var previous = scenes[index].point;
        index = typeof jumpTo === 'number' ? jumpTo : (index + 1) % scenes.length;
        var scene = scenes[index];
        var mode = MODES[previous + '>' + scene.point] || 'plane';
        var craft = crafts[mode];
        var target = points[scene.point];
        var from = centre();
        var to = [target.lon, target.lat];
        var distance = d3.geoDistance(from, to);

        if (reduce || distance < 0.002) {
            projection.rotate([-target.lon, -target.lat, 0]).scale(BASE_SCALE * target.zoom);
            land(scene);
            return;
        }

        var startScale = projection.scale();
        var endScale = BASE_SCALE * target.zoom;
        if (status) status.textContent = scene.title;
        show(null);
        vehicles.interrupt().style('opacity', 0);

        // Clicked directly on a place: the globe spins there and a parachute drops in
        if (typeof jumpTo === 'number') {
            var spin = d3.geoInterpolate(from, to);
            var dropTime = 3200;
            chute.style('opacity', 1);
            flight = d3.timer(function (elapsed) {
                var raw = Math.min(1, elapsed / dropTime);
                var turn = d3.easeCubicInOut(Math.min(1, raw / 0.6));    // globe settles first
                var here = spin(turn);
                projection.rotate([-here[0], -here[1], 0]);
                projection.scale(startScale + (endScale - startScale) * turn);
                render();

                var fall = d3.easeQuadOut(raw);
                var sway = Math.sin(raw * Math.PI * 3) * 9 * (1 - raw);
                chute.attr('transform', 'translate(' + (SIZE / 2 + sway) + ',' + (CY - (1 - fall) * 170) + ') rotate(' + sway * 1.4 + ')');

                if (raw >= 1) {
                    flight.stop();
                    flight = null;
                    land(scene);
                }
            });
            return;
        }

        // The sea leg starts inland: drive to the coast first, then sail
        var DRIVE = 0.12;
        var toPort = mode === 'boat' ? d3.geoInterpolate(from, PORT) : null;
        var along = d3.geoInterpolate(toPort ? PORT : from, to);
        function position(t) {
            if (!toPort) return along(t);
            return t < DRIVE ? toPort(t / DRIVE) : along((t - DRIVE) / (1 - DRIVE));
        }
        var duration = mode === 'train' ? 6000 : mode === 'boat' ? 14000 : Math.max(4500, Math.min(11000, distance * 5200));
        var heading = 0;

        flight = d3.timer(function (elapsed) {
            var raw = Math.min(1, elapsed / duration);
            var t = d3.easeSinInOut(raw);
            var here = position(t);
            // cruise a little zoomed-out, then settle on the destination's zoom
            var cruise = Math.sin(Math.PI * t) * Math.min(startScale, endScale) * 0.05;
            projection.rotate([-here[0], -here[1], 0]);
            projection.scale(startScale + (endScale - startScale) * t - cruise);
            render();

            var current = toPort && t < DRIVE ? car : craft;
            if (current !== car) car.style('opacity', 0);
            current.style('opacity', 1);
            if (t < 0.985) {
                var ahead = projection(position(Math.min(1, t + 0.015)));
                heading = Math.atan2(ahead[0] - SIZE / 2, -(ahead[1] - CY)) * 180 / Math.PI;
            }
            current.attr('transform', 'translate(' + SIZE / 2 + ',' + CY + ') rotate(' + heading + ')');

            if (raw >= 1) {
                flight.stop();
                flight = null;
                land(scene);
            }
        });
    }

    // Dragging pauses the tour; it resumes from wherever the globe was left.
    svg.call(d3.drag().on('start', function () {
        clearTimeout(wait);
        clearTimeout(factWait);
        if (badge) badge.classList.remove('is-on');
        if (flight) {
            flight.stop();
            flight = null;
            index = (index + scenes.length - 1) % scenes.length;   // redo this leg
            vehicles.interrupt().style('opacity', 0);
        }
    }).on('drag', function (event) {
        var rotate = projection.rotate();
        var k = 0.4 * BASE_SCALE / projection.scale();
        var lat = Math.max(-70, Math.min(70, rotate[1] - event.dy * k));
        projection.rotate([rotate[0] + event.dx * k, lat, 0]);
        render();
    }).on('end', function () {
        schedule(2500);
    }));

    // With a mouse: hovering holds the current stop, leaving resumes the tour.
    // Touch screens have no hover, so there the tour just keeps going.
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        wrap.addEventListener('mouseenter', function () {
            paused = true;
            clearTimeout(wait);
        });
        wrap.addEventListener('mouseleave', function () {
            paused = false;
            if (!flight) schedule(1500);
        });
    }

    // Phones: the globe starts as a small round button and pops up over the page
    var fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'journey-fab';
    fab.setAttribute('aria-label', 'Open the map of where I studied and worked');
    fab.innerHTML = '<i class="fas fa-globe-africa" aria-hidden="true"></i>';
    var closer = document.createElement('button');
    closer.type = 'button';
    closer.className = 'journey-close';
    closer.setAttribute('aria-label', 'Close');
    closer.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
    wrap.appendChild(closer);
    document.body.appendChild(fab);

    function setOpen(open) {
        wrap.classList.toggle('is-open', open);
        fab.classList.toggle('is-hidden', open);
    }
    fab.addEventListener('click', function () { setOpen(true); });
    closer.addEventListener('click', function () { setOpen(false); });
    wrap.addEventListener('click', function (event) {
        if (event.target === wrap) setOpen(false);      // tap outside the globe
    });
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') setOpen(false);
    });

    wrap.classList.add('is-live');
    land(scenes[0]);

    d3.json(WORLD_URL).then(function (world) {
        var countries = topojson.feature(world, world.objects.countries).features;
        var wanted = pointList.map(function (point) { return point.iso; });
        landLayer.selectAll('path')
            .data(countries)
            .join('path')
            .attr('class', function (d) {
                return wanted.indexOf(d.id) > -1 ? 'globe-land globe-country' : 'globe-land';
            });
        render();
    }).catch(function () {
        // No map data: the globe outline, markers and cards still work
    });
})();
