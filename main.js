import '/style.css'
import Phaser from 'phaser';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let player;
let cursors;
let enemies;
let projectiles;
let energy = 0;
let energyText;

function preload() {
  this.load.image('player', 'assets/sofi/sofi.png');
  this.load.image('enemy', 'assets/enemy/enemy.png');
  this.load.image('projectile', 'assets/power.png');
}

function create() {
  player = this.physics.add.sprite(400, 500, 'player');
  player.setCollideWorldBounds(true);

  cursors = this.input.keyboard.createCursorKeys();

  enemies = this.physics.add.group({
    key: 'enemy',
    repeat: 5,
    setXY: { x: 100, y: 50, stepX: 120, stepY: 30 }
  });

  projectiles = this.physics.add.group();

  energyText = this.add.text(10, 10, 'Energy: 0', { font: '24px Arial', fill: '#ffffff' });

  this.physics.add.collider(enemies, projectiles, hitEnemy);

  this.time.addEvent({
    delay: 2000,
    callback: shootProjectile,
    callbackScope: this,
    loop: true
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.space.isDown) {
    shootProjectile();
  }

  // Hundlunguur daisnuud hudlunu
  enemies.getChildren().forEach(enemy => {
    enemy.setVelocityY(10);

    if (enemy.y > config.height) {
      enemy.setY(0);
      enemy.setX(Phaser.Math.Between(0, config.width));
    }
  });

  if (enemies.countActive(true) === 0) {
    respawnEnemies();
  }
}

function hitEnemy(enemy, projectile) {
  projectile.destroy();
  enemy.destroy();
  energy++;
  energyText.setText(`Energy: ${energy}`);
}

function shootProjectile() {
  const projectile = projectiles.create(player.x, player.y - 20, 'projectile');
  projectile.setVelocityY(-300);
}

function respawnEnemies() {
  enemies.children.iterate(child => {
    child.enableBody(true, child.x, -20, true, true);
  });
}
