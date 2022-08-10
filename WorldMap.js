class WorldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.events = config.events;
        this.sounds = config.sounds;
        this.name = config.name;

        this.mapImage = new Image();
        this.mapImage.src = config.mapSrc;
    }

    isSpaceTaken(currentX, currentY, direction, hitBoxWidth, hitBoxHeight, speed = 1, obj) {
        const { x1, y1, x2, y2 } = utils.nextPosition(currentX, currentY, direction, hitBoxWidth, hitBoxHeight, speed);

        // Getting game objects which has hit boxes and which are not controlled by player
        const gameObjects = Object.values(this.gameObjects).filter((gameObj) =>
            !gameObj.isPlayerControlled &&
            gameObj.sprite.hitBox &&
            !gameObj.sprite.hitBox.canWalk &&
            gameObj !== obj
        );

        // Getting game object that stay at this position
        const stayAtThisPosition = gameObjects.find((gameObj) => {
            const {x1: hitBoxX1, y1: hitBoxY1, x2: hitBoxX2, y2: hitBoxY2} = gameObj.sprite.hitBox;
            return x1 < (hitBoxX1 + gameObj.x) + hitBoxX2 &&
                x1 + x2 > (hitBoxX1 + gameObj.x) &&
                y1 < (hitBoxY1 + gameObj.y) + hitBoxY2 &&
                y1 + y2 > (hitBoxY1 + gameObj.y);
        });

        return {
            isTaken: stayAtThisPosition !== undefined,
            obj: stayAtThisPosition,
        }

    }

    isDamageSent(x, y, hitBoxWidth, hitBoxHeight, obj) {

        // Getting game objects that can be damaged
        const gameObjects = Object.values(this.gameObjects).filter((gameObj) =>
            gameObj.sprite.hitBox &&
            gameObj.sprite.hitBox.canBeDamaged &&
            gameObj !== obj
        );

        // Find and return target that has received damage
        return gameObjects.find((gameObj) => {
            const {x1: hitBoxX1, y1: hitBoxY1, x2: hitBoxX2, y2: hitBoxY2} = gameObj.sprite.hitBox;
            return x < (hitBoxX1 + gameObj.x) + hitBoxX2 &&
                x + hitBoxWidth > (hitBoxX1 + gameObj.x) &&
                y < (hitBoxY1 + gameObj.y) + hitBoxY2 &&
                y + hitBoxHeight > (hitBoxY1 + gameObj.y);
        });

    }

    draw(ctx, cameraPerson, cameraShaker, delayedCamera) {
        ctx.drawImage(
            this.mapImage, utils.displayOffset - delayedCamera.x + cameraShaker.transformX,
            utils.displayOffset - delayedCamera.y + cameraShaker.transformY
        );
    }
}