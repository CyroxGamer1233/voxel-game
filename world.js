import * as THREE from 'three';
import { Chunk, CHUNK_SIZE, CHUNK_HEIGHT } from './chunk.js';
import { TerrainGenerator } from './terrain.js';
import { createProceduralAtlas, BLOCK } from './blocks.js';

export class World {
    constructor(scene) {
        this.scene = scene;
        this.chunks = new Map();
        this.generator = new TerrainGenerator();

        const canvas = createProceduralAtlas();
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter;

        this.material = new THREE.MeshLambertMaterial({
            map: texture
        });
    }

    getChunkKey(cx, cz) {
        return `${cx},${cz}`;
    }

    loadChunksAround(playerX, playerZ, radius = 2) {
        const centerCX = Math.floor(playerX / CHUNK_SIZE);
        const centerCZ = Math.floor(playerZ / CHUNK_SIZE);

        for (let x = -radius; x <= radius; x++) {
            for (let z = -radius; z <= radius; z++) {
                const cx = centerCX + x;
                const cz = centerCZ + z;
                const key = this.getChunkKey(cx, cz);

                if (!this.chunks.has(key)) {
                    const chunk = new Chunk(cx, cz);
                    chunk.blocks = this.generator.generateChunk(cx, cz);
                    const mesh = chunk.buildMesh(this.material);
                    this.scene.add(mesh);
                    this.chunks.set(key, chunk);
                }
            }
        }
    }

    getBlock(x, y, z) {
        x = Math.floor(x); y = Math.floor(y); z = Math.floor(z);
        if (y < 0 || y >= CHUNK_HEIGHT) return BLOCK.AIR;

        const cx = Math.floor(x / CHUNK_SIZE);
        const cz = Math.floor(z / CHUNK_SIZE);
        const chunk = this.chunks.get(this.getChunkKey(cx, cz));
        if (!chunk) return BLOCK.AIR;

        const lx = (x % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
        const lz = (z % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
        return chunk.getBlock(lx, y, lz);
    }

    setBlock(x, y, z, id) {
        x = Math.floor(x); y = Math.floor(y); z = Math.floor(z);
        if (y < 0 || y >= CHUNK_HEIGHT) return;

        const cx = Math.floor(x / CHUNK_SIZE);
        const cz = Math.floor(z / CHUNK_SIZE);
        const chunk = this.chunks.get(this.getChunkKey(cx, cz));

        if (chunk) {
            const lx = (x % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
            const lz = (z % CHUNK_SIZE + CHUNK_SIZE) % CHUNK_SIZE;
            chunk.setBlock(lx, y, lz, id);
            chunk.buildMesh(this.material);
        }
    }
          }
