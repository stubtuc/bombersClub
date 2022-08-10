class ProgressBar {

    constructor(config) {

        this.x = config.x;
        this.y = config.y;

        this.width = config.width || 0;
        this.height = config.height || 0;

        this.color = config.color;

        this.player = config.player;
        this.parameter = config.parameter;
        this.maxValueParameter = config.maxValueParameter;

        this.sprite = { draw: this.draw.bind(this), zIndex: 2 };

        this.value = this.player[this.parameter];
        this.max = this.player[this.maxValueParameter];
        this.lastProgressValue = 0;

        this.progress = 0;

    }

    update() {
        this.value = this.player[this.parameter];
        this.max = this.player[this.maxValueParameter];
        this.progress = (this.width / this.max) * this.value;
    }

    draw(ctx) {

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.progress, this.height);

        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, 1, 1);
        ctx.fillRect(this.x, this.y + 4, 1, 1);


        if (this.lastProgressValue !== this.progress) {
            ctx.strokeStyle = '#3A29CC 2px';
            ctx.strokeRect(this.x, this.y, this.progress, this.height);

            this.lastProgressValue = this.progress;
        }

    }


}