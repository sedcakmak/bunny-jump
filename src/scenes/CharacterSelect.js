import Phaser from "../lib/phaser.js";

export default class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("character-select");
  }
  preload() {
    this.load.image("background-start", "assets/bg_layer2.png");
    this.load.atlasXML(
      "jumper",
      "assets/spritesheet_jumper.png",
      "assets/spritesheet_jumper.xml"
    );
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(240, 100, "Choose Your Bunny!", {
        fontSize: 42,
        fontStyle: 900,
        color: "green",
      })
      .setOrigin(0.5);
    //.setDepth(1); //AKA z-index (so it'll be in front of the background clouds)

    console.log("Character Select working");
    this.add.image(140, 320, "background-start").scale = 0.5;
    this.input.keyboard.once("keydown-SPACE", this.handleContinue, this);
    this.add.sprite(340, 430, "jumper", "bunny1_stand.png");
    this.add.sprite(140, 430, "jumper", "bunny2_stand.png");
  }
  handleContinue() {
    this.scene.start("game", { character: this.selectedKey });
  }
}
