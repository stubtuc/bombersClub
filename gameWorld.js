const hero = new Person({
    x: 550,
    y: 220,
    src: '/images/characters/Ash.png',
    withShadow: true,
    id: 'hero',
    isPlayerControlled: true,
    isPlayer: true,
    hitInterval: 2,
    damagedInterval: 2,
    testing: true,
    hitBox: { x1: 18, y1: 10, x2: 12, y2: 25, canWalk: true, canBeDamaged: true, },
    speed: 2,
});

const hero2 = new Person({
    x: 150,
    y: 388,
    src: '/images/characters/Hero.png',
    id: 'hero2',
    withShadow: true,
    hitInterval: 2,
    damagedInterval: 2,
    hitBox: { x1: 18, y1: 10, x2: 12, y2: 25, canWalk: true, canBeDamaged: true, },
    purpose: hero,
    isPlayerControlled: false,
    isEnemy: true,
    behavior: {
        actions: [
            { type: 'moveX', start: 150, end: 300 },
            { type: 'moveY', start: 388, end: 460 },
            { type: 'moveX', start: 300, end: 150 },
            { type: 'moveY', start: 460, end: 388 },
            { type: 'sleep', start: 0, end: 300 },
        ],
        speed: 2,
        loop: true,
    },
    speed: 1,
})

const hero3 = new Person({
    x: 720,
    y: 289,
    src: '/images/characters/Hero.png',
    id: 'hero3',
    withShadow: true,
    hitInterval: 2,
    damagedInterval: 2,
    hitBox: { x1: 18, y1: 10, x2: 12, y2: 25, canWalk: true, canBeDamaged: true, },
    purpose: hero,
    isPlayerControlled: false,
    isEnemy: true,
    behavior: {
        actions: [
            { type: 'sleep', start: 0, end: 300 },
        ],
        speed: 2,
        loop: true,
    },
    speed: 1,
})

const enemies = new Array(5).fill(0).map((_, i) => new Person({
    x: 1 * Math.random() * 1000,
    y: 1 * Math.random() * 1000,
    src: Math.random() > 0.5 ? '/images/characters/Hero.png' : './images/characters/Ash.png',
    id: 'hero' + i * Math.random(),
    withShadow: true,
    hitInterval: 2,
    damagedInterval: 2,
    hitBox: { x1: 18, y1: 10, x2: 12, y2: 25, canWalk: true, canBeDamaged: true, },
    purpose: hero,
    isPlayerControlled: false,
    isEnemy: true,
    speed: 1,
}))

const ballons = new InteractiveObject({
    x: 660,
    y: 370,
    src: 'images/gameObjects/ballons/ballons.svg',
    player: hero,
    radius: 30,
    tip: 'youCanUseTip',
    animations: {
        'idle-down': [ [0, 0] ],
        'idle-down-near': [ [0, 1] ],
        'drawing': [ [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], ],
    },
    spriteSize: 60,
    behaviorOnUse: { type: 'draw' },
    hitBox: { x1: 0, y1: 0, x2: 0, y2: 0, canWalk: true },
})

window.GameWorldMaps = {
    Railway: {
        name: '???????????? ????????',
        mapSrc: '/images/maps/railway/Railway1.png',
        events: {},
        sounds: {
          step: new Sound({
              src: './sounds/fx/step.mp3',
              playingInterval: 18,
              volume: 0.5,
          }),
          hide: new Sound({
            src: './sounds/fx/hide.mp3',
            playingInterval: 5,
            volume: 1,
          }),
          unhide: new Sound({
                src: './sounds/fx/unhide.mp3',
                playingInterval: 5,
                volume: 1,
          }),
          swing: new Sound({
            src: './sounds/fx/swing.mp3',
            playingInterval: 1,
            volume: 0.5,
          }),
          hit: new Sound({
            src: './sounds/fx/hit.mp3',
            playingInterval: 5,
            volume: 0.7,
          }),
          xp: new Sound({
            src: './sounds/fx/xp1.mp3',
            playingInterval: 2,
            volume: 0.3,
          }),
          train: new Sound({
            src: './sounds/fx/train.wav',
            playingInterval: 20,
            volume: 0.3,
          }),
          text: new Sound({
            src: './sounds/fx/text.mp3',
            playingInterval: 3,
            volume: 0.5,
          }),
          observed: new Sound({
            src: './sounds/fx/notObserved.mp3',
            playingInterval: 3,
            volume: 0.7,
          }),
           notObserved: new Sound({
            src: './sounds/fx/observed2.mp3',
            playingInterval: 3,
            volume: 0.5,
           }),
        },
        gameObjects: {
            delayedCamera: new DelayedCamera({ player: hero }),
            cameraShaker: new CameraShaker({
                transformInterval: 0.05,
            }),
            xpProgress: new ProgressBar({
                x: 50,
                y: 26,
                color: '#422EEA',
                width: 97,
                height: 5,
                player: hero,
                parameter: 'xp',
                maxValueParameter: 'xpForNextLevel',
            }),
            moneyStatus: new TextStatus({
                x: 50,
                y: 44,
                color: '#3BD67B',
                player: hero,
                parameter: 'money',
                label: 'cash',
            }),
            lifeStatus: new TextStatus({
                x: 92,
                y: 44,
                color: '#EA2EA0',
                player: hero,
                parameter: 'lifes',
                label: 'hp',
                margin: 14,
            }),
            xpStatus: new TextStatus({
                x: 127,
                y: 44,
                color: '#422EEA',
                player: hero,
                parameter: 'xp',
                label: 'xp',
                maxValueParameter: 'xpForTheNextLevel',
                margin: 14,
            }),
            isPlayerVisibleByOthers: new PlayerVisibilityStatusHUD({
                x: 232,
                y: 100,
                src: './images/ui/findedByOthers.svg',
                spriteSize: 24,
                player: hero,
                animations: {
                    'not-visible': [ [0, 0], ],
                    'transition-to-not-visible': [ [3, 0], [2, 0], [1, 0], [0, 0] ],
                    'transition-to-visible': [ [0, 0], [1, 0], [2, 0], [3, 0] ],
                    'visible': [ [0, 1], ]
                },
                animationFrameLimit: 5,
                zIndex: 1,
            }),
            playerInfo: new HUD({
                x: 5,
                y: 5,
                src: './images/ui/characterInfo.svg',
                spriteSize: 149,
                animations: { 'idle-down': [ [0, 0], [1, 0] ] },
                zIndex: 1,
                animationFrameLimit: 12,
            }),
            logo: new HUD({
                x: 375,
                y: 7,
                src: './images/logo.svg',
                withoutCropping: true,
            }),
            frame: new HUD({
                x: 0,
                y: 0,
                src: './images/ui/frame.png',
                withoutCropping: true,
            }),
            hero,
            hero2,
            hero3,
            // ...enemies,
            bushesGroup: new GameObject({
                x: 0,
                y: 475,
                src: '/images/gameObjects/Plants/BushesGroup.png',
                hitBox: { x1: 0, y1: 38, x2: 506, y2: 15 },
                withoutCropping: true,
            }),
            newBush: new InteractiveObject({
                x: 560,
                y: 400,
                src: '/images/gameObjects/Plants/newBush.svg',
                hitBox: { x1: 0, y1: 0, x2: 0, y2: 0, canWalk: true },
                animations: {
                    'idle-down': [[0, 0]],
                    'idle-down-near': [[0, 1]]
                },
                player: hero,
                radius: 30,
                playerCanUse: true,
                tip: 'youCanUseTip',
                behaviorOnUse: { type: 'hide' },
                particles: 'leafs',
            }),
            newBush2: new InteractiveObject({
                x: 420,
                y: 245,
                src: '/images/gameObjects/Plants/newBush.svg',
                hitBox: { x1: 0, y1: 0, x2: 0, y2: 0, canWalk: true },
                animations: {
                    'idle-down': [[0, 0]],
                    'idle-down-near': [[0, 1]]
                },
                player: hero,
                radius: 30,
                playerCanUse: true,
                behaviorOnUse: { type: 'hide' },
                particles: 'leafs',
                tip: 'youCanUseTip',
            }),
            tower: new GameObject({
                x: 498,
                y: 110,
                src: '/images/gameObjects/Tower.png',
                hitBox: { x1: 0, y1: 142, x2: 37, y2: 1 },
                withoutCropping: true,
            }),
            tree: new GameObject({
                x: 698,
                y: 152,
                src: '/images/gameObjects/Plants/Tree.png',
                hitBox: { x1: 23, y1: 90, x2: 9, y2: 1, canWalk: true },
                withoutCropping: true,
            }),
            wall: new GameObject({
                x: 0,
                y: 110,
                src: '/images/gameObjects/Walls/Wall1.png',
                hitBox: { x1: 0, y1: 0, x2: 790, y2: 67 },
                withoutCropping: true,
            }),
            bushes: new GameObject({
                x: 629,
                y: 264,
                src: '/images/gameObjects/Plants/Bushes.png',
                hitBox: { x1: 0, y1: -7, x2: 0, y2: 0, canWalk: true },
                withoutCropping: true,
            }),
            ballons,
            grass: new GameObject({
                x: 400,
                y: 440,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass3: new GameObject({
                x: 350,
                y: 465,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass5: new GameObject({
                x: 470,
                y: 405,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass6: new GameObject({
                x: 490,
                y: 455,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass7: new GameObject({
                x: 500,
                y: 220,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass8: new GameObject({
                x: 540,
                y: 210,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass9: new GameObject({
                x: 450,
                y: 216,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass10: new GameObject({
                x: 570,
                y: 200,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
            grass11: new GameObject({
                x: 420,
                y: 208,
                src: '/images/gameObjects/plants/Grass.png',
                animationFrameLimit: 12,
            }),
        }
    },
    Street: {
        name: '???????????? ????????',
        mapSrc: '',
        events: {},
        sounds: {
            step: new Sound({
                src: './sounds/fx/step.mp3',
                playingInterval: 18,
                volume: 0.5,
            }),
            hide: new Sound({
                src: './sounds/fx/hide.mp3',
                playingInterval: 5,
                volume: 1,
            }),
            unhide: new Sound({
                src: './sounds/fx/unhide.mp3',
                playingInterval: 5,
                volume: 1,
            }),
            swing: new Sound({
                src: './sounds/fx/swing.mp3',
                playingInterval: 1,
                volume: 0.5,
            }),
            hit: new Sound({
                src: './sounds/fx/hit.mp3',
                playingInterval: 5,
                volume: 0.7,
            }),
            xp: new Sound({
                src: './sounds/fx/xp1.mp3',
                playingInterval: 2,
                volume: 0.3,
            }),
            train: new Sound({
                src: './sounds/fx/train.wav',
                playingInterval: 20,
                volume: 0.3,
            }),
            text: new Sound({
                src: './sounds/fx/text.mp3',
                playingInterval: 3,
                volume: 0.5,
            }),
            observed: new Sound({
                src: './sounds/fx/notObserved.mp3',
                playingInterval: 3,
                volume: 0.7,
            }),
            notObserved: new Sound({
                src: './sounds/fx/observed2.mp3',
                playingInterval: 3,
                volume: 0.5,
            }),
        },
        gameObjects: {
            delayedCamera: new DelayedCamera({ player: hero }),
            cameraShaker: new CameraShaker({
                transformInterval: 0.05,
            }),
            xpProgress: new ProgressBar({
                x: 50,
                y: 26,
                color: '#422EEA',
                width: 97,
                height: 5,
                player: hero,
                parameter: 'xp',
                maxValueParameter: 'xpForNextLevel',
            }),
            moneyStatus: new TextStatus({
                x: 50,
                y: 44,
                color: '#3BD67B',
                player: hero,
                parameter: 'money',
                label: 'cash',
            }),
            lifeStatus: new TextStatus({
                x: 92,
                y: 44,
                color: '#EA2EA0',
                player: hero,
                parameter: 'lifes',
                label: 'hp',
                margin: 14,
            }),
            xpStatus: new TextStatus({
                x: 127,
                y: 44,
                color: '#422EEA',
                player: hero,
                parameter: 'xp',
                label: 'xp',
                maxValueParameter: 'xpForTheNextLevel',
                margin: 14,
            }),
            isPlayerVisibleByOthers: new PlayerVisibilityStatusHUD({
                x: 232,
                y: 100,
                src: './images/ui/findedByOthers.svg',
                spriteSize: 24,
                player: hero,
                animations: {
                    'not-visible': [ [0, 0], ],
                    'transition-to-not-visible': [ [3, 0], [2, 0], [1, 0], [0, 0] ],
                    'transition-to-visible': [ [0, 0], [1, 0], [2, 0], [3, 0] ],
                    'visible': [ [0, 1], ]
                },
                animationFrameLimit: 5,
                zIndex: 1,
            }),
            playerInfo: new HUD({
                x: 5,
                y: 5,
                src: './images/ui/characterInfo.svg',
                spriteSize: 149,
                animations: { 'idle-down': [ [0, 0], [1, 0] ] },
                zIndex: 1,
                animationFrameLimit: 12,
            }),
            // logo: new HUD({
            //     x: 375,
            //     y: 7,
            //     src: './images/logo.svg',
            //     withoutCropping: true,
            // }),
            frame: new HUD({
                x: 0,
                y: 0,
                src: './images/ui/frame.png',
                withoutCropping: true,
            }),
            hero,
        }
    },
}