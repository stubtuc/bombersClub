class HUD {
    constructor(config) {
        this.id = config.id;

        this.x = config.x;
        this.y = config.y;

        this.fields = config.fields;
        this.element = null;

        this.offset = config.offset || { x: 0, y: 0 };
        this.canBeUsed = true;

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            withoutCropping: config.withoutCropping,
            withShadow: config.withShadow,
            animationFrameLimit: config.animationFrameLimit,
            animations: config.animations,
            size: config.spriteSize,
            hitBox: config.hitBox || null,
            zIndex: config.zIndex,
            fixedPosition: true,
        });

        this.target = config.target || null;
        this.onUpdate = this.onUpdate || null;
    }

    update(state) {
        this.world = state.world;
        this.onUpdate && this.onUpdate(state);

        if (this.target) {
            this.updatePosition(state.camera);
            this.sprite.invisible = this.checkIsPlayerInRange(state.camera) || state.world.map.events['fight'];
        }
    }

    checkIsPlayerInRange(player, range = 30) {
        return Math.abs(player?.x - this.target?.x) < range && Math.abs(player?.y - this.target?.y) < range;
    }

    updatePosition(camera) {
        const nextX = this.target.x + (this.target.sprite.size / 2) + this.target.sprite.hitBox.x2;
        const nextY = this.target.y + (this.target.sprite.size / 2);

        const isUnderLeft = nextX - (camera.x - utils.displayOffset) < 0;
        const isUnderRight = nextX - camera.x > utils.screen.width + (this.target.sprite.size);

        const isUnderTop = nextY - (camera.y - (utils.displayOffset - 110)) <= 0;
        const isUnderTopLeft = nextX - (camera.x - utils.displayOffset) < 0 && nextY - (camera.y - (utils.displayOffset - 170)) <= 0;
        const isUnderTopRight = nextY - (camera.y - (utils.displayOffset - 170)) <= 0 && nextX - camera.x > utils.screen.width + (this.target.sprite.size);

        const isUnderLeftHUD = nextX - (camera.x - (utils.displayOffset - 160)) < 0;

        const isUnderBottom = nextY - (camera.y - (utils.displayOffset - 110)) >= 242;

        this.sprite.fixedPosition = true;

        if (isUnderLeft) {
            this.x = 5;
            this.y = isUnderBottom ? 242 : isUnderTopLeft ? 60 : nextY - (camera.y - (utils.displayOffset / 2));

            this.sprite.setAnimation('left');
        } else if (isUnderRight) {
            this.x = utils.screen.width * 2;
            this.y = isUnderTop ? 5 : isUnderBottom ? 242 : nextY - (camera.y - (utils.displayOffset / 2));

            this.sprite.setAnimation('right');
        } else if (isUnderTop) {
            this.y = isUnderLeftHUD ? 60 : 5;
            this.x = isUnderTopLeft ? 40 : nextX - (camera.x - utils.displayOffset) - (isUnderTopRight ? 24 : 0);

            this.sprite.setAnimation('top');
        } else if (isUnderBottom) {
            this.y = 242;
            this.x = isUnderLeft ? 5 : isUnderRight ? 150 : nextX - (camera.x - utils.displayOffset) - 24;

            this.sprite.setAnimation('bottom');
        } else {
            this.sprite.fixedPosition = false;

            const onLeftSide = nextX < (camera.x + 60);

            this.x = onLeftSide ? nextX : nextX - 50;
            this.y = nextY;

            this.sprite.setAnimation(onLeftSide ? 'left' : 'right');
        }

    }

    delete() {
        this.world.deleteGameObject(this.id);
    }
}