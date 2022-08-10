class InteractiveObject extends GameObject {

    constructor(config) {
        super(config);

        this.player = config.player;
        this.radius = config.radius || 30;
        this.isPlayerInRange = false;

        this.tip = config.tip || null;

        this.world = config.world;

        this.behaviorOnUse = config.behaviorOnUse;
        this.alertOnUse = config.alertOnUse;
        this.particles = config.particles;

        this.playerCanUse = config.playerCanUse || false;
    }

    update(state) {
        super.update();

        this.world = state.world;

        if (this.playerCanUse && this.player.canUse) {

            !this.world.map.events['drawing'] && this.checkDistanceToPlayer();

            if (state.action === 'use' && this.player.isFocused && this.isPlayerInRange) {
                this.behaviorOnUse && this.player.startBehavior({ target: this }, this.behaviorOnUse);
                this.alertOnUse && tips.alert({ ...this.alertOnUse, world: this.world });
            }

        }

    }

    checkIsPlayerInRange(range = this.radius) {
        return Math.abs(this.player.x - this.x) < range && Math.abs(this.player.y - this.y) < range;
    }

    checkDistanceToPlayer() {
        this.isPlayerInRange = this.checkIsPlayerInRange();

        if (this.isPlayerInRange && !this.player.isFocused && !this.player.sprite.invisible) {
            this.player.setFocused(this);
            this.sprite.setAnimation('idle-down-near');

            // Create tooltip
            const tip = tips[this.tip]({
                x: this.x + (this.sprite.size / 1.45),
                y: this.y,
                // This function will destroy tooltip
                onUpdate: () => (
                    !this.isPlayerInRange ||
                    this.player.sprite.invisible ||
                    !this.player.isPlayerControlled) &&
                    this.world.deleteGameObject(this.tip),
            });

            // Adding tooltip to the game
            !this.world.map.gameObjects.hasOwnProperty(this.tip) && this.player.isPlayerControlled && this.world.addGameObject(this.tip, tip);

        } else {
            this.player.setFocused(false);
            this.sprite.setAnimation('idle-down');
        }
    }

    createParticles() {

        const particlesId = `${this.particles}${+new Date()}`;

        this.particles && this.world.addGameObject(particlesId, particles[this.particles]({
            x: this.x,
            y: this.y,
            onUpdate: () => setTimeout(() => {
                this.world.deleteGameObject(particlesId);
            }, 600),
        }));

    }

}