import { AUDIO, IMAGES } from "./assets.js";
import { baseConfig } from "./tools.js";

export const game = {
    player: undefined,
    stars: undefined,
    bombs: undefined,
    platforms: undefined,
    cursors: undefined,
    difficulty: 1,
    score: 0,
    level: 1,
    levelScoreGoal: 240,
    gameOver: false,
    scoreText: undefined,
    levelText: undefined,
    music: undefined,
    instance: undefined,
    config: baseConfig,
};

export const engine = {
    scope: undefined,

    /**
     * preload method.
     * Method invoked by the Phaser Game Engine before the canvas is loaded.
     */
    preload: function (scope) {
        engine.scope = scope;
        scope.load.image("star", IMAGES.STAR);
        scope.load.image("bomb", IMAGES.BOMB);
        scope.load.spritesheet("dude", IMAGES.DUDE, {
            frameWidth: 32,
            frameHeight: 48,
        });
        scope.load.audio("collectPrize", [AUDIO.KEY]);
    },

    /**
     * create method.
     * Method responsible for creating all the game assets when a level is loaded.
     */
    create: function (scope, gameOver) {
        //  A simple background for our game
        scope.add.image(400, 300, "background");

        //  The platforms group contains the ground and the 2 ledges we can jump on
        game.platforms = scope.physics.add.staticGroup();

        // The player and its settings
        game.player = scope.physics.add.sprite(100, 450, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        game.player.setBounce(0.2);
        game.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        scope.anims.create({
            key: "left",
            frames: scope.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        scope.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        scope.anims.create({
            key: "right",
            frames: scope.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        //  Input Events
        game.cursors = scope.input.keyboard.createCursorKeys();

        if (!gameOver) {
            //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
            game.stars = scope.physics.add.group({
                key: "star",
                repeat: 23,
                setXY: { x: 12, y: 0, stepX: 33.5 },
            });

            game.stars.children.iterate(function (child) {
                //  Give each star a slightly different bounce
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });

            game.bombs = scope.physics.add.group();
        }

        //  The score and level
        game.scoreText = scope.add.text(16, 16, "Score: " + game.score, {
            fontSize: "32px",
            fill: "#0F0",
        });
        if (game.level < 13) {
            game.levelText = scope.add.text(620, 16, "Level: " + game.level, {
                fontSize: "32px",
                fill: "#0F0",
            });
        }

        //  Collide the player and the stars with the platforms
        scope.physics.add.collider(game.player, game.platforms);
        scope.physics.add.collider(game.stars, game.platforms);
        scope.physics.add.collider(game.bombs, game.platforms);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectPrize function
        scope.physics.add.overlap(
            game.player,
            game.stars,
            engine.collectPrize,
            null,
            this
        );

        scope.physics.add.collider(
            game.player,
            game.bombs,
            engine.hitBomb,
            null,
            this
        );

        //  Load music theme and play it
        game.music = scope.sound.add("theme", {
            loop: true,
            volume: 1,
        });
        game.music.play();
    },

    /**
     * update method.
     * Method called on every game loop. This method is responsible for making each loop's
     * verifications and calculations.
     */
    update: function () {
        if (game.gameOver) {
            game.music.destroy();
            return;
        }
        if (game.cursors.left.isDown) {
            game.player.setVelocityX(-160);
            game.player.anims.play("left", true);
        } else if (game.cursors.right.isDown) {
            game.player.setVelocityX(160);
            game.player.anims.play("right", true);
        } else {
            game.player.setVelocityX(0);
            game.player.anims.play("turn");
        }
        if (game.cursors.up.isDown && game.player.body.touching.down) {
            game.player.setVelocityY(-330);
        }
    },

    /**
     * getGameDifficulty function.
     * Function responsible for calculating and returning the necessary score to pass each level.
     */
    getGameDifficulty: function () {
        var goalScore = 0;
        switch (game.difficulty) {
            case 3:
            case 2:
            case 1:
                if (game.level >= 10 && game.level < 13) {
                    // before scoring enough to complete the level:
                    // three bombs in levels 10 to 12
                    goalScore =
                        game.levelScoreGoal * game.level +
                        game.levelScoreGoal * (game.level + 1);
                } else if (game.level >= 7 && game.level < 10) {
                    // before scoring enough to complete the level:
                    // two bombs in levels 7 to 9
                    goalScore =
                        game.levelScoreGoal * game.level +
                        game.levelScoreGoal * game.level;
                } else if (game.level < 7) {
                    // before scoring enough to complete the level:
                    // no bombs in level 1
                    // one bomb in levels 2 to 6
                    goalScore =
                        game.levelScoreGoal * game.level +
                        game.levelScoreGoal * (game.level - 1);
                }
                break;
            case 0:
            default:
                // before scoring enough to complete the level:
                // no bombs in any level
                goalScore = game.levelScoreGoal * game.level;
                break;
        }
        return goalScore;
    },

    /**
     * collectPrize method.
     * Method responsible for performing the collection of a prize.
     */
    collectPrize: function (player, star) {
        star.disableBody(true, true);

        //  Add and update the score
        game.score += 10;
        game.scoreText.setText("Score: " + game.score);

        //  Load sound fx and play it
        var collectPrize = engine.scope.sound.add("collectPrize");
        collectPrize.play();

        if (game.stars.countActive(true) === 0) {
            //  A new batch of stars to collect
            game.stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });

            var x =
                game.player.x < 400
                    ? Phaser.Math.Between(400, 800)
                    : Phaser.Math.Between(0, 400);

            var bomb = game.bombs.create(x, 16, "bomb");
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bomb.allowGravity = false;
        }
    },

    /**
     * hitBomb method.
     * Method responsible for performing the hit on a bomb.
     */
    hitBomb: function (player, bomb) {
        engine.scope.physics.pause();
        game.player.setTint(0xff0000);
        game.player.anims.play("turn");
        game.gameOver = true;
        engine.scope.add.text(220, 280, "Game Over!", {
            fontSize: "64px",
            fill: "#0F0",
        });
    },

    /**
     * completeLevel method.
     * Method responsible for completing a level and passing to the next one.
     */
    completeLevel: function (config) {
        game.instance.destroy(true);
        game.level += 1;
        game.config = config;
        game.instance = new Phaser.Game(game.config);
    },

    /**
     * gameOver method.
     * Method responsible for terminating the game.
     */
    gameOver: function (scope) {
        game.player.anims.play("turn");
        game.gameOver = true;
        scope.add.text(220, 280, "Game Over!", {
            fontSize: "64px",
            fill: "#0F0",
        });
        game.instance.destroy();
    },
};
