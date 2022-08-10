const utils = {
    nextPosition(currentX, currentY, direction, hitBoxWidth, hitBoxHeight, speed) {
        let x = currentX;
        let y = currentY;

        const size = 1 * speed;

        if (direction === 'down') {
            y += size;
        }
        if (direction === 'up') {
            y -= size;
        }
        if (direction === 'left') {
            x -= size;
        }
        if (direction === 'right') {
            x += size;
        }

        return { x1: x, y1: y, x2: hitBoxWidth, y2: hitBoxHeight };
    },
    sortGameObjects: (gameObjects) => gameObjects.sort((object1, object2) =>
        (object1.sprite.hitBox?.y1 + object1.y) > (object2.sprite.hitBox?.y1 + object2.y) ||
        object1.sprite.zIndex > object2.sprite.zIndex
            ? 1
            : -1
    ),
    frameLimit: 6,
    displayOffset: 220,
    screen: {
        width: 225,
        height: 382,
    },
    getRandomInt: (max) => Math.floor(Math.random() * max),
    getRandomIntInclusive: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}