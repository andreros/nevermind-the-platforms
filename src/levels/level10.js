import { level11 } from "./level11.js";
import { AUDIO_THEMES, IMAGES } from "../assets.js";
import { engine, game } from "../engine.js";
import { getLevelConfiguration } from "../tools.js";

export const level10 = {
    preload: function (scope) {
        engine.preload(scope);
        scope.load.image("background", IMAGES.LEVEL10);
        scope.load.image("ground", IMAGES.PLATFORM);
        scope.load.audio("theme", [AUDIO_THEMES.STAY_AWAY]);
    },

    create: function (scope) {
        engine.create(scope);
        game.platforms.create(400, 610, "ground").setScale(2).refreshBody();
        game.platforms.create(600, 420, "ground");
        game.platforms.create(50, 270, "ground");
        game.platforms.create(750, 240, "ground");
    },

    update: function () {
        engine.update();
        if (game.score >= engine.getGameDifficulty())
            engine.completeLevel(getLevelConfiguration(level11));
    },
};
