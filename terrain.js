import { BLOCK } from './blocks.js';

export class TerrainGenerator {
    constructor(seed = 12345) {
        this.seed = seed;
    }

    noise2D(x, z) {
        let n = Math.sin(x * 0.05 + this.seed) * Math.cos(z * 0.05 + this.seed);
        return (n + 1) / 2;
    }

    generateChunk(cx, cz, chunkSize = 16, chunkHeight = 32) {
        const blocks = new Uint8Array(chunkSize * chunkHeight * chunkSize);
        
        for (let x = 0; x < chunkSize; x++) {
            for (let z = 0; z < chunkSize; z++) {
                const wx = cx * chunkSize + x;
                const wz = cz * chunkSize + z;
                
                const height = Math.floor(10 + this.noise2D(wx, wz) * 12);

                for (let y = 0; y < chunkHeight; y++) {
                    const idx = x + chunkSize * (z + chunkSize * y);

                    if (y === 0) {
                        blocks[idx] = BLOCK.BEDROCK;
                    } else if (y < height - 3) {
                        blocks[idx] = BLOCK.STONE;
                    } else if (y < height) {
                        blocks[idx] = BLOCK.DIRT;
                    } else if (y === height) {
                        blocks[idx] = BLOCK.GRASS;
                    } else {
                        blocks[idx] = BLOCK.AIR;
                    }
                }
            }
        }
        return blocks;
    }
}
