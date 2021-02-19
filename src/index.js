import 'phaser';
import Boot from './Boot';
import Preloader from './Preloader';
import MainMenu from './MainMenu';
import MainGame from './MainGame';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: [Boot, Preloader, MainMenu, MainGame],
};

var game = new Phaser.Game(config);
