import Phaser from "../lib/phaser.js";
import Carrot from "../game/Carrot.js";
import Flame from "../game/Flame.js";

let sfx, platformCollider, playerIsDead;

export default class Game extends Phaser.Scene {
  //carrotsCollected = 0;

  /** @type {Phaser.GameObjects.Text} */
  carrotsCollectedText;

  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */

  addFlameAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const flame = this.flames.get(sprite.x, y, "jumper", ["flame.png"]);

    flame.setActive(true);
    flame.setVisible(true);

    this.add.existing(flame);

    flame.body.setSize(flame.width, flame.height);
    this.physics.world.enable(flame);
    return flame;
  }
  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;

    // const y = sprite.y - sprite.displayHeight / 2 - 35 / 2;
    /** @type {Phaser.Physics.Arcade.Sprite} */
    const carrot = this.carrots.get(sprite.x, y, "jumper", ["carrot.png"]);

    carrot.setActive(true);
    carrot.setVisible(true);

    this.add.existing(carrot);

    carrot.body.setSize(carrot.width, carrot.height);
    // the other one is deprecated. use this: (i still see no difference though)
    //carrot.setBodySize(carrot.width, carrot.height);
    this.physics.world.enable(carrot);
    return carrot;
  }

  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Flame} flame
   */

  flameHit(player, flame) {
    playerIsDead = true;
    this.flames.killAndHide(flame);

    this.physics.world.disableBody(flame.body);
    // this.physics.world.disableBody(player.body);
    this.bunnyHurtImage();
    // this.physics.world.colliders.destroy();
    this.physics.world.removeCollider(platformCollider);
    this.player.setVelocityY(300);
    this.input.keyboard.enabled = false;
    this.sound.play("dead");

    this.time.delayedCall(1000, this.gameOver, [], this);
  }

  bunnyHurtImage() {
    this.selectedCharacter === "bunny1_stand.png"
      ? this.player.setTexture("jumper", ["bunny1_hurt.png"])
      : this.player.setTexture("jumper", ["bunny2_hurt.png"]);
  }
  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot);
    this.physics.world.disableBody(carrot.body);
    this.carrotsCollected++;
    sfx.stop("jump");
    this.sound.play("collect-carrots");
    const value = `Carrots:${this.carrotsCollected}`;
    this.carrotsCollectedText.text = value;
  }

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;

  /** @type {Phaser.Physics.Arcade.Group} */
  carrots;
  /** @type {Phaser.Physics.Arcade.Group} */
  flames;

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;
  constructor() {
    super("game");
  }

  init(data) {
    this.carrotsCollected = 0;
    this.selectedCharacter = data.character;
    this.input.keyboard.enabled = true;
  }

  preload() {
    this.load.image("background", "assets/bg_layer1.png");
    this.load.atlasXML(
      "jumper",
      "assets/spritesheet_jumper.png",
      "assets/spritesheet_jumper.xml"
    );
    this.load.audio("jump", "assets/sfx/phaseJump1.ogg");
    this.load.audio("dead", "assets/sfx/phaserDown3.ogg");
    this.load.audio("collect-carrots", "assets/sfx/twoTone1.ogg");
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    this.textures.remove("background-start");
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    this.platforms = this.physics.add.staticGroup();
    sfx = this.sound.add("jump");

    // this.add.image(240, 320, "jumper", "carrot.png");
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i;

      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = this.platforms.create(
        x,
        y,
        "jumper",
        "ground_grass.png"
      );
      platform.scale = 0.5;

      /** @type {Phaser.Physics.Arcade.StaticBody} */

      const body = platform.body;
      body.updateFromGameObject();
    }

    if (this.selectedCharacter === "bunny1_stand.png") {
      this.player = this.physics.add
        .sprite(240, 320, "jumper", "bunny1_stand.png")
        .setScale(0.5);
    } else {
      this.player = this.physics.add
        .sprite(240, 320, "jumper", "bunny2_stand.png")
        .setScale(0.5);
    }

    platformCollider = this.physics.add.collider(this.platforms, this.player);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({
      classType: Carrot,
    });
    this.flames = this.physics.add.group({
      classType: Flame,
    });
    this.physics.add.collider(this.platforms, this.carrots);
    this.physics.add.collider(this.player, this.flames);

    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.flames,
      this.flameHit,
      undefined,
      this
    );

    const style = {
      color: "#000",
      fontSize: 24,
      fontStyle: "900 italic",
      strokeThickness: 1,
      stroke: "green",
      padding: 10,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "green",
        blur: 1,
        fill: true,
        stroke: true,
      },
    };
    this.carrotsCollectedText = this.add
      .text(240, 10, "Carrots:0", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
      //z-index AKA setDepth
      .setDepth(1);
  }
  update(t, dt) {
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;

      const scrollY = this.cameras.main.scrollY;
      if (platform.y >= scrollY + 700) {
        platform.y = scrollY - Phaser.Math.Between(50, 100);
        platform.body.updateFromGameObject();
        this.addCarrotAbove(platform);
        this.addFlameAbove(platform);
      }
    });

    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.setVelocityY(-300);
      if (this.selectedCharacter === "bunny1_stand.png") {
        this.player.setTexture("jumper", ["bunny1_jump.png"]);
      } else {
        this.player.setTexture("jumper", ["bunny2_jump.png"]);
      }
      sfx.play();
    }
    const vy = this.player.body.velocity.y;
    if (!playerIsDead) {
      if (this.selectedCharacter === "bunny1_stand.png") {
        if (vy > 0 && this.player.texture.key !== ["bunny1_stand.png"]) {
          this.player.setTexture("jumper", ["bunny1_stand.png"]);
        }
      } else if (this.selectedCharacter === "bunny2_stand.png") {
        if (vy > 0 && this.player.texture.key !== ["bunny2_stand.png"]) {
          this.player.setTexture("jumper", ["bunny2_stand.png"]);
        }
      }
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
      this.selectedCharacter === "bunny1_stand.png"
        ? (this.player.setTexture("jumper", ["bunny1_walk1.png"]).flipX = true)
        : (this.player.setTexture("jumper", ["bunny2_walk1.png"]).flipX = true);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
      this.selectedCharacter === "bunny1_stand.png"
        ? (this.player.setTexture("jumper", ["bunny1_walk1.png"]).flipX = false)
        : (this.player.setTexture("jumper", [
            "bunny2_walk1.png",
          ]).flipX = false);
    } else {
      this.player.setVelocityX(0);
    }

    this.horizontalWrap(this.player);
    // this.player.angle += 0.5; (rotates the sprite)
    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 50) {
      this.bunnyHurtImage();
    }

    if (this.player.y > bottomPlatform.y + 400) {
      this.gameOver();
    }
  }
  //end of update
  /**
   * @param {Phaser.GameObjects.Sprite} sprite
   */

  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; i++) {
      const platform = platforms[i];

      //discarding platforms that are above current

      if (platform.y < bottomPlatform.y) continue;
      bottomPlatform = platform;
    }
    return bottomPlatform;
  }

  gameOver() {
    this.scene.start("game-over");
  }
}
