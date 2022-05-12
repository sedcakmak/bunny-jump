import Phaser from "../lib/phaser.js";
let bunny1, bunny2, anim, bunnyanim, plane;
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
    console.log(this);

    this.add.image(140, 320, "background-start").scale = 0.5;
    this.input.keyboard.once("keydown-SPACE", this.handleContinue, this);
    bunny1 = this.add.sprite(340, 430, "jumper", "bunny1_stand.png");
    bunny2 = this.add.sprite(140, 430, "jumper", "bunny2_stand.png");
    bunnyanim = this.add.sprite(140, 430, "jumper", ["bunny2_jump.png"], 5);

    this.anims.create({
      key: "fly",
      frameRate: 7,
      frames: this.anims.generateFrameNumbers("jumper", {
        start: 3,
        end: 5,
      }),
      repeat: -1,
    });

    plane = this.add.sprite(640, 360, "jumper", ["bunny2_jump.png"]);
    plane.play("fly");

    // anim = bunnyanim.animations.add("jump");

    //bunny2.inputEnabled = true;
    bunny2.setInteractive();

    // bunny2.events.onInputOver.add(over, this);
  }
  handleContinue() {
    this.scene.start("game", { character: this.selectedKey });
  }

  update() {
    bunny2.on(
      "pointerover",
      function () {
        anim.play(10, true);
      },
      this
    );

    bunny2.on("pointerout", function () {
      console.log("out");
    });
  }
}
//image.events.onInputOver.add(over, this);
//image.events.onInputOut.add(out, this);
