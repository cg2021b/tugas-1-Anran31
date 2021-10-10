import * as THREE from './js/three.module.js';
import * as dat from './jsm/libs/dat.gui.module.js'
import {OrbitControls} from './jsm/controls/OrbitControls.js';


let scene, camera, renderer, controls, cube, cone, cylinder, dodecahedron;
let icosahedron, octahedron, torus, torusknot, tetrahedron;

const gui = new dat.GUI()

const threeTone = new THREE.TextureLoader().load('./gradientMaps/threeTone.jpg');
threeTone.minFilter = THREE.NearestFilter;
threeTone.magFilter = THREE.NearestFilter;

const fiveTone = new THREE.TextureLoader().load('./gradientMaps/fiveTone.jpg');
fiveTone.minFilter = THREE.NearestFilter;
fiveTone.magFilter = THREE.NearestFilter;

let createCube = function () {
        let geometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
        // let material = new THREE.MeshBasicMaterial({color: 0x00a1cb});
        let material = new THREE.MeshPhongMaterial({
                color: 'red',
        });
        cube = new THREE.Mesh(geometry, material);
        cube.position.x = -1;
        cube.position.y = 0.75;
        // let wireframe = new THREE.WireframeGeometry(geometry);

        // let line = new THREE.LineSegments(wireframe);
        scene.add(cube);
        // scene.add(line);
};

let createCone = function () {
        let geometry = new THREE.ConeGeometry(0.15, 0.25);
        let material = new THREE.MeshBasicMaterial({
                color: 0xa1a1cb,
        });
        cone = new THREE.Mesh(geometry, material);
        cone.position.x = 0;
        cone.position.y = 0.75;
        scene.add(cone);
};

let createCylinder = function () {
        let geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.25, 30);
        let material = new THREE.MeshLambertMaterial({
                color: 0x29143,
                wireframe: true,
        });
        cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.x = 1;
        cylinder.position.y = 0.75;
        scene.add(cylinder);
};

let createDodecahedron = function () {
        let geometry = new THREE.DodecahedronGeometry(0.15);
        let material = new THREE.MeshNormalMaterial({
                wireframe : true,
        });
        dodecahedron = new THREE.Mesh(geometry, material);
        dodecahedron.position.x = -1;
        dodecahedron.position.y = 0;
        scene.add(dodecahedron);
};

let createIcosahedron = function () {
        let geometry = new THREE.IcosahedronGeometry(0.15);
        let material = new THREE.MeshStandardMaterial({
                color : 0xa1ba1d
        });
        icosahedron = new THREE.Mesh(geometry, material);
        icosahedron.position.x = 0;
        icosahedron.position.y = 0;
        scene.add(icosahedron);
};

let createOctahedron = function () {
        let geometry = new THREE.OctahedronGeometry(0.15);
        let material = new THREE.MeshToonMaterial({
                color: 0xa1ba1d,
                gradientMap: threeTone
        });
        octahedron = new THREE.Mesh(geometry, material);
        octahedron.position.x = 1;
        octahedron.position.y = 0;
        scene.add(octahedron);
};

let createTorus = function () {
        let geometry = new THREE.TorusGeometry(0.15, 0.05, 16, 100);
        let material = new THREE.MeshLambertMaterial({
                color: 0x29143,
        });
        torus = new THREE.Mesh(geometry, material);
        torus.position.x = -1;
        torus.position.y = -0.75;
        scene.add(torus);
};

let createTorusKnot = function () {
        let geometry = new THREE.TorusKnotGeometry(0.15, 0.05, 100, 16);
        let material = new THREE.MeshToonMaterial({
                color: 0x049EF4,
                gradientMap: fiveTone
        });

        torusknot = new THREE.Mesh(geometry, material);
        torusknot.position.x = 0;
        torusknot.position.y = -0.75;
        scene.add(torusknot);
};

let createTetrahedron = function () {
        let geometry = new THREE.TetrahedronGeometry(0.15);
        let material = new THREE.MeshPhysicalMaterial({
                color: 0x9b1818,
        });
        tetrahedron = new THREE.Mesh(geometry, material);
        tetrahedron.position.x = 1;
        tetrahedron.position.y = -0.75;
        scene.add(tetrahedron);
};

// set up the environment - 
// initiallize scene, camera, objects and renderer
let init = function () {
        // 1. create the scene
        scene = new THREE.Scene();
        const ambientLight = new THREE.AmbientLight(0x000000); // soft white light
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 0);
        pointLight.position.set(0, 0, -1);
        scene.add(pointLight);
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.15);
        scene.add(pointLightHelper);
        
        const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
        scene.add(hemiLight);
        const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight);
        scene.add(hemiLightHelper);

        const spotLight = new THREE.SpotLight(0xffffff, 3, 5, 0.2);
        spotLight.position.set(-2.75,-1.25, 0);
        spotLight.target.position.set(1, 0, 0);
        spotLight.target.updateMatrixWorld();
        scene.add(spotLight);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
        
        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
        scene.add(directionalLight);
        const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
        scene.add(directionalLightHelper);

        ambientLight.visible = false;
        pointLight.visible = false;
        hemiLight.visible = false;
        spotLight.visible = false;
        directionalLight.visible = false;
        
        pointLightHelper.visible = false;
        hemiLightHelper.visible = false;
        spotLightHelper.visible = false;
        directionalLightHelper.visible = false;

        const ambientLightFolder = gui.addFolder('Ambient Light');
        ambientLightFolder.add(ambientLight, 'visible');

        const pointLightFolder = gui.addFolder('Point Light');
        pointLightFolder.add(pointLight, 'visible');
        pointLightFolder.add(pointLight.position, 'x').min(-3).max(3).step(0.1);
        pointLightFolder.add(pointLight.position, 'y').min(-3).max(3).step(0.1);
        pointLightFolder.add(pointLight.position, 'z').min(-3).max(3).step(0.1);
        pointLightFolder.add(pointLight, 'intensity').min(0).max(10).step(0.1);

        const pointLightHelperFolder = pointLightFolder.addFolder('Point Light Helper');
        pointLightHelperFolder.add(pointLightHelper, 'visible');

        const hemiLightFolder = gui.addFolder('Hemisphere Light');
        hemiLightFolder.add(hemiLight, 'visible');
        hemiLightFolder.add(hemiLight.position, 'x').min(-3).max(3).step(0.1);
        hemiLightFolder.add(hemiLight.position, 'y').min(-3).max(3).step(0.1);
        hemiLightFolder.add(hemiLight.position, 'z').min(-3).max(3).step(0.1);
        hemiLightFolder.add(hemiLight, 'intensity').min(0).max(10).step(0.1);

        const hemiLightHelperFolder = hemiLightFolder.addFolder('Hemisphere Light Helper');
        hemiLightHelperFolder.add(hemiLightHelper, 'visible');

        const spotLightFolder = gui.addFolder('Spotlight');
        spotLightFolder.add(spotLight, 'visible');
        spotLightFolder.add(spotLight, 'intensity').min(0).max(10).step(0.01);
        spotLightFolder.add(spotLight, 'distance').min(0).max(10).step(0.01).onChange(() => {
                spotLightHelper.update();
        });
        spotLightFolder.add(spotLight, 'angle').min(-1.7).max(1.7).step(0.01).onChange(() => {
                spotLightHelper.update();
        });
        spotLightFolder.add(spotLight.position, 'x').min(-3).max(3).step(0.01).onChange(() => {
                spotLightHelper.update();
        }).name("Position x");
        spotLightFolder.add(spotLight.position, 'y').min(-3).max(3).step(0.01).onChange(() => {
                spotLightHelper.update();
        }).name("Position y");
        spotLightFolder.add(spotLight.position, 'z').min(-3).max(3).step(0.01).onChange(() => {
                spotLightHelper.update();
        }).name("Position z");
        spotLightFolder.add(spotLight.target.position, 'x').min(-3).max(3).step(0.01).onChange(() => {
                spotLightHelper.update();
                spotLight.target.updateMatrixWorld();
        }).name("Target Position x");
        spotLightFolder.add(spotLight.target.position, 'y').min(-3).max(3).step(0.01).onChange(() => {
                spotLightHelper.update();
                spotLight.target.updateMatrixWorld();
        }).name("Target Position y");
        spotLightFolder.add(spotLight.target.position, 'z').min(-3).max(3).step(0.01).onChange(() => {
                spotLightHelper.update();
                spotLight.target.updateMatrixWorld();
        }).name("Target Position z");
        const spotLightHelperFolder = spotLightFolder.addFolder('Spotlight Helper');
        spotLightHelperFolder.add(spotLightHelper, 'visible');

        const directionalLightFolder = gui.addFolder('Directional Light');
        directionalLightFolder.add(directionalLight, 'visible');
        directionalLightFolder.add(directionalLight.position, 'x').min(-3).max(3).step(0.1);
        directionalLightFolder.add(directionalLight.position, 'y').min(-3).max(3).step(0.1);
        directionalLightFolder.add(directionalLight.position, 'z').min(-3).max(3).step(0.1);
        directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.1);
        const directionalLightHelperFolder = directionalLightFolder.addFolder('Directional Light Helper');
        directionalLightHelperFolder.add(directionalLightHelper, 'visible');
        
        scene.background = new THREE.Color(0xababab);
        
        // 2. create an locate the camera       
        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight,
                1, 1000);
                camera.position.z = 6;
                // 3. create an locate the object on the scene           
                // ...
                createCube();
        createCone();
        createCylinder();
        createDodecahedron();
        createIcosahedron();
        createOctahedron();
        createTorus();
        createTorusKnot();
        createTetrahedron();
        // 4. create the renderer     
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        document.body.appendChild(renderer.domElement);
        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.target.set(0, 0, 0);
        controls.update();
        
        const controlFolder = gui.addFolder('Orbit Control');
        controlFolder.add(controls, 'autoRotate');
};


// main animation loop - calls 50-60 in a second.
let change_pos = 0;
let speed_pos = 0.005,
speed_rot = 0.005;
let mainLoop = function () {
        
        cube.rotation.x += -speed_rot;
        cube.rotation.y += -speed_rot;
        cube.position.x -= speed_pos / 4;
        cube.position.y += speed_pos / 4;
        
        cone.rotation.x += speed_rot;
        cone.rotation.y += speed_rot;
        cone.position.y += speed_pos / 4;
        
        cylinder.rotation.x += -speed_rot;
        cylinder.rotation.y += -speed_rot;
        cylinder.position.x += speed_pos / 4;
        cylinder.position.y += speed_pos / 4;
        
        dodecahedron.rotation.x += speed_rot;
        dodecahedron.rotation.y += speed_rot;
        dodecahedron.position.x -= speed_pos / 4;
        
        icosahedron.rotation.x += -speed_rot;
        icosahedron.rotation.y += -speed_rot;

        octahedron.rotation.x += speed_rot;
        octahedron.rotation.y += speed_rot;
        octahedron.position.x += speed_pos / 4;

        
        torus.rotation.x += speed_rot;
        torus.rotation.y += speed_rot;
        torus.position.x -= speed_pos / 4;
        torus.position.y -= speed_pos / 4;
        
        torusknot.rotation.x += speed_rot;
        torusknot.rotation.y += speed_rot;
        torusknot.position.y -= speed_pos / 4;
        
        tetrahedron.rotation.x += speed_rot;
        tetrahedron.rotation.y += speed_rot;
        tetrahedron.position.x += speed_pos / 4;
        tetrahedron.position.y -= speed_pos / 4;

        change_pos += speed_pos;
        if (change_pos >= 1 || change_pos <= -1) {
                speed_pos = -speed_pos;
                change_pos = 0;
        }

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();