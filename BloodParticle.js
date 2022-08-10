class BloodParticle extends GameObject {

    constructor(config) {

        super(config);

        this.id = config.id;
        this.source = config.source;

        this.startX = config.x;
        this.startY = config.y;

        this.radius = config.radius || 3;

        this.timeoutBeforeDelete = config.timeoutBeforeDelete || 5000;

    }

    update(state) {
        super.update(state);
        this.updatePosition(state);
    }

    updatePosition(state) {
        const isNeededX = Math.abs(this.x - this.startX) >= this.radius;
        const isNeededY = Math.abs(this.y - this.startY) >= this.radius * 6;

        if (!isNeededX) {
            this.x += 5 - utils.getRandomInt(5);
        }

        if (!isNeededY) {
            this.y += 5 - utils.getRandomInt(5);
        }

        if (isNeededX && isNeededY) {
            setTimeout(() => {
                state.world.deleteGameObject(this.id);
            }, this.timeoutBeforeDelete);
        }
    }

}