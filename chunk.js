import * as THREE from 'three';
import { BLOCK, BLOCK_DATA } from './blocks.js';

export const CHUNK_SIZE = 16;
export const CHUNK_HEIGHT = 32;

export class Chunk {
    constructor(cx, cz) {
        this.cx = cx;
        this.cz = cz;
        this.blocks = new Uint8Array(CHUNK_SIZE * CHUNK_HEIGHT * CHUNK_SIZE);
        this.mesh = null;
    }

    getBlock(x, y, z) {
        if (x < 0 || x >= CHUNK_SIZE || y < 0 || y >= CHUNK_HEIGHT || z < 0 || z >= CHUNK_SIZE) return BLOCK.AIR;
        return this.blocks[x + CHUNK_SIZE * (z + CHUNK_SIZE * y)];
    }

    setBlock(x, y, z, id) {
        if (x >= 0 && x < CHUNK_SIZE && y >= 0 && y < CHUNK_HEIGHT && z >= 0 && z < CHUNK_SIZE) {
            this.blocks[x + CHUNK_SIZE * (z + CHUNK_SIZE * y)] = id;
        }
    }

    buildMesh(material) {
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];

        let count = 0;

        for (let y = 0; y < CHUNK_HEIGHT; y++) {
            for (let z = 0; z < CHUNK_SIZE; z++) {
                for (let x = 0; x < CHUNK_SIZE; x++) {
                    const blockId = this.getBlock(x, y, z);
                    if (blockId === BLOCK.AIR) continue;

                    const wx = this.cx * CHUNK_SIZE + x;
                    const wz = this.cz * CHUNK_SIZE + z;

                    // Culled Face Meshing (Sirf wahi face banao jo dikh rahe hain)
                    const faces = [
                        { dir: [0, 1, 0], norm: [0, 1, 0], corners: [[0,1,1],[1,1,1],[1,1,0],[0,1,0]] }, // Top
                        { dir: [0, -1, 0], norm: [0, -1, 0], corners: [[0,0,0],[1,0,0],[1,0,1],[0,0,1]] }, // Bottom
                        { dir: [0, 0, 1], norm: [0, 0, 1], corners: [[0,0,1],[1,0,1],[1,1,1],[0,1,1]] }, // Front
                        { dir: [0, 0, -1], norm: [0, 0, -1], corners: [[1,0,0],[0,0,0],[0,1,0],[1,1,0]] }, // Back
                        { dir: [-1, 0, 0], norm: [-1, 0, 0], corners: [[0,0,0],[0,0,1],[0,1,1],[0,1,0]] }, // Left
                        { dir: [1, 0, 0], norm: [1, 0, 0], corners: [[1,0,1],[1,0,0],[1,1,0],[1,1,1]] }  // Right
                    ];

                    for (const face of faces) {
                        const nx = x + face.dir[0];
                        const ny = y + face.dir[1];
                        const nz = z + face.dir[2];

                        if (this.getBlock(nx, ny, nz) === BLOCK.AIR) {
                            for (const c of face.corners) {
                                positions.push(wx + c[0], y + c[1], wz + c[2]);
                                normals.push(...face.norm);
                                uvs.push(c[0], c[1]);
                            }

                            indices.push(count, count + 1, count + 2, count, count + 2, count + 3);
                            count += 4;
                        }
                    }
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);

        if (this.mesh) {
            this.mesh.geometry.dispose();
            this.mesh.geometry = geometry;
        } else {
            this.mesh = new THREE.Mesh(geometry, material);
        }
        return this.mesh;
    }
        }
