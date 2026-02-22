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
        opacity: 0.35
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Outer slower ring
    var outerGeo = new THREE.IcosahedronGeometry(2.4, 0);
    var outerMat = new THREE.MeshBasicMaterial({
        color: 0x788b9f,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    var outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.003;
        mesh.rotation.y += 0.005;
        outerMesh.rotation.x -= 0.001;
        outerMesh.rotation.y -= 0.002;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
