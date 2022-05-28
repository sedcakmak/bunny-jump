import Phaser from "../lib/phaser.js";
import TweenHelper from "../lib/TweenHelper.js";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super("game-over");
  }
  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.add
      .text(width * 0.5, height * 0.3, "Game Over", {
        fontSize: 48,
        fontStyle: 600,
      })
      .setOrigin(0.5);

    const newGameText = this.add
      .text(width * 0.5, height * 0.5, "Press Space To Start A New Game", {
        fontSize: 38.5,
        align: "center",
        wordWrap: { width: 440, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setAlpha(0);

    function onEvent() {
      TweenHelper.flashElement(this, newGameText);
    }

    this.time.delayedCall(1000, onEvent, [], this);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("character-select");
    });

    this.input.once("mousedownwindow", () => {
      console.log(this.input);
    });
  }
}
