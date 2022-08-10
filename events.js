const eventConstructor = (id, config) => {
    const eventPattern = events[id](config);

    return { ...eventPattern, world: config.world, id };
}

const events = {

    // TRAIN ARRIVED
    trainArrived: ({ world }) => ({
        onStart: () => {
            // Spawn train with arriving behavior
            world.addGameObject('train', {
                x: -1400,
                y: 317,
                src: '/images/gameObjects/Train.png',
                withoutCropping: true,
                behavior: {
                    actions: [
                        { type: 'sleep', start: 0, end: 400 },
                        { type: 'moveX', start: -1400, end: 100, speed: 12 },
                        { type: 'moveX', start: 100, end: 150, speed: 5 },
                        { type: 'moveX', start: 150, end: 300, speed: 2 },
                        // { type: 'moveX', start: 300, end: 450, speed: 2 },
                        // { type: 'moveX', start: 450, end: 1100, speed: 5 },
                        // { type: 'sleep', start: 0, end: 400 },
                    ],
                    // loop: true,
                },
                hitBox: { x1: 0, y1: 48, x2: 1073, y2: 4 }
            });

            world.map.sounds.train.play();

        },
        onUpdate() {
            const { train, ballons } = world.map.gameObjects;

            if (!this.ended && train.behaviorSpeed === 2) {
                // Camera shake
                world.map.gameObjects.cameraShaker.transformRepeat = 1;
            }

            // Train arrived
            if (!train.currentBehavior && !this.ended) {

                tips.alert({
                    text: 'Ну чего встал? Погнали!',
                    speed: 3,
                    world,
                });

                ballons.playerCanUse = true;
                world.map.gameObjects['pointer'].target = ballons;
                this.ended = true;
            }
        },
        onEnd() {

        },
    }),

    // DRAWING
    drawing: ({ player, drawingSpot, world }) => ({

        onStart() {
            player.target = drawingSpot;
            player.isPlayerControlled = false;
            this.currentFrame = drawingSpot.sprite.currentAnimationFrame;
            drawingSpot.sprite.animationFrameLimit = 500;

            const { x, y }  = { x: 20, y: 220 };
            const marginX = 40;

            this.spawnY = -400;

            this.spawnMinMarginY = 100;
            this.spawnMaxMarginY = 200;

            this.arrowSize = 36;

            this.arrows = [
                components.arrow({ type: 0, id: 'leftArrow', x, y, world }),
                components.arrow({ type: 1, id: 'upArrow', x: x + marginX, y, world }),
                components.arrow({ type: 2, id: 'rightArrow', x: x + (marginX * 2), y, world }),
            ]

            this.zones = {
                good: y,
                normal: y - (this.arrowSize / 2),
                bad: y + (this.arrowSize / 2),
            }

            this.fallings = [
                components.arrow({ type: 4, id: 'upArrowFalling', x: x + marginX, y: this.spawnY, world }),
                components.arrow({ type: 5, id: 'rightArrowFalling', x: x + (marginX * 2), y: this.spawnY, world }),
                components.arrow({ type: 3, id: 'leftArrowFalling', x, y: this.spawnY, world }),
                components.arrow({ type: 3, id: 'leftArrowFalling-2', x, y: this.spawnY, world }),
                components.arrow({ type: 4, id: 'upArrowFalling-2', x: x + marginX, y: this.spawnY, world }),
                components.arrow({ type: 5, id: 'rightArrowFalling-1', x: x + (marginX * 2), y: this.spawnY, world }),
            ];

            this.speed = 2;
            this.fallingsUnderGameZone = 0;

            this.spawn = () => {
                this.fallingsUnderGameZone = 0;

                const underGameZone = this.fallings.filter((falling) => falling.y >= this.fallingPoint);
                const sorted = underGameZone.sort((a, b) => a.type + utils.getRandomInt(15) > b.type + utils.getRandomInt(10) ? 1 : -1);
                const fallingsInGameZone = this.fallings.filter((falling) => !(falling.y >= this.fallingPoint));

                if (underGameZone.length > 0) {
                    this.fallings = [ ...sorted, ...fallingsInGameZone];
                }

                this.fallings.forEach((falling, index) => {
                    falling.canBeUsed = true;
                    if (index >= 3 && underGameZone.length > 0) {
                        return;
                    }
                    falling.y = this.spawnY + (this.spawnMinMarginY * index);
                });
            }

            this.spawn();
            this.lastMovingTime = world.time;
            this.fallingPoint = this.arrows[0].y + this.arrowSize;
        },

        onUpdate(state) {

            this.time = state.time;

            // Move fallings
            if (this.time - this.lastMovingTime >= 1) {

                this.lastMovingTime = this.time;

                this.fallings.forEach((falling) => {
                    falling.y += this.speed;

                    if (falling.y >= this.fallingPoint) {
                        this.fallingsUnderGameZone++;
                    }
                });

                // Refresh fallings
                if (this.fallingsUnderGameZone === 3) {
                    this.spawn()
                }

            }

            // Handle arrows

            this.arrows.forEach((arrow) => {

                const relatedFallingInActiveZone = this.fallings.find((falling) => falling.id.includes(arrow.id) && falling.y >= this.zones.normal);

                if (relatedFallingInActiveZone) {

                    const isKeyPressed = state.action === relatedFallingInActiveZone?.id.split('A')[0];

                    if (isKeyPressed && relatedFallingInActiveZone?.canBeUsed) {

                        if (Math.abs(relatedFallingInActiveZone.y - this.zones.good) <= 5) {
                            this.result = 'good';
                            this.xp = utils.getRandomIntInclusive(15, 30);
                        } else if (
                            Math.abs(relatedFallingInActiveZone.y - this.zones.good) >= 6 &&
                            relatedFallingInActiveZone.y - this.zones.good <= 15
                        ) {
                            this.result = 'normal';
                            this.xp = utils.getRandomIntInclusive(5, 10);
                        } else {
                            this.result = 'bad';
                            this.xp = 0;
                        }

                    }

                    if (this.result) {
                        arrow.sprite.setAnimation(this.result);
                        this.result = null;

                        if (this.xp && relatedFallingInActiveZone?.canBeUsed) {
                            components.xp({
                                count: this.xp,
                                target: { x: player.x, y: player.y},
                                player, world,
                            });
                            this.xp = null;
                        }

                        relatedFallingInActiveZone.canBeUsed = false;

                    }

                } else {
                    arrow.sprite.setAnimation('idle-down');
                }

            });

            if (player.currentBehavior?.type === 'sleep') {
                player.target = null;
                player.currentBehavior = null;
                player.sprite.setAnimation('drawing');
                drawingSpot.sprite.setAnimation('drawing');

                setInterval(() => {
                    const sprayId = `spray${+new Date()}`;

                    world.map.gameObjects[sprayId] = new BloodParticle({
                        x: player.x,
                        y: player.y,
                        id: sprayId,
                        src: './images/particles/spray.png',
                        animations: { 'idle-down': [ [0, 0] ] },
                        hitBox: { x1: 16, x2: 9, y1: 12, y2: 25, canWalk: true }
                    });
                }, 100);

            }

            // // Give XP
            //
            // if (this.currentFrame !== drawingSpot.sprite.currentAnimationFrame) {
            //     this.currentFrame = drawingSpot.sprite.currentAnimationFrame;
            //     const xp = utils.getRandomInt(15) + 1;
            //     new Array(xp).fill(0).forEach((_, index) => {
            //         const xpId = `xp${+new Date()}${index}`;
            //         world.map.gameObjects[xpId] = new ExperienceParticle({
            //             id: xpId,
            //             x: player.x + utils.getRandomInt(35),
            //             y: player.y + utils.getRandomInt(35),
            //             src: './images/particles/exp.png',
            //             animations: { 'idle-down': [ [0, 0] ] },
            //             hitBox: { x1: 10000, y1: 10000, x2: 10000, y2: 10000, canWalk: true, },
            //             player,
            //             zIndex: 1,
            //             size: 14,
            //         });
            //     })
            // }

        },
        onEnd() {}

    }),

    // FIGHT
    fight: ({ world, player, direction }) => ({

        onStart() {
            const fightAnimation = `fight-${direction}`;
            const playerHaveAnimation = player.sprite.animations[fightAnimation];

            this.direction = playerHaveAnimation ? direction : 'right';

            player.sprite.setAnimation(playerHaveAnimation ? fightAnimation : 'fight-right');

            // save initial state
            this.isPlayerControlled = player.isPlayerControlled;
            this.target = player.target;

            // bring to false
            player.isPlayerControlled = false;
            player.canUse = false;
            player.target = null;

            player.movingTimeRemaining = 0;
            player.sprite.animationFrameLimit = 2;

            this.expansion = 15;
            this.hitBox = player.sprite.hitBox;

            player.sprite.hitBox = this.direction === 'right'
                ? { ...player.sprite.hitBox, x2: player.sprite.hitBox.x2 + this.expansion }
                : { ...player.sprite.hitBox, x1: player.sprite.hitBox.x1 - this.expansion, x2: player.sprite.hitBox.x1 }
            ;

            world.map.sounds.swing.play();

        },
        onUpdate() {
            const { x1, y1, x2, y2 } = player.sprite.hitBox;
            const damageReceiver = world.map.isDamageSent(player.x + x1, player.y + y1, x2, y2, player);

            const isRequiredTime = world.time - damageReceiver?.lastDamagedTime >= damageReceiver?.damagedInterval;
            const isMissed = player.isPlayer ? utils.getRandomInt(10) <= 5 : false;

            if (damageReceiver && isRequiredTime && !isMissed) {
                damageReceiver.lastDamagedTime = world.time;
                world.addGameEvent('damaged', { target: damageReceiver, direction: this.direction, damage: player.damage, killer: player })?.start();
            } else if (!this.isPlayerControlled) {
                player.direction = player.direction === 'left' ? 'right' : 'left';
            }

            if (world.time === player.lastDamagedTime) {
                this.end();
            }

            if (player.sprite.frame[0] === 5) {
                this.end();
            }
        },
        onEnd() {
            player.sprite.hitBox = this.hitBox;
            player.sprite.animationFrameLimit = 6;
            player.canUse = true;
            player.target = this.target;
            player.isPlayerControlled = this.isPlayerControlled;
        }

    }),

    // DAMAGED
    damaged: ({ target, damage, direction, world, killer }) => ({

        onStart() {
            // save initial value
            this.target = target.behavior?.type === 'hide' ? null : target.target;
            this.isPlayerControlled = target.isPlayerControlled;

            target.lifes -= damage;
            target.sprite.setAnimation('damaged');
            target.target = null;
            target.currentBehavior = 'damaged';
            target.isPlayerControlled = false;

            world.map.sounds.hit.play();

            if (target.lifes <= 0) {

                target.isPlayer && world.setCamera(killer);

                if (killer.isPlayer) {
                    killer.followers = killer.followers.filter((follower) => follower !== target);
                }

                world.deleteGameObject(target.id);
                this.end();
            }

            // Camera shake
            world.map.gameObjects.cameraShaker.transformRepeat = 2;

            // Give XP to player
            if (killer.isPlayer) {
                const count = utils.getRandomInt(5) + 1;
                components.xp({ count, world, target, player: killer, });
            }
        },
        onUpdate() {
            const { x1, x2, y1, y2 } = target.sprite.hitBox;
            const { isTaken } = world.map.isSpaceTaken(target.x + x1, target.y + y1, direction, x2, y2, 2, target);

            if (!isTaken) {
                target.x += direction === 'right' ? 1 : -1;
            }

            const bloodId = `blood${+new Date()}`;

            world.map.gameObjects[bloodId] = new BloodParticle({
                x: target.x + 20,
                y: target.y + 15,
                id: bloodId,
                src: './images/particles/blood.png',
                animations: { 'idle-down': [ [0, 0] ] },
            });

            if (world.time === target.lastDamagedTime) {
                this.end();
            }

            if (target.sprite.frame[0] === 2) {
                this.end();
            }
        },
        onEnd() {
            // restore initial value
            target.target = this.target;
            target.isPlayerControlled = this.isPlayerControlled;
        },

    }),

    // HIDING
    hiding: ({ player, place, world }) => ({

        onStart()  {
            player.target = place;
            player.canFight = false;

            place.createParticles();
        },
        onUpdate(state) {
            if (player.distance > 0) {
                player.distance--;
            }
            // If player just walked into the bush then we hide
            if (player.currentBehavior?.type === 'sleep') {
                player.sprite.invisible = true;
            }
            // If player is moving or damaged then end hiding
            if (state.direction || player.currentBehavior === "damaged") {
                player.target = null;
                this.end();
            }
        },
        onEnd() {
            player.sprite.invisible = false;
            player.target = null;
            player.currentBehavior = null;
            player.distance = 220;
            player.canFight = true;

            world.map.sounds.unhide.play();

            place.createParticles();
        }

    }),

}