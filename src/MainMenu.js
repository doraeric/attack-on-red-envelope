import 'phaser';
import Flash from 'phaser3-rex-plugins/plugins/flash.js';
const GetValue = Phaser.Utils.Objects.GetValue;

class FlashPlus extends Flash {
  constructor(gameObject, config) {
    super(gameObject, config);

    this.visibleRatio = GetValue(config, 'visibleRatio', 0.5);
  }

  update(time, delta) {
    if ((!this.isRunning) || (!this.enable)) {
      return this;
    }

    if ((this.timeScale === 0) || (delta === 0)) {
      return this;
    }

    this.nowTime += (delta * this.timeScale);
    var visible = (this.nowTime <= (this.duration * (1 - this.visibleRatio))) ? false : true;
    this.gameObject.setVisible(visible);

    if (this.nowTime >= this.duration) {
      if ((this.repeat === -1) || (this.repeatCounter < this.repeat)) {
        this.repeatCounter++;
        this.nowTime -= this.duration;
      } else {
        this.complete();
      }
    }
    return this;
  }
}

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    const { width, height } = this.game.canvas;
    this.op1 = this.add.video(width / 2, height / 2, 'op1');
    this.op2 = this.add.video(width / 2, height / 2, 'op2');
    const scaleFactor = width / this.op1.width;
    this.op1.scale = scaleFactor;
    this.op2.scale = scaleFactor;
    this.op2.visible = false;
    this.add.image(width / 2, height / 2, 'title').scale = 0.87;
    this.tips = this.add.image(width / 2, height * 0.67, 'tips');
    this.tips.scale = 0.6
    this.flashTips = new FlashPlus(this.tips, { duration: 2000, tickingMode: 'always', visibleRatio: 0.75 });
    this.flashTips.flash();
    this.flashTips.on('complete', function (_, flash) {
      flash.flash();
    });
  }

  create() {
    this.music = this.sound.play('op', { loop: true });

    this.op1.on('complete', () => {
      this.op2.visible = true;
      this.op2.play(true);
    });
    this.op1.play();
    this.input.once('pointerdown', () => {
      this.scene.start('MainGame');
    });
  }
}
