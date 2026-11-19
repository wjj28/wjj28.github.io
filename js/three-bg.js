(function () {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    var renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Wireframe icosahedron
    var geometry = new THREE.IcosahedronGeometry(1.5, 1);
    var material = new THREE.MeshBasicMaterial({
        color: 0xe3ba6a,
        wireframe: true,
        transparent: true,
        opacity: 0.22
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Outer slower ring
    var outerGeo = new THREE.IcosahedronGeometry(2.4, 0);
    var outerMat = new THREE.MeshBasicMaterial({
        color: 0x788b9f,
        wireframe: true,
        transparent: true,
        opacity: 0.1
    });
    var outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // Keep the globe in the right-hand column instead of behind the text
    var anchor = document.querySelector('.hero-art');

    function place() {
        var halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
        var halfW = halfH * camera.aspect;
        var x = 0;
        var y = 0;
        var scale = 1;

        if (anchor) {
            var rect = anchor.getBoundingClientRect();
            x = ((rect.left + rect.width / 2) / window.innerWidth * 2 - 1) * halfW;
            y = -((rect.top + rect.height / 2) / window.innerHeight * 2 - 1) * halfH;
            var radius = (Math.min(rect.width, rect.height) / window.innerHeight) * halfH;
            scale = (radius * 0.95) / 1.5;
        }

        mesh.position.set(x, y, 0);
        outerMesh.position.set(x, y, 0);
        mesh.scale.setScalar(scale);
        outerMesh.scale.setScalar(scale);
    }

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        outerMesh.rotation.x -= 0.001;
        outerMesh.rotation.y -= 0.002;
        renderer.render(scene, camera);
    }

    place();
    animate();

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        place();
    });
    window.addEventListener('scroll', place, { passive: true });
    var scroller = document.querySelector('.hero');     // the page scrolls inside this
    if (scroller) scroller.addEventListener('scroll', place, { passive: true });
    window.addEventListener('load', place);
})();
