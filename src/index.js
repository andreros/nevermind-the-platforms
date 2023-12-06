import { level1 } from "./levels/level1.js";
import { game } from "./engine.js";
import { getLevelConfiguration } from "./tools.js";

// launch the game's initial configuration
game.instance = new Phaser.Game(getLevelConfiguration(level1));
