import './style.css'
import Phaser, { Physics } from 'phaser'
import crystal from "/assets/crystal_d.png"

const res = {
  width:853,
  height:480
}

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game");
    this.crystal;
  }

  preload(){
    this.load.image("bg", "./assets/background.png");
    this.load.spritesheet("crystal", crystal, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.once('complete', () => {
      const texture = this.textures.get('crystal');
      texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }); // filtro para aumentar o tamanho do sprite, sem borrar os pixels - usado no cristal
  }

  create(){
    this.add.image(0,0,"bg").setOrigin(0,0);

    this.anims.create({
      key:"idle",
      frames: this.anims.generateFrameNumbers("crystal", {frames:[0,1,2,3,4,5,6,7,8,9,10,11,12]}),
      frameRate: 16,
      repeat: -1,
    })
    this.crystal = this.add.sprite(res.width*0.92, res.height*0.6, "crystal");
    this.crystal.setScale(6);
    this.crystal.play("idle", true);
  }

  update(){

  }
}

const config = {
  type:Phaser.WEBGL,
  width:res.width,
  height:res.height,
  canvas:gameCanvas,
  physics:{
    default:"arcade",
    arcade:{
      debug:true
    }
  },
  scene:[GameScene]
}

const game = new Phaser.Game(config)
