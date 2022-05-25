import Phaser from "../lib/phaser.js";

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
      .text(width * 0.5, height * 0.5, "Press Space Key To Start A New Game", {
        fontSize: 38.5,
        align: "center",
        wordWrap: { width: 440, useAdvancedWrap: true },
      })
      .setOrigin(0.5);
    newGameText.setVisible(false);

    function onEvent() {
      newGameText.setVisible(true);
    }

    this.time.delayedCall(1500, onEvent, [], this);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("character-select");
    });

    // this.input.mouse("onMouseDown", () => {
    //   console.log("mousedown working");
    //   console.log(this.input);
    // });

    this.input.once("mousedownwindow", () => {
      console.log(this.input);
    });
  }
}
