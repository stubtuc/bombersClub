class GameEvent {

    constructor(config) {

        this.id = config.id;

        this.onStart = config.onStart;
        this.onUpdate = config.onUpdate;
        this.onEnd = config.onEnd;

        this.world = config.world;

        this.started = false;
        this.ended = false;

    }

    start() {
        this.started = true;
        this.onStart();
    }

    update(state) {
        this.started && this.onUpdate(state);
    }

    end() {
        this.onEnd();
        this.world.deleteGameEvent(this.id);
    }

}