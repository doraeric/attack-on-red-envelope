import 'phaser';

function shuffleArray(array) {
  if (!Array.isArray(array)) return;
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function randint({ low = 0, high = 0, size = 0, unique = false }) {
  high = high > low ? high : low;
  if (size === 0) return getRandomInt(low, high);
  if (!unique) return Array.from(Array(size).keys()).map(getRandomInt(low, high));
  if (Math.floor(high) - Math.ceil(low) < size) return;
  const return_arr = [];
  while (return_arr.length < size) {
    const tmp = getRandomInt(low, high);
    if (!return_arr.includes(tmp)) {
      return_arr.push(tmp);
    }
  }
  return return_arr;
}

const good = ["福星高照", "幸福犇馳", "財運犇騰", "好運犇放", "犇向幸福", "牛氣沖天", "賺進金牛", "牛兆豐年", "金牛納福", "金牛獻吉", "金牛獻瑞", "金牛賀歲", "牛年大吉", "富貴安康", "迎春納福", "諸事順利", "新年恭喜", "步步高昇", "鴻運當頭", "牛轉乾坤", "萬壽無疆", "日日見財", "飛黃騰達", "長命百歲", "日進斗金", "龍馬精神", "壽比南山", "福如東海", "鴻圖大展", "富貴有餘", "財源廣進", "招財進寶", "年年有餘", "開春大吉", "心想事成", "事事順心"];
const bad = ["梟遙法外", "血流成河", "藤原千花", "自怨自艾", "老萊娛親", "齁山梟子", "火山孝子", "坐以待斃", "坐立難安", "浪漫突進", "本斥但大", "量子糾纏", "耗子尾汁", "三隻小豬", "駕鶴西歸", "賊頭賊腦", "混水摸魚", "大開殺戒", "我家牛排", "魂不守舍", "無精打采", "精疲力盡", "凶神惡煞", "疑神疑鬼", "六神無主", "鬼哭神嚎", "怪力亂神", "貪財好色", "人財兩空", "謀財害命", "不義之財", "非分之財", "自求多福", "作威作福", "擅作威福", "不倫不類", "福過災生", "居心叵測", "居心不良", "痴心妄想", "包藏禍心", "家徒四壁", "不得人心", "牛衣歲月", "鑽牛角尖", "老牛破車", "牛衣夜泣", "吳牛喘月", "對牛彈琴", "牛鬼蛇神", "牛頭馬面", "含笑九泉", "笑裏藏刀"];
const Ending = Object.freeze({
  WRONG: Symbol('wrong'),
  LOW: Symbol('low'),
  MID: Symbol('mid'),
  HIGH: Symbol('high'),
  CHIKA: Symbol('chika'),
});

export default class MainGame extends Phaser.Scene {
  constructor() {
    super('MainGame');
  }

  preload() {
    const { width, height } = this.game.canvas;
    this.chika = this.make.image({
      x: width / 2,
      y: height * 0.26,
      key: `chika`,
    }).setVisible(false);
    const cs = Array.from(Array(21).keys()).map((i) =>
      this.make.image({
        x: width / 2,
        y: height / 2,
        key: `comic-${i}`,
        alpha: 0,
      })
    );
    this.cs = cs;
    cs[2].setY(height * 0.44).setVisible(false).setAlpha(1);
    cs[5].setY(height * 0.25);
    cs[6].setScale(0.73).setY(height * 0.3);
    this.cFinal = this.make.image({
      x: width / 2,
      y: height * 0.26,
      key: `comic-final`,
    }).setVisible(false);
    const fadeIns = Array.from(Array(21).keys()).map((i) =>
      this.tweens.create({
        targets: cs[i],
        alpha: { from: 0, to: 1 },
        duration: 450,
        ease: 'Cubic',
      })
    );
    const fadeOuts = Array.from(Array(21).keys()).map((i) =>
      this.tweens.create({
        targets: cs[i],
        alpha: { from: 1, to: 0 },
        duration: 450,
        ease: 'Cubic',
      })
    );

    this.progress = this.add.rectangle(width / 2, 12, width, 24, 0xffffff).setVisible(false);
    this.progress.tweens = this.tweens.create({
      targets: this.progress,
      ease: 'Linear',
      duration: 30000,
      x: `-=${width}`,
    });

    this.reiner = this.add.text(width * 0.62, height * 0.12, '', {
      fontSize: '40px',
      color: 'black',
      wordWrap: { width: 41, useAdvancedWrap: true },
    }).setVisible(false);
    const texts = {
      wrong1: this.add.text(width * 0.885, height * 0.167, '', {
        fontSize: '26px',
        color: 'black',
        wordWrap: { width: 41, useAdvancedWrap: true },
      }).setAlpha(0),
      wrong2: this.add.text(width * 0.84, height * 0.167, '', {
        fontSize: '26px',
        color: 'black',
        wordWrap: { width: 41, useAdvancedWrap: true },
      }).setAlpha(0),
      wrong3: this.add.text(width / 2, height * 0.56, '', {
        fontSize: '32px',
        color: 'white',
        align: 'center',
      }).setOrigin(0.5, 0.5).setAlpha(0),
    };
    this.texts = texts;
    Object.values(this.texts).forEach((e) => {
      e.fadeIn = this.tweens.create({
        targets: e,
        alpha: { from: 0, to: 1 },
        duration: 450,
        ease: 'Cubic',
      });
      e.fadeOut = this.tweens.create({
        targets: e,
        alpha: { from: 1, to: 0 },
        duration: 450,
        ease: 'Cubic',
      });
    })
    fadeIns[5].on('complete', () => {
      fadeOuts[5].play();
      fadeIns[6].play();
      this.sound.play('explosion');
      texts.wrong1.fadeIn.play();
      texts.wrong2.fadeIn.play();
      texts.wrong3.fadeIn.play();
      this.setOptions(['重新開始'], {
        onSuccess: () => {
          this.scene.restart();
        },
        disableTime: 1000,
      });
    });

    this.optionButtons = Array.from(Array(4).keys()).map(() => {
      return this.add.rectangle(width / 2, height / 2, 320, 100, 0xffffff).setStrokeStyle(6, 0x8c8c8c).setVisible(false);
    });
    this.optionTexts = Array.from(Array(4).keys()).map(() => {
      return this.add.text(width / 2, height / 2, '', {
        fontSize: '40px',
        color: 'black',
      }).setOrigin(0.5, 0.5).setVisible(false);
    });

    this.tweensGroups = [
      [
        fadeIns[0],
      ], [
        fadeOuts[0],
        fadeIns[1],
      ], [
        fadeOuts[1],
      ], [ // 3: ending-wrong
        fadeIns[3]
      ], [
        fadeOuts[3],
        fadeIns[4],
      ], [
        fadeOuts[4],
        fadeIns[5],
      ], [ // 6: low
        fadeIns[7],
      ], [
        fadeOuts[7],
        fadeIns[8],
      ], [
        fadeOuts[8],
        fadeIns[9],
      ], [
        fadeOuts[9],
        fadeIns[10],
      ], [
        fadeOuts[10],
        fadeIns[11],
      ], [ // 11
        fadeIns[12],
      ], [
        fadeOuts[12],
        fadeIns[13],
      ], [
        fadeOuts[13],
        fadeIns[14],
      ], [
        fadeOuts[14],
        fadeIns[15],
      ], [ // 15
        fadeIns[12],
      ], [
        fadeOuts[12],
        fadeIns[13],
      ], [
        fadeOuts[13],
        fadeIns[16],
      ], [
        fadeOuts[16],
        fadeIns[17],
      ], [
        fadeOuts[17],
        fadeIns[18],
      ], [
        fadeOuts[18],
        fadeIns[19],
      ], [
        fadeOuts[19],
        fadeIns[20],
      ]
    ];
  }

  create() {
    this.prologue();
  }

  prologue() {
    this.sound.play('start');

    this.tweensGroups[0].forEach((tweens => {
      // this.tweens.makeActive(tweens);
      tweens.play();
      this.sound.play('next');
    }));
    let counter = 1;
    this.input.on('pointerdown', () => {
      if (this.tweens.getAllTweens().length !== 0) {
        return;
      }
      this.tweensGroups[counter].forEach((tweens => {
        tweens.play();
        this.sound.play('next');
      }));
      counter++;
      if (counter === 3) {
        this.input.removeAllListeners('pointerdown');
        this.playGame();
      }
    });
  }

  playGame() {
    this.sound.play('whistle');
    this.cs[2].setVisible(true);
    this.reiner.setVisible(true);
    this.reiner.text = '艾倫叔叔';
    let score = 0;
    this.optionButtons.forEach(e => {
      e.setInteractive();
    });
    const delayedEvents = [
      this.time.delayedCall(15000, () => this.progress.fillColor = 0xfeff01),
      this.time.delayedCall(25000, () => this.progress.fillColor = 0xff0101),
      this.time.delayedCall(30000, () => {
        this.removeListeners();
        this.sound.play('whistle');
        const ending = score < 15
          ? Ending.LOW
          : score < 30
            ? Ending.MID : Ending.HIGH;
        this.epilogue(ending, score);
      }),
    ];
    this.progress.setVisible(true);
    this.progress.tweens.play();
    /**
     * @param {string} message
     * @param {number} index
     */
    const fail = (message, index) => {
      this.sound.play('confirm');
      this.sound.play('wrong');
      this.time.removeEvent(delayedEvents);
      this.progress.tweens.stop();
      this.progress.setVisible(false);
      this.optionButtons[index].fillColor = 0xff9d9d;
      this.optionButtons[index].strokeColor = 0x8d5659;
      this.removeListeners();

      if (message === '藤原千花') {
        const sfx = this.sound.add('chika1');
        sfx.once('complete', () => {
          this.sound.play('chika2');
          this.epilogue(Ending.CHIKA, score);
        });
        sfx.play();
      } else {
        this.time.delayedCall(500, () => {
          this.epilogue(Ending.WRONG, score, message);
        });
      }
    }
    const s1 = () => {
      score++;
      this.sound.play('confirm');
      if (score === 1) {
        this.setOptions(['恭喜發財'], { onSuccess: s1, onFail: fail });
      } else if (score === 2) {
        this.setOptions(['萬事如意', '紅包拿來'], { onSuccess: s1, onFail: fail });
      } else if (score > 2 && score < 25) {
        this.setOptions([good[getRandomInt(0, good.length)], bad[getRandomInt(0, bad.length)]],
          { onSuccess: s1, onFail: fail });
      } else {
        this.setOptions([good[getRandomInt(0, good.length)], ...randint({
          high: bad.length, size: 3, unique: true,
        }).map((v) => bad[v])], { onSuccess: s1, onFail: fail })
      }
    };
    this.setOptions(['新年快樂'], { onSuccess: s1, onFail: fail });

  }

  epilogue(ending, score, message) {
    let counter = 0;
    if (ending === Ending.CHIKA) {
      this.reiner.setVisible(false);
      this.cs[2].setVisible(false);
      this.optionButtons.forEach((e) => e.setVisible(false));
      this.optionTexts.forEach((e) => e.setVisible(false));
      this.chika.setVisible(true);
      this.texts.wrong3.setText(`你讓萊納講了${score}句吉祥話。\n（我就知道你會忍不住按下去）`);
      this.texts.wrong3.setAlpha(1);
      this.setOptions(['重新開始'], {
        onSuccess: () => {
          this.scene.restart();
        },
        disableTime: 1000,
      });
      return;
    }
    const start = ending === Ending.WRONG
      ? 3
      : ending === Ending.LOW
        ? 6
        : ending === Ending.MID
          ? 11
          : 15;
    const stop = ending === Ending.WRONG
      ? 6
      : ending === Ending.LOW
        ? 11
        : ending === Ending.MID
          ? 15
          : 22;
    if (ending === Ending.WRONG) {
      if (message === '紅包拿來') {
        this.texts.wrong1.setText('都幾歲的人了');
        this.texts.wrong2.setText('還講什麼紅包拿來！');
      } else {
        this.texts.wrong1.setText('﹁' + message + '﹂');
        this.texts.wrong2.setText('是哪門子的吉祥話！');
      }
      this.texts.wrong3.setText(`你讓萊納講了${score}句吉祥話，\n可惜最後講錯話沒有拿到紅包。`)
    } else if (ending === Ending.LOW || ending === Ending.MID || ending === Ending.HIGH) {
      this.reiner.setVisible(false);
      this.cs[2].setVisible(false);
      this.optionButtons.forEach((e) => e.setVisible(false));
      this.optionTexts.forEach((e) => e.setVisible(false));
      if (ending === Ending.LOW)
        this.texts.wrong3.setText(`你只讓萊納講了${score}句吉祥話，\n萊納沒有成功拿到紅包，而法爾可拿到了。`)
      else if (ending === Ending.MID)
        this.texts.wrong3.setText(`你讓萊納講了${score}句吉祥話，\n雖然成功拿到紅包，不過萊納似乎被艾連叔叔嚇到坐下來了。`)
      else if (ending === Ending.HIGH)
        this.texts.wrong3.setText(`你讓萊納耗盡力氣講了${score}句吉祥話並拿到了紅包，\n然而皮克只講了幾句話就輕鬆拿到紅包，\n這讓萊納大受打擊（？`)

      this.tweensGroups[start + counter].forEach((tweens => tweens.play()));
      counter++;
    }

    this.input.on('pointerdown', () => {
      if (counter === 0) {
        this.reiner.setVisible(false);
        this.cs[2].setVisible(false);
        this.optionButtons.forEach((e) => e.setVisible(false));
        this.optionTexts.forEach((e) => e.setVisible(false));
      }
      if (ending === Ending.WRONG || ending === Ending.LOW || ending === Ending.MID || ending === Ending.HIGH) {
        if (this.tweens.getAllTweens().length !== 0) return;
        this.sound.play('next');
        this.tweensGroups[start + counter].forEach((tweens => tweens.play()));
        counter++;
        if (start + counter === stop) {
          this.input.removeAllListeners('pointerdown');
          if (ending === Ending.LOW || ending === Ending.MID || ending === Ending.HIGH) {
            this.input.once('pointerdown', () => {
              this.sound.play('start');
              this.cs.forEach(c => c.setVisible(false));
              this.cFinal.setVisible(true);
              this.texts.wrong3.setAlpha(1);
              this.setOptions(['重新開始'], {
                onSuccess: () => {
                  this.scene.restart();
                },
                disableTime: 1000,
              });
            });
          }
        }
      }
    });
  }

  removeListeners() {
    this.input.removeAllListeners('pointerdown');
    this.optionButtons.forEach((e) => e.removeAllListeners('pointerdown'));
  }

  setOptions(options, { onSuccess, onFail, disableTime = 0 } = {}) {
    if (!Array.isArray(options) || (options.length !== 0
      && options.length !== 1 && options.length !== 2
      && options.length !== 4)) {
      return;
    }
    if (options.length === 0) {
      this.optionButtons.forEach((e) => e.setVisible(false));
      this.optionTexts.forEach((e) => e.setVisible(false));
    } else {
      let answer = 0
      if (options.length > 1) {
        const tmp = shuffleArray(options.map((v, i) => [v, i === 0]));
        options = tmp.map(([v, _]) => v);
        answer = tmp.reduce((prev, curr, i) => curr[1] ? i : prev, 0)
      }
      this.setOptionPos(options);
      if (!Array.isArray(options)) return;
      options.forEach((text, index) => {
        this.optionTexts[index].setText(text);
        this.optionButtons[index].removeAllListeners('pointerdown');
        this.optionButtons[index].fillColor = 0xffffff;
        this.optionButtons[index].strokeColor = 0x8c8c8c;
        const { reiner } = this;
        const setupButtonOnClick = () => {
          this.optionButtons[index].once('pointerdown', () => {
            reiner.setText(options[index]);
            const cb = index === answer ? onSuccess : onFail
            if (cb) cb(options[index], index);
          });
        };
        if (disableTime > 0) {
          this.time.delayedCall(disableTime, setupButtonOnClick);
        } else {
          setupButtonOnClick();
        }
      });
      options.forEach((_, index) => {
        this.optionTexts[index].setVisible(true);
        this.optionButtons[index].setVisible(true);
      });
    }
  }

  setOptionPos(options) {
    const { width, height } = this.game.canvas;
    const x = 0.25;
    const length = Array.isArray(options) ? options.length : 0;
    if (length === 1) {
      this.optionButtons[0].setPosition(width / 2, height * 0.9);
      this.optionTexts[0].setPosition(width / 2, height * 0.9);
    } else if (length === 2) {
      this.optionButtons[0].setPosition(width * x, height * 0.9);
      this.optionTexts[0].setPosition(width * x, height * 0.9);
      this.optionButtons[1].setPosition(width * (1 - x), height * 0.9);
      this.optionTexts[1].setPosition(width * (1 - x), height * 0.9);
    } else if (length === 4) {
      const y1 = 0.75, y2 = 0.93;
      const pos = [[x, y1], [1 - x, y1], [x, y2], [1 - x, y2]];
      this.optionButtons.forEach((v, i) => {
        v.setPosition(pos[i][0] * width, pos[i][1] * height);
        this.optionTexts[i].setPosition(pos[i][0] * width, pos[i][1] * height);
      });
    }
  }
}
