import Phaser from "../lib/phaser.js";

let bunny1, bunny2, bunny1_text, bunny2_text;

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
    this.add
      .text(240, 100, "Choose Your Bunny!", {
        fontSize: 42,
        fontStyle: 900,
        color: "green",
      })
      .setOrigin(0.5);

    bunny2_text = this.add
      .text(240, 150, "Start with Purple Bunny!", {
        fontSize: 26,
        fontStyle: 900,
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        color: "#BC71E0",
      })
      .setOrigin(0.5)
      .setVisible(false);

    bunny1_text = this.add
      .text(240, 150, "Start with Brown Bunny!", {
        fontSize: 26,
        fontStyle: 900,
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        color: "#B67B3F",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.add.image(140, 320, "background-start").scale = 0.5;
    //this.input.keyboard.once("keydown-SPACE", this.handleContinue, this);
    bunny1 = this.add.sprite(340, 430, "jumper", "bunny1_stand.png");
    bunny2 = this.add.sprite(140, 430, "jumper", "bunny2_stand.png");
    bunny1.alpha = 0.5;
    bunny2.alpha = 0.5;
    //bunny2.inputEnabled = true;

    bunny2.setInteractive();
    bunny1.setInteractive();

    bunny2.on(
      "pointerover",
      function () {
        bunny2.alpha = 1;
        bunny2_text.setVisible(true);
      },
      this
    );

    bunny2.on("pointerout", function () {
      bunny2.alpha = 0.5;
      bunny2_text.setVisible(false);
      // bunny2_text.destroy();
    });
    bunny2.on("pointerdown", function () {
      this.scene.scene.start("game", { character: this.frame.name });
    });

    bunny1.on(
      "pointerover",
      function () {
        bunny1.alpha = 1;
        bunny1_text.setVisible(true);
      },
      this
    );

    bunny1.on("pointerout", function () {
      bunny1.alpha = 0.5;
      bunny1_text.setVisible(false);
    });
    bunny1.on("pointerdown", function () {
      this.scene.scene.start("game", { character: this.frame.name });
    });
  }
  // handleContinue() {
  //   this.scene.start("game", { character: this.selectedKey });
  // }

  update() {}
}
