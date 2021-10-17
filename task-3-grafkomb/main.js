import * as THREE from './js/three.module.js';
import {OrbitControls} from './jsm/controls/OrbitControls.js';


let scene, camera, renderer, controls;


const canvas = document.querySelector('canvas#canvas');

const colors = [
        '0xac92eb',
        '0x4fc1e8',
        '0xa0d568',
        '0xffce54',
        '0xed5564',
        '0x653e2f'
];

let positions = []

for (let z = 4; z > -5; z -= 4 ) {
        for (let y = 4; y > -5; y -= 2 ){
                for (let x = -4; x < 5; x += 4) {
                        let pos = {
                                x : x,
                                y : y,
                                z : z
                        }
                        positions.push(pos);
                }
        }
}

const range = (start, end, step = 1) => {
        let output = [];
        if (typeof end === 'undefined') {
          end = start;
          start = 0;
        }
        for (let i = start; i < end; i += step) {
          output.push(i);
        }
        return output;
};

let empty_pos = [];
// let occupied_pos = [];

function getRandomInt(max) {
        return Math.floor(Math.random() * max);
};

function getPosIndex(x, y, z) {
        return (Math.abs((z + 4) / 4 - 2) * 15 + Math.abs((y + 4) / 2 - 4) * 3 + Math.abs(Math.abs(x - 4) / 4 - 2)); 
}

let createCube = function () {
        
        let geometry = new THREE.BoxGeometry(1, 1, 1);
        // let material = new THREE.MeshBasicMaterial({color: 0x00a1cb});
        let material = new THREE.MeshStandardMaterial({
                roughness: 1.0,
                metalness: 1.0,
                color: parseInt(colors[getRandomInt(colors.length)]),
        });
        let cube = new THREE.Mesh(geometry, material);
        
        let pos_index = Math.floor(Math.random() * empty_pos.length)
        let pos = empty_pos[pos_index];
        // occupied_pos.push(pos);
        empty_pos.splice(pos_index,1);
        cube.position.x = positions[pos].x;
        cube.position.y = positions[pos].y;
        cube.position.z = positions[pos].z;
        scene.add(cube);
};


function addDirectionalLight(x,y,z) {
        let directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
        directionalLight.position.set(x, y, z);
        scene.add(directionalLight);
}

let addLight = function() {
        const ambientLight = new THREE.AmbientLight(0x000000); // soft white light
        scene.add(ambientLight);

        addDirectionalLight(6,0,0);
        addDirectionalLight(-6,0,0);
        addDirectionalLight(0,6,0);
        addDirectionalLight(0,-6,0);
        addDirectionalLight(0,0,6);
        addDirectionalLight(0,0,-6);
}

// set up the environment - 
// initiallize scene, camera, objects and renderer
let init = function () {
        // 1. create the scene
        scene = new THREE.Scene();
        
        addLight();
        
        scene.background = new THREE.Color(0xababab);
        
        // 2. create an locate the camera       
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
                1, 1000);
        camera.position.z = 15;
        // 3. create an locate the object on the scene           
        // ...
        empty_pos = range(0,45);
        for(let i = 0; i< 20; i++)
        {
                createCube();
        }
        // 4. create the renderer     
        renderer = new THREE.WebGLRenderer({
                canvas: canvas
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        controls = new OrbitControls(camera, canvas);
        controls.autoRotate = false;
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.update();
        
        // const controlFolder = gui.addFolder('Orbit Control');
        // controlFolder.add(controls, 'autoRotate');
};


// main animation loop - calls 50-60 in a second.
let selectedObject = [];
let originalColors = [];

const scoreHtml = document.getElementById("score");
const highScoreHtml = document.getElementById("high-score");
let highScore = 0;
let currentScore = 0;
let rightScore = 10;

const disposeObject = () => {

        let first = selectedObject[0].material.color.getHex();
        let second = selectedObject[1].material.color.getHex();

        if (first === second) {
                selectedObject.forEach(object => {
                        let pos_index = getPosIndex(object.position.x, object.position.y, object.position.z);
                        // console.log(object.position.x, object.position.y, object.position.z);
                        // console.log(pos_index);
                        empty_pos.push(pos_index);
                        object.geometry.dispose();
                        object.material.dispose();
                        scene.remove(object);
                        renderer.renderLists.dispose();
                });
                currentScore += rightScore;
        } else {
                selectedObject[0].material.emissive.setHex(0x000000);
        }

        scoreHtml.innerHTML = currentScore;
        //currentScoreElement.innerHTML = currentScore;
        originalColors = [];
        selectedObject = [];
}

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

/**
 * Raycast
 */
const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();
mouse.setX(-1); mouse.setY(-1);


const clock = new THREE.Clock();

let speedThreshold = 0;
let countThreshold = 5;
let count = 0;
let speed = 0.004;
const baseSpeed = 0.004;
let started = false;
let paused = false;

const onMouseClick = (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        rayCast.setFromCamera(mouse, camera);
        if(started && !paused) {
                let intersects = rayCast.intersectObjects(scene.children, false);
        
                if (intersects[0]) {
                let firstObject = intersects[0].object;
                if (selectedObject.length > 0) {
                        if (firstObject.uuid === selectedObject[0].uuid) {
                        firstObject.material.emissive.setHex(0x000000);
                        selectedObject = [];
                        originalColors = [];
                        return;
                        }
                }
        
                selectedObject.push(firstObject);
                originalColors.push(firstObject.material.color.getHex());
                        if (selectedObject.length > 1) {
                                disposeObject();
                        }
                }
        }
}

document.addEventListener("click", onMouseClick);

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const continueBtn = document.getElementById('continue-btn');
const restartBtn = document.getElementById('restart-btn');

let resetBasic = function () {
        speedThreshold = 0;
        countThreshold = 5;
        count = 0;
        speed = baseSpeed;
        currentScore = 0;
        rightScore = 10;
        scoreHtml.innerHTML = currentScore;
}

let updateHighScore = function () {
        if (currentScore > highScore) {
                highScore = currentScore;
                highScoreHtml.innerHTML = highScore;
        }
}

let mainLoop = function (time) {
        if(started && !paused) {

                if (empty_pos.length == 0) {
                        speedThreshold = 0;
                        speed = baseSpeed;
                        updateHighScore();
                        scoreHtml.innerHTML = currentScore;
                        started = false;
                        restartBtn.classList.remove("hidden");
                        pauseBtn.classList.add("hidden");
                } else {
                        speedThreshold += speed;
                }
                
                if (speedThreshold > 1) {
                        createCube();
                        speedThreshold = 0;
                        if (count > countThreshold) {
                                speed += baseSpeed;
                                count = 0;
                                countThreshold += 10;
                                rightScore += 5;
                        } 
                        else {
                                count++;
                        }
                }
        
                const elapsedTime = clock.getElapsedTime();
        
                if (selectedObject.length > 0) {
                    selectedObject[0].material.emissive.setHex(elapsedTime % 0.5 >= 0.25 ? originalColors[0] : 0x000000);
                }
        }

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(mainLoop);
};

///////////////////////////////////////////////
init();
mainLoop();


let startClick = function() {
        startBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        started = true;
};

let pauseClick = function() {
        pauseBtn.classList.add("hidden");
        continueBtn.classList.remove("hidden");
        restartBtn.classList.remove("hidden");
        paused = true;
};

let continueClick = function() {
        continueBtn.classList.add("hidden");
        restartBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        paused = false;
};

let restartClick = function() {
        restartBtn.classList.add("hidden");
        continueBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        paused = false;
        started = true;
        updateHighScore();
        resetBasic();
        init();
};

startBtn.addEventListener("click",startClick,false);
pauseBtn.addEventListener("click",pauseClick,false);
continueBtn.addEventListener("click",continueClick,false);
restartBtn.addEventListener("click",restartClick,false);