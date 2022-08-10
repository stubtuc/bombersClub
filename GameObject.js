const FOLLOW_RANGE = 220;

class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || 'down';
        this.action = config.action || null;

        // Behaviors
        this.behavior = config.behavior?.actions || [];
        this.currentBehavior = this.behavior[0] || null;
        this.actionState = this.currentBehavior?.start || 0;
        this.behaviorLoop = config.behavior?.loop || false;
        this.behaviorSpeed = this.currentBehavior?.speed || 1;

        // Target to follow
        this.target = config.purpose || null;

        this.onUpdate = config.onUpdate || null;

        this.world = null;

        this.lastHitTime = 0;
        this.hitInterval = config.hitInterval || 25;

        this.lastDamagedTime = 0;
        this.damagedInterval = config.damagedInterval || 50;

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,
            withoutCropping: config.withoutCropping,
            withShadow: config.withShadow,
            animationFrameLimit: config.animationFrameLimit,
            animations: config.animations,
            size: config.spriteSize,
            hitBox: config.hitBox || null,
            fixedPosition: config.fixedPosition,
            zIndex: config.zIndex,
        });

        this.testing = config.testing || false;
        this.obstacle = null;
        this.isLost = false;

    }

    update(state) {

        // Update map
        this.world = state?.world;
        this.time = state?.time;

        // Run third-party function
        this.onUpdate && this.onUpdate();

        // Following of given target if there is no obstacle
        this.target && !this.obstacle && !this.isLost && this.follow(state, this.target)

        // If is lost then go randomly
        this.isLost && this.randomWalk();

        // If gameObject have any behaviour
        this.currentBehavior && this.doBehavior(state);

    }

    randomWalk() {

        const isXCoord = utils.getRandomInt(2) === 1;

        if (Math.abs(this.target.x - this.x) < this.target.distance && Math.abs(this.target.y - this.y) < this.target.distance) {
            this.isLost = false;
        }

        if (!this.currentBehavior) {
            this.behavior = [{
                type: isXCoord ? "moveX" : "moveY",
                start: isXCoord ? this.x : this.y,
                end: utils.getRandomInt(3) - utils.getRandomInt(2)
            }]
            this.actionState = isXCoord ? this.x : this.y;
            this.currentBehavior = this.behavior[0];
        }

    }

    follow(state, target) {

        const { x, y } = target;
        this.behaviorSpeed = this.speed;

        const distance = target.distance || FOLLOW_RANGE;

        if (Math.abs(x - this.x) < distance && Math.abs(y - this.y) < distance) {

            if (target.followers) {
                target.followers = Array.from(new Set([this, ...target.followers]));
            }

            this.isLost = false;

            const range = 25;

            const xResolved = Math.abs(x - this.x) < range && Math.abs(x - this.x) > 14;
            const yResolved = Math.abs(this.y - y) <= 5;

            if (Math.abs(this.x - x) < range && yResolved) {
                this.currentBehavior = { type: 'sleep', start: 0, end: 1000 };
                this.actionState = 0;

                if (this.isEnemy && this.time - this.lastHitTime >= this.hitInterval) {
                    this.lastHitTime = this.time;
                    this.currentBehavior = null;
                    this.actionState = 0;
                    this.world.addGameEvent('fight', { player: this, direction: this.direction, })?.start();
                }

            } else if (xResolved) {
                this.currentBehavior = { type: 'moveY', start: this.y, end: y };
                this.actionState = this.y;
            } else {
                this.currentBehavior = { type: 'moveX', start: this.x, end: x + 15 };
                this.actionState = this.x;
            }

        } else {
            this.isLost = true;
            target.followers = target.followers.filter((follower) => follower === this);
        }

    }

    doBehavior(state) {
        // If action is done
        if (this.actionState === this.currentBehavior.end) {
            this.behaviorLoop ? this.behavior?.push(this.behavior?.shift()) : this.behavior?.shift();

            const lastBehavior = this.currentBehavior;

            this.currentBehavior = this.behavior?.[0] || null
            this.actionState = this.currentBehavior?.start || 0;
            this.behaviorSpeed = this.currentBehavior?.speed || 1;

             lastBehavior?.onEnd && lastBehavior?.onEnd();

             if (this.isLost) {
                 this.sprite.setAnimation('idle-lost');
             }

            return;
        }

        const { x1, y1, x2, y2 } = this.sprite.hitBox;

        switch (this.currentBehavior.type) {

            case "moveX": {
                const { start, end } = this.currentBehavior;

                const step = 1 * this.behaviorSpeed;
                const right = start < end;

                this.direction = right ? 'right' : 'left';
                const checkSpace = state?.map.isSpaceTaken(this.x + x1, this.y + y1, this.direction, x2, y2, this.speed, this);

                // Stop here if space is not free
                if (checkSpace?.isTaken && Array.isArray(this.behavior)) {
                    this.obstacle = checkSpace?.obj;
                    this.behavior = [{ type: 'moveY', start: this.y, end: this.y + 10 }, ...this.behavior];
                    return;
                }

                this.x = this.actionState + (right ? step : -step);
                this.actionState = this.x;

                this.sprite.setAnimation(right ? 'walk-right' : 'walk-left')

                break;
            }

            case "moveY": {
                const { start, end } = this.currentBehavior;
                const step = 1 * this.behaviorSpeed;
                const down = start < end;

                const checkSpace = state?.map.isSpaceTaken(this.x + x1, this.y + y1, down ? 'down' : 'up', x2, y2, this.speed, this)

                // Stop here if space is not free
                if (checkSpace?.isTaken) {
                    this.obstacle = checkSpace?.obj;

                    const diffX = Math.abs(this.x - this.obstacle.x);

                    this.behavior = [
                        { type: 'moveX', start: this.x, end: this.x - diffX - this.sprite.hitBox.x2, },
                        { type: 'moveY', start, end, onEnd: () => { this.obstacle = null; } }
                    ];

                    this.currentBehavior = this.behavior[0];
                    this.actionState = this.x;

                    return;
                }

                this.y = this.actionState + (down ? step : -step);
                this.actionState = this.y;

                this.sprite.setAnimation(down ? 'walk-down' : 'walk-up')

                break;
            }

            case "sleep": {
                this.actionState += 1;
                this.sprite.setAnimation('idle-down');
                break;
            }

            case 'default': break;

        }

    }

}