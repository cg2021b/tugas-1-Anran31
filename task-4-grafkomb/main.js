import * as THREE from './js/three.module.js';
import * as dat from './jsm/libs/dat.gui.module.js'
import {OrbitControls} from './jsm/controls/OrbitControls.js';
import {GLTFLoader} from './jsm/loaders/GLTFLoader.js';
import {RoughnessMipmapper} from './jsm/utils/RoughnessMipmapper.js';
import { Reflector } from './jsm/objects/Reflector.js';

let scene, camera, renderer, controls, cube, obj, sphereCamera;

const canvas = document.querySelector('canvas#canvas');


/**
 * Sizes
 */
 const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
}
    
window.addEventListener('resize', () =>
{
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


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


// set up the environment - 
// initiallize scene, camera, objects and renderer
let init = function () {
        // 1. create the scene
        scene = new THREE.Scene();
        const color = 'lightblue';
        // scene.background = new THREE.Color(color);
        scene.background = new THREE.CubeTextureLoader()
	.setPath( './textures/cubeMaps/' )
	.load( [
		'px.png',
		'nx.png',
		'py.png',
		'ny.png',
		'pz.png',
		'nz.png'
	] );
        
        scene.fog = new THREE.FogExp2( color, 0.01 );
        const ambientLight = new THREE.AmbientLight(0x000000); // soft white light
        scene.add(ambientLight);
        
        const directionalLight1 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        directionalLight1.position.set(10, 10, 15);
        // directionalLight1.castShadow = true;
        // directionalLight1.shadow.mapSize.width = 1024; // default
        // directionalLight1.shadow.mapSize.height = 1024; // default
        // directionalLight1.shadow.camera.near = 1; // default
        // directionalLight1.shadow.camera.far = 1000; // default
        scene.add(directionalLight1);
        const directionalLight2 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        directionalLight2.position.set(-10, -10, -10);
        scene.add(directionalLight2);

        const spotLight = new THREE.SpotLight(0xffffff, 5, 95, 0.42);
        spotLight.position.set(0,-40, 47);
        spotLight.target.position.set(0, 0, 0);
        spotLight.target.updateMatrixWorld();
        spotLight.castShadow = true;
        
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        
        spotLight.shadow.camera.near = 0.1;
        spotLight.shadow.camera.far = 1000;
        spotLight.shadow.camera.fov = 30;
        scene.add(spotLight);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        scene.add(spotLightHelper);
        
        const spotLightFolder = gui.addFolder('Spotlight');
        spotLightFolder.add(spotLight, 'visible');
        // spotLightFolder.add(spotLight, 'intensity').min(0).max(100).step(0.01);
        // spotLightFolder.add(spotLight, 'distance').min(0).max(100).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        // });
        // spotLightFolder.add(spotLight, 'angle').min(-1.7).max(1.7).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        // });
        // spotLightFolder.add(spotLight.position, 'x').min(-50).max(50).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        // }).name("Position x");
        // spotLightFolder.add(spotLight.position, 'y').min(-50).max(50).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        // }).name("Position y");
        // spotLightFolder.add(spotLight.position, 'z').min(-50).max(50).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        // }).name("Position z");
        // spotLightFolder.add(spotLight.target.position, 'x').min(-50).max(50).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        //         spotLight.target.updateMatrixWorld();
        // }).name("Target Position x");
        // spotLightFolder.add(spotLight.target.position, 'y').min(-50).max(50).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        //         spotLight.target.updateMatrixWorld();
        // }).name("Target Position y");
        // spotLightFolder.add(spotLight.target.position, 'z').min(-50).max(50).step(0.01).onChange(() => {
        //         spotLightHelper.update();
        //         spotLight.target.updateMatrixWorld();
        // }).name("Target Position z");
        const spotLightHelperFolder = spotLightFolder.addFolder('Spotlight Helper');
        spotLightHelperFolder.add(spotLightHelper, 'visible');
        // const directionalLight3 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        // directionalLight3.position.set(10, 0, 0);
        // scene.add(directionalLight3);
        // const directionalLight4 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        // directionalLight4.position.set(-10, 0, 0);
        // scene.add(directionalLight4);
        // const directionalLight5 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        // directionalLight5.position.set(0, 0, 10);
        // scene.add(directionalLight5);
        // const directionalLight6 = new THREE.DirectionalLight( 0xffffff, 0.75 );
        // directionalLight6.position.set(0, 0, -10);
        // scene.add(directionalLight6);
        // const directionalLightHelper1 = new THREE.DirectionalLightHelper(directionalLight1);
        // scene.add(directionalLightHelper1);

        
        
        
        // 2. create an locate the camera       
        camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height,
                1, 1000);
                camera.position.z = 100;
        // 3. create an locate the object on the scene           
        // ...
        // createCube();
        const boxWidth = 3;
        const boxHeight = 3;
        const boxDepth = 3;
        const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

        function makeInstance(geometry, material, x, y, z) {

                const geo = new THREE.Mesh(geometry, material);
                scene.add(geo);
                geo.castShadow = true;
                geo.receiveShadow = true;
                geo.position.x = x;
                geo.position.y = y;
                geo.position.z = z;

                return geo;
        }

        const cubes = [
                makeInstance(geometry, new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( './textures/crate.gif' ) } ),  5, 7, 0),
                // makeInstance(geometry, 0x8844aa, -2),
                // makeInstance(geometry, 0xaa8844,  2),
        ];

        // const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

        // let sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
        // sphereCamera.position.set(0, 0, 0);
        // scene.add(sphereCamera);
    
        // let sphereMaterial = new THREE.MeshBasicMaterial({
        //     envMap: scene.background
        // });

        // makeInstance(new THREE.SphereGeometry(2.5, 500, 500), sphereMaterial, 0, 0, 0);
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
        sphereCamera = new THREE.CubeCamera(1,500,cubeRenderTarget);
        sphereCamera.position.set(0, 3, 0);
        scene.add(sphereCamera);

        const refMat = new THREE.MeshBasicMaterial({
                envMap: sphereCamera.renderTarget.texture,
        });
        const refGeo = new THREE.SphereGeometry(2.5, 500 , 500);

        makeInstance(refGeo, refMat, 0, 3, 0);

        const planeGeometry = new THREE.PlaneGeometry( 100, 100 );
        const planeMaterial = new THREE.MeshStandardMaterial( { color: color } )
        const plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.receiveShadow = true;
        plane.position.z = -10;
        scene.add( plane );
        
        // 4. create the renderer     
        renderer = new THREE.WebGLRenderer({
                canvas:canvas
        });
        renderer.setSize(sizes.width, sizes.height);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        const roughnessMipmapper = new RoughnessMipmapper( renderer );

        const loader = new GLTFLoader();
        loader.load( './objects/just_a_girl/scene.gltf', function ( gltf ) {

                // const obj = gltf.scene;
                obj = gltf.scene;
                // console.log(obj);
                obj.traverse( function ( child ) {

                        if ( child.isMesh ) {

                                roughnessMipmapper.generateMipmaps( child.material );
                                child.castShadow = true;
                                child.receiveShadow = true;
                        }

                } );
                obj.rotation.y = Math.PI / 2;
                obj.position.y = -1
                obj.position.z = 8;
                obj.scale.multiplyScalar(1 / 40);
                scene.add( obj );

                // roughnessMipmapper.dispose();

                renderer.render(scene, camera);

        } );
        
        controls = new OrbitControls(camera, canvas);
        //controls.autoRotate = true;
        controls.target.set(0, 0, 0);
        controls.update();
};


// main animation loop - calls 50-60 in a second.
let change_pos = 0;
let speed_pos = 0.005,
speed_rot = 0.005;
let mainLoop = function () {
        
        if(obj) obj.rotation.y += -speed_rot;
        // cube.rotation.y += -speed_rot;
        // cube.position.x -= speed_pos / 4;
        // cube.position.y += speed_pos / 4;
        
        change_pos += speed_pos;
        if (change_pos >= 1 || change_pos <= -1) {
                speed_pos = -speed_pos;
                change_pos = 0;
        }

        controls.update();
        if(sphereCamera) sphereCamera.update(renderer, scene);
        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();