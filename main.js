import * as THREE from 'three';
import { World } from './world.js';
import { Player } from './player.js';
import { BLOCK } from './blocks.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x80a0e0);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
dirLight.position.set(50, 100, 50);
scene.add(dirLight);

const world = new World(scene);
const player = new Player(camera, world);

// Touch Look for Mobile
let touchX = 0, touchY = 0;
window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        const touch = e.touches[0];
        const movementX = touch.clientX - touchX;
        camera.rotation.y -= movementX * 0.005;
        touchX = touch.clientX;
        touchY = touch.clientY;
    }
});
window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
    }
});

// Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Game Loop
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    world.loadChunksAround(player.position.x, player.position.z, 2);
    player.update(delta);

    renderer.render(scene, camera);
}

animate();
