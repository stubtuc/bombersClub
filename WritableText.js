class WritableText {

    constructor(config) {

        this.id = config.id;
        this.world = config.world;

        this.x = config.x;
        this.y = config.y;

        this.text = config.text.split('');
        this.maxWidth = config.maxWidth || 100;

        this.sprite = { draw: this.draw.bind(this), zIndex: 4 };

        this.charInterval = config.charInterval || 1;
        this.lastTimeOfWritingText = 0;
        this.textToDisplay = '';

        this.speed = config.speed || 3;

        this.fontSize = config.fontSize;

    }

    update({ time, world }) {

        this.time = time;
        this.world = world;

    }

    draw(ctx) {

        ctx.fillStyle = 'white';
        ctx.font = `${this.fontSize}px Pixel Cyr`;

        if (this.time - this.lastTimeOfWritingText >= this.speed && this.text.length > 0) {

            this.textToDisplay += this.text.shift();
            this.lastTimeOfWritingText = this.time;

            this.world.map.sounds.text.play();

        }

        ctx.fillText(this.textToDisplay, this.x, this.y, this.maxWidth);

    }

    delete() {
        this.world.deleteGameObject(this.id);
    }

}