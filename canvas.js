window.onload = () =>
    new Phaser.Game({
        type: Phaser.HEADLESS,
        parent: 'game',
        scene: {
            create
        },
        height: 1,
        width: 1
    });

function create () {
    console.log('create', room);
}
