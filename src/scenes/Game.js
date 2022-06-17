import Phaser from "../lib/phaser.js";
import Carrot from "../game/Carrot.js";
import Flame from "../game/Flame.js";
import Sun from "../game/Sun.js";
import Spring from "../game/Spring.js";

let sfx, platformCollider, playerIsHit, life, levelIsCompleted, X, Y;

export default class Game extends Phaser.Scene {
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

  sunMoving() {
    if (
      (this.sun.body.velocity.x > 0 &&
        this.sun.x > this.scale.width - this.sun.width / 4) ||
      (this.sun.body.velocity.x < 0 && this.sun.x < this.sun.width / 4)
    ) {
      this.sun.body.velocity.x *= -1;
    }
  }
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Carrot} carrot
   */
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Flame} flame
   */
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Sun} sun
   */
  /**
   * @param {Phaser.Physics.Arcade.Sprite} player
   * @param {Spring} spring
   */

  addSpring(X, Y) {
    console.log("adding");
    /** @type {Phaser.Physics.Arcade.Sprite} */
    let spring = this.spring.create(X, Y, "jumper", ["spring_in.png"]);
    spring.setActive(true);
    spring.setVisible(true);
    this.add.existing(spring, true);
    spring.body.setSize(spring.width, spring.height);
    this.physics.world.enable(spring);
    return spring;
  }

  flameHit(player, flame) {
    playerIsHit = true;
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
  sunHit(player, sun) {
    console.log("sunHit");
    playerIsHit = true;
    // this.sun.killAndHide(sun);
    // this.physics.world.disableBody(player.body);
    this.physics.world.disableBody(sun.body);
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
    const value = `${this.carrotsCollected}`;
    this.carrotsCollectedText.text = value;
  }

  /** @type {Phaser.Physics.Arcade.Sprite} */
  player;
  /** @type {Phaser.Physics.Arcade.Sprite} */
  sun;

  /** @type {Phaser.Physics.Arcade.StaticGroup} */
  platforms;
  /** @type {Phaser.Physics.Arcade.StaticBody} */
  spring;

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
    if (!life) life = 3;
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
    this.load.audio("game-over", "assets/sfx/game-over.ogg");
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  create() {
    if (this.textures.exists("background-start"))
      this.textures.remove("background-start");
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    sfx = this.sound.add("jump");
    this.platforms = this.physics.add.staticGroup();

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

    this.anims.create({
      key: "roaming",
      frames: this.anims.generateFrameNames("jumper", {
        prefix: "sun",
        end: 1,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.sun = this.physics.add
      .sprite(40, 320)
      .play("roaming")
      .setScale(0.5)
      .setVelocityX(200)
      .setCircle(30);
    this.sun.body.allowGravity = false;

    // console.log(this.textures.list.jumper.frames);
    //this.sun.enableBody = true;

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

    this.sun.body.checkCollision.up = true;
    this.sun.body.checkCollision.down = true;
    this.sun.body.checkCollision.left = true;
    this.sun.body.checkCollision.right = true;

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({
      classType: Carrot,
    });
    this.flames = this.physics.add.group({
      classType: Flame,
    });
    this.spring = this.physics.add.group({
      classType: Spring,
    });
    this.physics.add.collider(this.platforms, this.carrots);
    this.physics.add.collider(this.player, this.flames);
    this.physics.add.collider(
      this.player,
      this.sun,
      this.sunHit,
      undefined,
      this
    );

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

    this.physics.add.collider(this.platforms, this.spring);
    this.physics.add.collider(this.player, this.spring);

    this.physics.add.overlap(
      this.player,
      this.spring,
      this.testing,
      undefined,
      this
    );

    const style = {
      color: "#000",
      fontSize: 18,
      fontStyle: "900 italic",
      strokeThickness: 1,
      stroke: "black",
      padding: 4,
      shadow: {
        offsetX: 1,
        offsetY: 1,
        color: "green",
        blur: 1,
        fill: true,
        stroke: true,
      },
    };
    this.add
      .sprite(10, 10, "jumper", "carrots.png")
      .setScale(1, 1)
      .setScrollFactor(0)
      .setOrigin(0, 0)
      .setDepth(1);

    this.carrotsCollectedText = this.add
      .text(33, 28, "0", style)
      .setScrollFactor(0)
      .setOrigin(0, 0)
      //z-index AKA setDepth
      .setDepth(1);
  }
  update(t, dt) {
    this.platforms.children.iterate((child) => {
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const platform = child;
      const scrollY = this.cameras.main.scrollY;
      if (!levelIsCompleted) {
        this.sunMoving();
        if (platform.y >= scrollY + 700) {
          platform.y = scrollY - Phaser.Math.Between(50, 100);
          platform.body.updateFromGameObject();
          this.addCarrotAbove(platform);
          this.addFlameAbove(platform);
        }
      } else {
        this.endCurrentLevel();
      }
    });

    //const touchingDown = this.player.body.touching.down;
    const touchingDown = this.player.body.onFloor();

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
    if (!playerIsHit) {
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
      this.sound.play("dead");
      this.gameOver();
    }
    this.remainingLife(life);

    if (this.carrotsCollected >= 2) levelIsCompleted = true;

    if (levelIsCompleted) {
      this.findTopMostPlatform();
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
  findTopMostPlatform() {
    const platformy = this.platforms.getChildren();
    X = platformy[0].x;
    Y = platformy[0].y - platformy[0].displayHeight;
    // return X, Y;
    this.addSpring(X, Y);
    // }
  }

  gameOver() {
    life === 1
      ? this.scene.start("game-over") && this.sound.play("game-over")
      : this.scene.start("game");
    life--;
    playerIsHit = false;
  }

  remainingLife(life) {
    let lives = this.add.group();
    for (var i = 0; i < life; i++) {
      lives
        .create(440 - i * 35, 10, "jumper", "lifes.png")
        .setScale(0.6, 0.6)
        .setScrollFactor(0)
        .setOrigin(0, 0)
        .setDepth(1);
    }
  }

  endCurrentLevel() {
    console.log("endCurrentLevel working");
  }
}
