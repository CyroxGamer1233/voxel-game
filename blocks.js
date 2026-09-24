export const BLOCK = {
    AIR: 0,
    GRASS: 1,
    DIRT: 2,
    STONE: 3,
    WOOD: 4,
    LEAVES: 5,
    PLANKS: 6,
    BEDROCK: 7,
    SAND: 8
};

export const BLOCK_DATA = {
    [BLOCK.AIR]: { name: 'Air', solid: false },
    [BLOCK.GRASS]: { name: 'Grass', solid: true, color: '#557a2b' },
    [BLOCK.DIRT]: { name: 'Dirt', solid: true, color: '#684832' },
    [BLOCK.STONE]: { name: 'Stone', solid: true, color: '#737373' },
    [BLOCK.WOOD]: { name: 'Wood', solid: true, color: '#4a3319' },
    [BLOCK.LEAVES]: { name: 'Leaves', solid: true, color: '#2d5a1e' },
    [BLOCK.PLANKS]: { name: 'Planks', solid: true, color: '#8a6239' },
    [BLOCK.BEDROCK]: { name: 'Bedrock', solid: true, color: '#1c1c1c' },
    [BLOCK.SAND]: { name: 'Sand', solid: true, color: '#d2b48c' }
};

export function createProceduralAtlas() {
    const canvas = document.createElement('canvas');
    const tileSize = 16;
    canvas.width = tileSize * 4;
    canvas.height = tileSize * 4;
    const ctx = canvas.getContext('2d');

    function drawTile(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        for(let i=0; i<30; i++) {
            ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            ctx.fillRect(x*tileSize + Math.random()*16, y*tileSize + Math.random()*16, 2, 2);
        }
    }

    drawTile(0, 0, '#557a2b'); // Grass
    drawTile(1, 0, '#684832'); // Dirt
    drawTile(2, 0, '#737373'); // Stone
    drawTile(3, 0, '#4a3319'); // Wood
    drawTile(0, 1, '#2d5a1e'); // Leaves
    drawTile(1, 1, '#8a6239'); // Planks
    drawTile(2, 1, '#1c1c1c'); // Bedrock
    drawTile(3, 1, '#d2b48c'); // Sand

    return canvas;
}
