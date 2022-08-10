class TextStatus {

    constructor(config) {

        this.x = config.x;
        this.y = config.y;

        this.color = config.color;

        this.player = config.player;

        this.parameter = config.parameter;

        this.label = config.label;

        this.sprite = { draw: this.draw.bind(this), zIndex: 2 };

        this.value = this.player[this.parameter];

        this.margin = config.margin || 18;
        this.fontSize = 9;

    }

    update() {

        if (this.player[this.parameter] !== this.value) {

            this.value = this.player[this.parameter];
            this.fontSize += 3;

        }

    }

    draw(ctx) {

        ctx.fillStyle = this.color;
        ctx.font = `${this.fontSize}px Pixel Cyr`
        ctx.fillText(this.value, this.x, this.y);

        ctx.fillStyle = '#B7B6B6';
        ctx.font = '5px Pixel Cyr'
        ctx.fillText(this.label, this.x + this.margin, this.y);

        this.fontSize = 9;

    }


}