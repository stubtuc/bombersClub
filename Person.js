class Person extends GameObject {
    constructor(config) {
        super(config);

        this.id = config.id;

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.focused = false;

        this.initialSpeed = config.speed;
        this.speed = this.initialSpeed || 1;

        this.movingTimeRemaining = 2;

        this.directionRules = {
            'up': ['y', -1],
            'down': ['y', 1],
            'left': ['x', -1],
            'right': ['x', 1],
        }

        // Detection range for other characters
        this.distance = config.distance || 180;

        this.canUse = true;
        this.canFight = true;

        this.behavior = null;

        this.testing = config.testing || false;

        this.world = config.world;

        this.canFight = true;

        this.lastHitTime = 0;
        this.hitInterval = config.hitInterval || 25;

        this.lastDamagedTime = 0;
        this.damagedInterval = config.damagedInterval || 50;

        // Characteristics
        this.level = 1;
        this.lifes = config.lifes || 100;
        this.damage = config.damage || 10;
        this.xp = 0;
        this.money = 1000;
        this.xpForNextLevel = 100;

        this.isEnemy = config.isEnemy || false;
        this.isPlayer = config.isPlayer || false;
        this.followers = [];
        this.isFindedByOthers = false;

        this.levelRules = {
            '1': { xpForNextLevel: 100 },
            '2': { xpForNextLevel: 300 },
            '3': { xpForNextLevel: 900 },
            '4': { xpForNextLevel: 2000 },
        }

    }

    get isFocused() {
        return this.focused;
    }

    update(state) {
        this.updatePosition();
        this.updateSprite(state);
        // presledovanie
        this.updateFinded();
        this.updateLevel();

        super.update(state);

        this.world = state.world;
        this.time = state.time;

        const hitIsAvailable = this.time - this.lastHitTime >= this.hitInterval;

        if (this.isPlayerControlled && this.movingTimeRemaining === 0) {

            if (state.direction) {
                this.startBehavior(state, {
                    type: 'walk',
                    direction: state.direction
                });
            }

            if (state.action === 'fight' && this.canFight && hitIsAvailable) {
                this.lastHitTime = this.time;
                this.startBehavior(state, {
                    type: 'fight',
                    direction: state.direction,
                })
            }

        }

    }

    updateFinded() {
        this.isFindedByOthers = !!this.followers.find((follower) => !follower.isLost);
    }

    updateLevel() {

        const requiredXP = this.levelRules[this.level].xpForNextLevel;

        // Am I ready to next level?
        if (this.xp >= requiredXP) {
            this.xp = Math.abs(this.xp - requiredXP);
            this.level++;
            this.xpForNextLevel = this.levelRules[this.level].xpForNextLevel;
        }
    }

    startBehavior(state, behavior) {

        this.behavior = behavior;

        // Walk behavior
        if (behavior.type === 'walk') {

            this.world.map.sounds.step.play();

            this.direction = behavior.direction;

            // Check for collisions
            const { x1, y1, x2, y2 } = this.sprite.hitBox;
            const { isTaken } = state.map.isSpaceTaken(this.x + x1, this.y + y1, this.direction, x2, y2, this.speed);

            // Stop here if space is not free
            if (isTaken) {
                return;
            }

            // Ready for walk
            this.movingTimeRemaining = 2;
        }

        // Hide behavior
        if (behavior.type === 'hide') {
            const hidingEvent = this.world.addGameEvent('hiding', { player: this, place: state.target });
            hidingEvent?.start();
            this.world.map.sounds.hide.play();
        }

        // Draw behavior
        if (behavior.type === 'draw') {
            const drawingEvent = this.world.addGameEvent('drawing', { player: this, drawingSpot: state.target });
            drawingEvent?.start();
        }

        // Fight behavior
        if (behavior.type === 'fight') {
            const direction = this.sprite.currentAnimation.split('-')[1];
            const fightEvent = this.world.addGameEvent('fight', { player: this, direction, });
            fightEvent?.start();
        }

    }

    updatePosition() {
        if (this.movingTimeRemaining > 0) {
            const [direction, change] = this.directionRules[this.direction];
            this[direction] += change * this.speed;
            this.movingTimeRemaining -= 1;
        }
    }

    updateSprite(state) {

        if (this.isPlayerControlled && this.movingTimeRemaining === 0 && !state.direction) {
            this.sprite.setAnimation(`idle-${this.direction}`);
            return;
        }

        if (this.movingTimeRemaining > 0) {
            this.sprite.setAnimation(`walk-${this.direction}`);
        }

    }

    setSpeed(speed) {
        this.speed = speed;
    }

    setFocused(focused) {
        this.focused = focused;
    }

}