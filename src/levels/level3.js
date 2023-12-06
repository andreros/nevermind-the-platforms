import { level4 } from "./level4.js";
import { AUDIO_THEMES, IMAGES } from "../assets.js";
import { engine, game } from "../engine.js";
import { getLevelConfiguration } from "../tools.js";

export const level3 = {
    preload: function (scope) {
        engine.preload(scope);
        scope.load.image("background", IMAGES.LEVEL3);
        scope.load.image("ground", IMAGES.PLATFORM);
        scope.load.audio("theme", [AUDIO_THEMES.COME]);
    },

    create: function (scope) {
        engine.create(scope);
        game.platforms.create(400, 610, "ground").setScale(2).refreshBody();
        game.platforms.create(100, 180, "ground").setScale(0.5).refreshBody();
        game.platforms.create(400, 300, "ground").setScale(0.5).refreshBody();
        game.platforms.create(200, 420, "ground");
        game.platforms.create(50, 300, "ground");
        game.platforms.create(650, 150, "ground");
    },

    update: function () {
        engine.update();
        if (game.score >= engine.getGameDifficulty())
            engine.completeLevel(getLevelConfiguration(level4));
    },
};
