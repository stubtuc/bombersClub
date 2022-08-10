class ExperienceParticle extends GameObject {

    constructor(config) {

        super(config);

        this.id = config.id;
        this.player = config.player;

    }

    update(state) {
        super.update(state);
        this.updatePosition(state);
    }

    updatePosition (state) {
        const isUnderLeft = this.x - (state.camera.x - utils.displayOffset) < 50;
        const isUnderTop = this.y - (state.camera.y - (utils.displayOffset - 132)) <= 0;

        if (!isUnderLeft) {
            this.x -= 3 - utils.getRandomInt(3);
        }

        if (!isUnderTop) {
            this.y -= 3 - utils.getRandomInt(3);
        }

        if (isUnderLeft && isUnderTop) {
            this.player.xp++;
            state.world.map.sounds.xp.play();
            state.world.deleteGameObject(this.id);
        }
    }

}