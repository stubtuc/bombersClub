const components = {

    arrow: ({  type, id, x, y, world  }) => {

        world.map.gameObjects[id] = new HUD({
            id, x, y,
            spriteSize: 36,
            src: './images/ui/arrows.png',
            animations: {
                'idle-down': [ [0, type] ],
                'good': [ [1, type] ],
                'normal': [ [2, type] ],
                'bad': [ [3, type] ],
            },
            isUnderGameZone: false,
            zIndex: 1,
            animationFrameLimit: 1,
        });

        return world.map.gameObjects[id];

    },

    xp: ({ count, player, world, target }) => {

        new Array(count).fill(0).forEach((_, index) => {
            const id = `xp${+new Date()}${index}`;
            world.map.gameObjects[id] = new ExperienceParticle({
                id, player,
                x: target.x + utils.getRandomInt(35),
                y: target.y + utils.getRandomInt(35),
                src: './images/particles/exp.png',
                animations: { 'idle-down': [ [0, 0] ] },
                hitBox: { x1: 10000, y1: 10000, x2: 10000, y2: 10000, canWalk: true, },
                zIndex: 10,
                size: 14,
            });
        })

    }

}