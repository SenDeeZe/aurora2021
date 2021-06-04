import Phaser from 'phaser'

import ScenesMenu from '../scenes/scenes-menu';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  zoom: 1.2,
  scene: ScenesMenu,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0,
        debug: true
        }
    }
  },
};

const game = new Phaser.Game(config);
