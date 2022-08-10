(() => {

    const music = new Howl({
        src: ['./sounds/music/theme.mp3'],
        loop: true,
        volume: 1,
    })

    music.play();

    const world = new World({
        element: document.querySelector('.game-container')
    });
    world.init();

})()