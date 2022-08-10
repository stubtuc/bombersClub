class CameraShaker {

    constructor(config) {

        this.transformX = config.transformX || 0;
        this.transformY = config.transformY || 0;
        this.transformInterval = config.transformInterval;

        this.transformTime = 5;

        this.lastTransformTime = 0;
        this.timeRemaining = this.transformTime;

        this.transformRepeat = 0;

        this.sprite = { draw: () => {} };

    }

    update({ time }) {

        const timeDiff = time - this.lastTransformTime;

        if (timeDiff >= this.transformInterval && this.transformRepeat !== 0) {

            if (this.timeRemaining > 0) {

                this.transformX += 1;
                this.transformY += 1;

                this.lastTransformTime = time;
                this.timeRemaining -= 1;

            }

            if (this.timeRemaining <= 0) {

                this.transformX -= 1;
                this.transformY -= 1;

                this.lastTransformTime = time;
                this.timeRemaining -= 1;

            }

            if (this.timeRemaining === -(this.transformTime)) {
                this.timeRemaining = this.transformTime;
                this.transformRepeat -= 1;
            }

        }

    }


}