const tips = {
    youCanUseTip: ({ x, y, onUpdate }) => ({
        x,
        y,
        src: '/images/ui/press e.svg',
        animations: { 'idle-down': [[0, 0], [1, 0], [2, 0], [3, 0]]},
        spriteSize: 20,
        zIndex: 2,
        onUpdate,
        hitBox: { x1: 1000, y1: 1000, x2: 1000, y2: 1000, canWalk: true },
    }),
    alert: ({ world, text, speed, withoutAnimation, alertTime, customId, y, zIndex }) => {
        const id = customId || `alert${+new Date()}`;

        if (customId && world.map.gameObjects[customId]) {
            return;
        };

        world.map.gameObjects[id] = new Alert({
            world, withoutAnimation, alertTime, speed, text, id, zIndex,
            x: 80,
            y: y || 230,
        });
    },
}