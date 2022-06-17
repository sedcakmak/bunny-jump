//03080 babamin kargosu

import Phaser from "../lib/phaser.js";

export default class Spring extends Phaser.Physics.Arcade.Sprite {
  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} texture
   */
  constructor(scene, x, y, texture, [frame]) {
    super(scene, x, y, texture, [frame]);
    this.setScale(0.5);
    this.setOrigin(0.5);
  }
}
