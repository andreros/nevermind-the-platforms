export const baseConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: {
        preload: function () {},
        create: function () {},
        update: function () {},
    },
    audio: {
        disableWebAudio: true,
    },
};

export function getLevelConfiguration(nextLevel) {
    return Object.assign({}, baseConfig, {
        scene: {
            preload: function () {
                nextLevel.preload(this);
            },
            create: function () {
                nextLevel.create(this);
            },
            update: function () {
                nextLevel.update(this);
            },
        },
    });
}
