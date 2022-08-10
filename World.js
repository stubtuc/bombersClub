class World {

    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector('.game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.map = null;
        this.cameraPerson = null;
        this.time = 0;
    }

    startGameLoop() {

        // Establish the camera
        this.cameraPerson = this.map.gameObjects.hero;
        this.map.events['clearTheSpot'].start();

        const step = (cameraPerson) => {
            this.time++;

            // Clear off the Canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Sort Game Objects by rule: firstly draw objects which have hit box lower than player hit box
            const sortedGameObjects = utils.sortGameObjects(Object.values(this.map.gameObjects));

            // Update all objects
            this.updateFor(sortedGameObjects);
            //Update all events
            this.updateFor(Object.values(this.map.events));
            // Update all sounds
            this.updateFor(Object.values(this.map.sounds));
            // Update Player Input
            this.updateFor([this.playerInput]);

            // Draw Game Map
            this.map.draw(this.ctx, this.cameraPerson, this.map.gameObjects.cameraShaker, this.map.gameObjects.delayedCamera);

            // Draw Game Objects
            sortedGameObjects.forEach(object => {
                object.sprite.draw(this.ctx, this.cameraPerson, this.map.gameObjects.cameraShaker, this.map.gameObjects.delayedCamera);
            })

            requestAnimationFrame(() => {
                step(this.cameraPerson);
            })
        }
        step(this.cameraPerson);
    }

    init() {

        // Scaling canvas for better font quality
        this.ctx.scale(3, 3);
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        // Creating a World Map
        this.map = new WorldMap(window.GameWorldMaps.Railway)

        // Initialize a new mission
        this.map.events['clearTheSpot'] = new GameEvent(quests.clearTheSpot({ world: this, id: 'clearTheSpot' }));

        // Initialize Player Controller
        this.playerInput = new PlayerInput();
        this.playerInput.init();

        // Starting the Game Loop
        this.startGameLoop();

    }

    updateFor(entities) {
        entities?.forEach(entity => {
            entity?.update({
                direction: this.playerInput.direction,
                action: this.playerInput.action,
                map: this.map,
                cameraShaker: this.map.gameObjects.cameraShaker,
                world: this,
                camera: this.cameraPerson,
                time: this.time,
            });
        });
    }

    setCamera(camera) {
        this.cameraPerson = camera;
    }

    addGameObject(id, config) {
        this.map.gameObjects[id] = new GameObject(config);
    }

    deleteGameObject(id) {
        delete this.map.gameObjects[id];
    }

    addGameEvent(id, config) {
        if (!this.map.events[id]) {
            const event = eventConstructor(id, { world: this, ...config })
            return this.map.events[id] = new GameEvent(event);
        }
    }

    deleteGameEvent(id) {
        delete this.map.events[id];
    }
}