class Sprite {
    constructor(config) {
        this.withShadow = config.withShadow || false;
        this.withoutCropping = config.withoutCropping || false;

        // Setting up a Sprite image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }
        this.size = config.size || 48;

        this.zIndex = config.zIndex || 0;

        // Setting up a Shadow image
        this.shadow = new Image();
        this.shadow.src = '/images/Shadow.png';
        this.shadow.onload = () => {
            this.shadowIsLoaded = true;
        }

        // Configure Animation & Initial State
        this.animations = config.animations || {
            // Idle
            'idle-down': [ [0, 0], [1, 0], [2, 0] ],
            'idle-up': [ [0, 1], [1, 1], [2, 1] ],
            'idle-left': [ [0, 2], [1, 2], [2, 2] ],
            'idle-right': [ [0, 3], [1, 3], [2, 3] ],
            'idle-lost': [ [0, 0], [0, 0],  [0, 2], [0, 2], [0, 0], [0, 0], [0, 3], [0, 3] ],
            // Walk
            'walk-down': [ [0, 4], [1, 4], [2, 4], [3, 4] ],
            'walk-up': [ [0, 5], [1, 5], [2, 5], [3, 5] ],
            'walk-left': [ [0, 6], [1, 6], [2, 6], [3, 6] ],
            'walk-right': [ [0, 7], [1, 7], [2, 7], [3, 7] ],
            // Fight
            'fight-right': [ [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8] ],
            'fight-left': [ [0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9] ],
            'damaged': [ [0, 10], [1, 10], [2, 10] ],
            // Drawing
            'drawing': [ [0, 11], [1, 11], [2, 11], [3, 11], [4, 11], [5, 11], [3, 11], [4, 11], [5, 11], [2, 11], [1, 11], ],
        };
        this.currentAnimation = config.currentAnimation || 'idle-down';
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || utils.frameLimit;
        this.animationFrameProgress = this.animationFrameLimit;

        // Reference the GameObject
        this.gameObject = config.gameObject;

        // Define the Hit Box
        this.hitBox = config.hitBox;

        // For HUD and so on
        this.fixedPosition = config.fixedPosition || false;

        this.invisible = config.invisible || false;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    setAnimationFrameLimit(num) {
        this.animationFrameLimit = num;
    }

    updateAnimationProgress() {
        // Downtick animation progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        // Reset the counter
        this.animationFrameProgress = this.animationFrameLimit
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }

    }

    draw(ctx, cameraPerson, cameraShaker, delayedCamera) {
        let x, y;

        if (this.fixedPosition) {
            x = this.gameObject.x;
            y = this.gameObject.y;
        } else {
            x = (this.gameObject.x + utils.displayOffset) - delayedCamera.x + cameraShaker.transformX;
            y = (this.gameObject.y + (utils.displayOffset / 2)) - delayedCamera.y + cameraShaker.transformY;
        }

        const [frameX, frameY] = this.frame;

        // Draw it if Sprite isn`t invisible
        if (!this.invisible) {

            this.shadowIsLoaded && this.withShadow && ctx.drawImage(this.shadow, x, y);

            this.isLoaded && !this.withoutCropping && ctx.drawImage(
                this.image,
                frameX * this.size, frameY * this.size,
                this.size, this.size,
                x, y,
                this.size, this.size
            );

            this.isLoaded && this.withoutCropping && ctx.drawImage(this.image, x, y);

        }

        // Draw hit boxes for debugging

        // if (this.hitBox) {
        //     const { x1, y1, x2, y2 } = this.hitBox
        //
        //     ctx.fillStyle = 'red';
        //     ctx.fillRect(x + x1, y + y1, x2, y2);
        // }

        this.updateAnimationProgress();
    }

}