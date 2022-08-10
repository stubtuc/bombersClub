class Alert {

    constructor(config) {

        this.world = config.world;
        this.id = config.id;

        this.x = config.x;
        this.y = config.y;

        this.text = config.text;
        this.labelWidth = 326;
        this.fontSize = config.fontSize || 9;
        this.zIndex = config.zIndex || 3;

        this.movingLastTime = 0;
        this.speed = config.speed || 1;

        this.withoutAnimation = config.withoutAnimation || false;
        this.alertTime = config.alertTime || 100;
        this.alertStarted = this.world.time;

        this.init(config.world);

        this.sprite = { draw: () => {}, zIndex: 4 };

    }

    update({ time }) {

        if (!this.withoutAnimation) {
            if (time - this.movingLastTime >= this.speed) {

                this.movingLastTime = time;

                this.label.y--;
                this.dynamicText.y--;

            }
            if (this.label.y <= 150) {
                this.delete();
            }
        }

        if (this.withoutAnimation) {
            if (time - this.alertStarted === this.alertTime) {
                this.delete();
            }
        }

    }

    init(world) {

        const labelId = `label${+new Date()}`

        this.label = world.map.gameObjects[labelId] = new HUD({
            id: labelId,
            x: this.x,
            y: this.y,
            src: './images/ui/labelShadow.png',
            zIndex: this.zIndex,
            withoutCropping: true,
            world,
        });

        world.ctx.font = `${this.fontSize}px Pixel Cyr`;

        const dynamicTextId = `dynamicTextId${+new Date()}`

        this.dynamicText = world.map.gameObjects[dynamicTextId] = new WritableText({
            id: dynamicTextId,
            x: this.x + (this.labelWidth / 2)  - (world.ctx.measureText(this.text).width / 2),
            y: this.y + 35,
            maxWidth: 250,
            fontSize: 9,
            speed: this.speed,
            text: this.text,
            world,
        });

    }

    delete() {
        this.label.delete();
        this.dynamicText.delete();
        this.world.deleteGameObject(this.id);
    }


}