import 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    const { width, height } = this.game.canvas;
    this.loading = this.add.text(width / 2, height / 2, 'Loading...', { fontSize: '32px' }).setOrigin(0.5);
    this.load.image('title', require('../Assets/Sprites/Title.png'));
    this.load.image('tips', require('../Assets/Sprites/Tips.png'));
    this.load.image('chika', require('../Assets/Sprites/Chika.jpg'));
    Array.from(Array(21).keys()).forEach((index) => {
      this.load.image(`comic-${index}`, require('../Assets/Sprites/GameComic-' + `${index}`.padStart(2, '0') + '.jpg'));
    })
    this.load.image('comic-final', require('../Assets/Sprites/GameComic-Final.jpg'));
    this.load.audio('chika1', require('../Assets/Audio/Effects/Chika1.mp3'));
    this.load.audio('chika2', require('../Assets/Audio/Effects/Chika2.mp3'));
    this.load.audio('confirm', require('../Assets/Audio/Effects/Confirm.mp3'));
    this.load.audio('explosion', require('../Assets/Audio/Effects/Explosion.mp3'));
    this.load.audio('next', require('../Assets/Audio/Effects/NextPage.mp3'));
    this.load.audio('start', require('../Assets/Audio/Effects/Start.mp3'));
    this.load.audio('whistle', require('../Assets/Audio/Effects/Whistle.mp3'));
    this.load.audio('wrong', require('../Assets/Audio/Effects/Wrong.mp3'));
    this.load.audio('op', require('../Assets/Audio/Music/Title.mp3'));
    this.load.video('op1', require('../Assets/Vidoes/Op-01.mp4'));
    this.load.video('op2', require('../Assets/Vidoes/Op-02.mp4'));
  }

  create() {
    const { width, height } = this.game.canvas;
    this.sound.pauseOnBlur = false;
    this.loading.visible = false;
    this.enter = this.add.text(width / 2, height / 2, 'Click To Enter', { fontSize: '32px' }).setOrigin(0.5);
    // this.enter.setInteractive();
    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
}
