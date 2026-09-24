import * as THREE from 'three';
import { BLOCK } from './blocks.js';

export class Player {
    constructor(camera, world) {
        this.camera = camera;
        this.world = world;

        this.position = new THREE.Vector3(8, 25, 8);
        this.velocity = new THREE.Vector3();
        this.keys = {};
        this.selectedBlock = BLOCK.DIRT;

        this.initControls();
    }

    initControls() {
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        // Mobile Controls
        document.getElementById('btn-jump')?.addEventListener('touchstart', () => {
            if (this.onGround) this.velocity.y = 8;
        });
    }

    update(delta) {
        // Gravity
        this.velocity.y -= 20 * delta;

        // Simple Keyboard Movement
        const speed = 6;
        if (this.keys['KeyW']) this.position.z -= speed * delta;
        if (this.keys['KeyS']) this.position.z += speed * delta;
        if (this.keys['KeyA']) this.position.x -= speed * delta;
        if (this.keys['KeyD']) this.position.x += speed * delta;
        if (this.keys['Space'] && this.onGround) this.velocity.y = 8;

        this.position.y += this.velocity.y * delta;

        // Ground Collision
        if (this.position.y < 15) {
            this.position.y = 15;
            this.velocity.y = 0;
            this.onGround = true;
        }

        this.camera.position.copy(this.position);
    }
        }
