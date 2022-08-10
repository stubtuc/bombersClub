const quests = {

    // CLEAR THE SPOT

    clearTheSpot: ({ world }) => ({

        onStart() {

            tips.alert({
                text: 'Старый спот: очистите всё от лишних глаз',
                speed: 2,
                world,
            });

            this.pointer = new HUD({
                x: 5,
                y: 80,
                target: world.map.gameObjects.hero3,
                spriteSize: 24,
                animations: {
                    left: [ [0, 0], [1, 0], [2, 0], [3, 0], [2, 0], [1, 0], [0, 0] ],
                    right: [ [0, 1], [1, 1], [2, 1], [3, 1], [2, 1], [1, 1], [0, 1] ],
                    top: [ [0, 2], [1, 2], [2, 2], [3, 2], [2, 2], [1, 2], [0, 2] ],
                    bottom: [ [0, 3], [1, 3], [2, 3], [3, 3], [2, 3], [1, 3], [0, 3] ],
                },
                hitBox: { x1: 1000, x2: 1000, y1: 1000, y2: 1000 },
                zIndex: 1,
                src: './images/ui/QuestPointer.png',
            });

            world.map.gameObjects['pointer'] = this.pointer;

        },

        onUpdate() {

            if (!world.map.gameObjects['hero3'] && !this.achieve) {

                this.pointer.target = world.map.gameObjects['hero2'];

                tips.alert({
                    text: 'Первый пошёл! Отлично. Теперь следующий.',
                    speed: 2,
                    world,
                });

                this.achieve = true;
            }

            if (!world.map.gameObjects['hero2'] && !this.trainArrived) {

                tips.alert({
                    text: 'Вот-вот приедет поезд. Приготовься!.',
                    speed: 3,
                    world,
                });

                setTimeout(() => {
                    world.addGameEvent('trainArrived')?.start();
                }, 5000);

                this.pointer.target = null;
                this.trainArrived = true;
                // this.end();
            }


        },

        onEnd() {}

    })

}