class PlayerVisibilityStatusHUD extends HUD {

    constructor(config) {

        super(config);

        this.player = config.player;

        this.y = config.y;

        this.refreshTime = 0;

        this.HUDvisibilityTime = 0;

        this.visibilityStatus = true;
        this.sprite.setAnimation('visible');

    }


    update(state) {

        super.update(state)

        if (this.sprite.currentAnimationFrame === 3) {
            this.sprite.setAnimation(this.player.isFindedByOthers ? 'visible' : 'not-visible');
        }

        this.sprite.invisible = state.time - this.HUDvisibilityTime >= 80 &&
            this.visibilityStatus === this.player.isFindedByOthers &&
            this.player.behavior?.type !== 'hide';

        if (this.visibilityStatus !== this.player.isFindedByOthers) {
            this.visibilityStatus = this.player.isFindedByOthers;

            this.world.map.sounds[this.visibilityStatus ? 'observed' : 'notObserved'].play();

            // tips.alert({
            //     customId: 'hidingAlert',
            //     text: this.player.isFindedByOthers ? 'Вас заметили' : 'Вы скрылись',
            //     speed: 1,
            //     world: state.world,
            //     withoutAnimation: true,
            //     alertTime: 125,
            //     y: 20,
            //     zIndex: 1
            // })

            this.HUDvisibilityTime = state.time;
            this.sprite.setAnimation(`transition-to-${this.visibilityStatus ? 'visible' : 'not-visible'}`);
        }

    }


}