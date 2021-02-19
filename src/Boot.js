import 'phaser';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // this.load.image('loading', require('../assets/loading.png'));
  }

  create() {
    this.scene.start('Preloader');
  }
}
