class SprayParticles extends GameObject {

    constructor(config) {

        super(config);

        this.id = config.id;
        this.source = config.source;

        this.startX = config.x;
        this.startY = config.y;

        this.radius = -3;

    }

    update(state) {
        super.update(state);
        this.updatePosition(state);
    }

    updatePosition(state) {
        const isNeededX = Math.abs(this.x - this.startX) >= this.radius;
        const isNeededY = Math.abs(this.y - this.startY) >= this.radius * 3;

        if (!isNeededX) {
            this.x += 10 - utils.getRandomInt(10);
        }

        if (!isNeededY) {
            this.y += 10 - utils.getRandomInt(10);
        }

        if (isNeededX && isNeededY) {
            setTimeout(() => {
                state.world.deleteGameObject(this.id);
            }, 5000);
        }
    }

}