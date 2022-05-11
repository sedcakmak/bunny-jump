import Phaser from "../lib/phaser.js";

export default class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("character-select");
  }
  preload() {
    this.load.image("background-start", "assets/bg_layer4.png");
  }

  create() {
    console.log("Character Select working");
    this.add.image(140, 320, "background-start").scale = 0.5;
    this.input.keyboard.once("keydown-SPACE", this.handleContinue, this);
  }
  handleContinue() {
    this.scene.start("game", { character: this.selectedKey });
  }
}
