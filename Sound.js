class Sound {
    constructor(config) {

        this.src = config.src;
        this.loop = config.loop || false;
        this.volume = config.volume || 1;
        this.playingInterval = config.playingInterval || 0;

        this.lastPlayingTime = 0;
        this.currentTime = 0;

        this.sound = new Howl({
            src: [this.src],
            loop: this.loop,
            volume: this.volume,
        })

    }

    update (state) {
        this.currentTime = state.time;
    }

    play() {
        if (this.currentTime - this.lastPlayingTime >= this.playingInterval) {
            this.lastPlayingTime = this.currentTime;
            this.sound.play();
        }
    }

}