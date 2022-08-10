class DelayedCamera {

    constructor(config) {

        this.player = config.player;

        this.x = this.player.x;
        this.y = this.player.y;

        this.interval = config.interval || 3;

        this.time = this.interval;

        this.temp = {};

        this.lastTime = 0;

        this.wait = false;
        this.smooth = false;
        this.coef = 1;

        this.sprite = { draw: () => {} };
    }

    update({ time }) {

        const { x, y } = this.player;

        // player is in right borders
        if (this.smooth) {

            const isRight = this.x - x < 0;
            const isTop = this.y - y < 0;

            this.x += isRight ? this.coef : -this.coef;
            this.y += isTop ? this.coef : -this.coef;

            if (Math.abs(this.x - x) <= 1) {
                this.x = x;
            }

            if (Math.abs(this.y - y) <= 1) {
                this.y = y;
            }

            return;

        }

        this.x = x;
        this.y = y;

        // if (time - this.lastTime >= 1) {
        //
        //     this.smooth = true;
        //
        //     this.lastTime = time;
        // }

    }

}