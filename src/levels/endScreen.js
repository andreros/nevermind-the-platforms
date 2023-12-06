import { AUDIO_THEMES, IMAGES } from "../assets.js";
import { engine } from "../engine.js";

export const endScreen = {
    preload: function (scope) {
        engine.preload(scope);
        scope.load.image("background", IMAGES.ENDGAME);
        scope.load.image("ground", IMAGES.PLATFORM);
        scope.load.audio("theme", [AUDIO_THEMES.SMELLS]);
    },

    create: function (scope) {
        engine.create(scope, true);
    },

    update: function (scope) {
        engine.gameOver(scope);
    },
};
