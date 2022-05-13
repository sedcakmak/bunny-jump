import Phaser from "../lib/phaser.js";

let bunny1, bunny2;
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

    this.anims.create({
      key: "dazzle",
      frameRate: 10,
      repeat: -1,
      frames: "jumper",
      // frames: this.anims.generateFrameNumbers("jumper", { start: 5, end: 8 }),
    });
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

    this.add.image(140, 320, "background-start").scale = 0.5;
    this.input.keyboard.once("keydown-SPACE", this.handleContinue, this);
    bunny1 = this.add.sprite(340, 430, "jumper", "bunny1_stand.png");
    bunny2 = this.add.sprite(140, 430, "jumper", "bunny2_stand.png");
    this.add.sprite(240, 430).play("dazzle");

    // bunny2.anims.add("testing", "bunny_stand.png", [0, 1]);
    bunny2.setInteractive();
    // this.anims.create(
    //   "wobble",

    //   ["bunny2_hurt.png", "bunny2_jump.png", "bunny2_stand.png"],
    //   24
    // );
    //
    //bunny2.inputEnabled = true;

    //this.anims.play("wobble");
    // this.anims.play({ key: "dazzle", startFrame: 7 }, true);
  }
  handleContinue() {
    this.scene.start("game", { character: this.selectedKey });
  }

  update() {
    bunny2.on("pointerover", function () {}, this);

    bunny2.on("pointerout", function () {
      console.log("out");
    });
  }
}
