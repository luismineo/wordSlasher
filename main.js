import './style.css'
import Phaser, { Physics } from 'phaser'
import crystal from "/assets/crystal_d.png"

const res = {
  width: 853,
  height: 480
}

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.cursor;
    this.crystal;
    this.circle;
    this.hp = 100;
    this.typedWord = '';
    this.enemySpeed = 100;
    this.words = ['TESTE', 'PALAVRA', 'CIRCULO', 'QUADRADO'];
    this.circles = [];
    this.showWord;
  }

  preload() {
    this.load.image("bg", "./assets/background.png");
    this.load.spritesheet("crystal", crystal, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // filtro para aumentar o tamanho do sprite, sem borrar os pixels - usado no cristal
    this.load.once('complete', () => {
      const crystalTexture = this.textures.get('crystal');
      crystalTexture.setFilter(Phaser.Textures.FilterMode.NEAREST);
    }); 
  }

  create() {
    this.cursor = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown', this.handleKeyDown, this);

    //crystal
    this.crystal = this.add.image(0, 0, "bg").setOrigin(0, 0);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("crystal", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }),
      frameRate: 16,
      repeat: -1,
    })
    this.crystal = this.add.sprite(res.width * 0.92, res.height * 0.6, "crystal");
    this.crystal.setScale(6);
    this.crystal.play("idle", true);
    this.physics.world.enable(this.crystal, Phaser.Physics.Arcade.STATIC_BODY);

    this.spawnCircle();
  }

  update() {
    if(this.hp == 0){
      //this.gameOver();
      this.hp == 100;
      console.log("fim de jogo");
    }

    if(this.typedWord == this.circle.getData('word')){
      this.resetCircle();
      this.spawnCircle();
    }

    // detecção da colisão
    this.physics.overlap(this.circle, this.crystal, this.targetHit, null, this);
  }

  spawnCircle(){
    this.circle = this.add.circle(50, 200, 30, 0xff0000);
    this.physics.world.enable(this.circle);

    const position = {x:0, y:this.getRandomY() + 200}

    this.circle.setPosition(position.x, position.y);
    this.circle.body.setVelocityX(this.enemySpeed);

    const wordIndex = Math.floor(Math.random() * this.words.length);
    const associatedWord = this.words[wordIndex];
    this.circle.setData('word', associatedWord);

    this.showWord = this.add.text(100, 100, associatedWord);
  }

  resetCircle(){
    this.circle.destroy(true);
    this.showWord.destroy(true);
    this.typedWord = '';
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode;

    // 65 é o código ASCII de 'A' e 90 de 'Z'
    if (keyCode >= 65 && keyCode <= 90) {
      const char = String.fromCharCode(keyCode);
      this.typedWord += char;
    }
  }

  getRandomY(){
    return Math.floor(Math.random() * 200);
  }

  targetHit() {
    this.resetCircle();
    this.spawnCircle();

    this.hp -= 10;

    console.log(this.circle.y);
    console.log(this.circle.getData('word'));
    console.log(this.typedWord);
    console.log(this.hp);

    console.log("Hit!");
  }

  gameOver(){
    this.sys.game.destroy(true);
  }
}

const config = {
  type: Phaser.WEBGL,
  width: res.width,
  height: res.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config)
