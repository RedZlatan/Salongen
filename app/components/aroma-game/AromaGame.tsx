"use client";

import { useEffect, useRef } from "react";
import Phaser from "phaser";

export default function AromaGame() {
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    class MainScene extends Phaser.Scene {
      player!: Phaser.Physics.Arcade.Sprite;

      boss!: Phaser.Physics.Arcade.Sprite | null;

      ground!: Phaser.Physics.Arcade.Image;

      cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

      spaceKey!: Phaser.Input.Keyboard.Key;

      bullets: Phaser.GameObjects.Rectangle[] = [];

      rats: Phaser.Physics.Arcade.Sprite[] = [];

      lastFired = 0;

      facingLeft = false;

      killCount = 0;

      spawnedRats = 0;

      bossSpawned = false;

      bossActive = false;

      gameEnded = false;

      rainSound!: Phaser.Sound.BaseSound;

      citySound!: Phaser.Sound.BaseSound;

      neonSound!: Phaser.Sound.BaseSound;

      introPanel!: Phaser.GameObjects.Rectangle;

      introText!: Phaser.GameObjects.Text;

      endingPanel!: Phaser.GameObjects.Rectangle;

      endingText!: Phaser.GameObjects.Text;

      constructor() {
        super("MainScene");
      }

      preload() {
        this.load.image(
          "bg",
          "/aroma/background.png"
        );

        this.load.image(
          "aroma",
          "/aroma/aroma-side.png"
        );

        this.load.image(
          "rat",
          "/aroma/rat.png"
        );

        this.load.image(
          "boss",
          "/aroma/boss1.png"
        );

        this.load.audio(
          "rain",
          "/aroma/rain.mp3"
        );

        this.load.audio(
          "city",
          "/aroma/city.mp3"
        );

        this.load.audio(
          "neon",
          "/aroma/neon.mp3"
        );

        this.load.audio(
          "gunshot",
          "/aroma/gunshot.mp3"
        );

        this.load.audio(
          "bossSound",
          "/aroma/bosssound1.mp3"
        );
      }

      create() {
        this.boss = null;

        // Background
        const bg = this.add.image(
          800,
          450,
          "bg"
        );

        bg.setDepth(0);

        // Sounds
        this.rainSound = this.sound.add(
          "rain",
          {
            loop: true,
            volume: 0.35,
          }
        );

        this.citySound = this.sound.add(
          "city",
          {
            loop: true,
            volume: 0.18,
          }
        );

        this.neonSound = this.sound.add(
          "neon",
          {
            loop: true,
            volume: 0.08,
          }
        );

        this.rainSound.play();

        this.citySound.play();

        this.neonSound.play();

        // Fog
        const fog = this.add.rectangle(
          800,
          450,
          1600,
          900,
          0x666666,
          0.08
        );

        fog.setDepth(2);

        // Rain
        for (let i = 0; i < 300; i++) {
          const rainDrop = this.add.rectangle(
            Phaser.Math.Between(0, 1600),
            Phaser.Math.Between(0, 900),
            2,
            Phaser.Math.Between(10, 25),
            0x99bbff,
            0.4
          );

          rainDrop.setDepth(3);

          this.tweens.add({
            targets: rainDrop,

            y: 1000,

            x: rainDrop.x - 50,

            duration: Phaser.Math.Between(
              400,
              800
            ),

            repeat: -1,

            onRepeat: () => {
              rainDrop.y =
                Phaser.Math.Between(-200, 0);

              rainDrop.x =
                Phaser.Math.Between(
                  0,
                  1600
                );
            },
          });
        }

        // Ground
        this.ground =
          this.physics.add.staticImage(
            800,
            880,
            "rat"
          );

        this.ground.setVisible(false);

        this.ground.setDisplaySize(
          1600,
          80
        );

        this.ground.refreshBody();

        // Aroma
        this.player = this.physics.add.sprite(
          200,
          700,
          "aroma"
        );

        this.player.setScale(0.18);

        this.player.setDepth(10);

        this.player.setCollideWorldBounds(
          true
        );

        this.physics.add.collider(
          this.player,
          this.ground
        );

        // Controls
        this.cursors =
          this.input.keyboard!.createCursorKeys();

        this.spaceKey = this.input.keyboard!.addKey(
          Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // Intro narration panel
        this.introPanel =
          this.add.rectangle(
            800,
            180,
            700,
            100,
            0xe6dcc5,
            0.92
          );

        this.introPanel.setStrokeStyle(
          4,
          0x111111
        );

        this.introPanel.setDepth(100);

        this.introPanel.setAlpha(0);

        this.introText = this.add.text(
          800,
          180,
          "",
          {
            fontSize: "36px",
            color: "#111111",
            align: "center",
            fontFamily: "Georgia",
          }
        );

        this.introText.setOrigin(0.5);

        this.introText.setDepth(101);

        this.introText.setAlpha(0);

        // Ending narration panel
        this.endingPanel =
          this.add.rectangle(
            800,
            360,
            900,
            260,
            0xe6dcc5,
            0.94
          );

        this.endingPanel.setStrokeStyle(
          5,
          0x111111
        );

        this.endingPanel.setDepth(100);

        this.endingPanel.setAlpha(0);

        this.endingText = this.add.text(
          800,
          360,
          "",
          {
            fontSize: "48px",
            color: "#111111",
            align: "center",
            fontFamily: "Georgia",
          }
        );

        this.endingText.setOrigin(0.5);

        this.endingText.setDepth(101);

        this.endingText.setAlpha(0);

        // Rat spawning
        this.time.addEvent({
          delay: 1500,

          loop: true,

          callback: () => {
            if (
              this.bossSpawned ||
              this.gameEnded
            )
              return;

            // ONLY 15 TOTAL
            if (this.spawnedRats >= 15)
              return;

            this.spawnedRats++;

            const spawnLeft =
              Math.random() > 0.5;

            const rat =
              this.physics.add.sprite(
                spawnLeft ? 100 : 1500,
                600,
                "rat"
              );

            rat.setScale(0.18);

            rat.setDepth(20);

            rat.setFlipX(!spawnLeft);

            this.physics.add.collider(
              rat,
              this.ground
            );

            rat.setData("hp", 3);

            this.rats.push(rat);
          },
        });
      }

      spawnBoss() {
        this.bossSpawned = true;

        this.introPanel.setAlpha(1);

        this.introText.setAlpha(1);

        this.introText.setText(
          "THE STREETS GROW QUIET..."
        );

        // ambience lower
        (this.citySound as Phaser.Sound.WebAudioSound).setVolume(0.03);

        (this.neonSound as Phaser.Sound.WebAudioSound).setVolume(0.01);

        // boss sound immediately
        this.sound.play("bossSound", {
          volume: 0.6,
        });

        // EMPTY STREET PAUSE
        this.time.delayedCall(6000, () => {
          this.introPanel.setAlpha(0);

          this.introText.setAlpha(0);

          this.boss =
            this.physics.add.sprite(
              1500,
              520,
              "boss"
            );

          this.boss.setScale(0.42);

          this.boss.setDepth(50);

          this.physics.add.collider(
            this.boss,
            this.ground
          );

          this.boss.setData("hp", 14);

          this.bossActive = true;
        });
      }

      endGame() {
        this.gameEnded = true;

        this.bossActive = false;

        this.endingText.setText(
          "THE SALONGEN IS SAFE AGAIN.\n\nAROMA LIVES\nTO FIGHT\nANOTHER NIGHT."
        );

        this.tweens.add({
          targets: [
            this.endingPanel,
            this.endingText,
          ],

          alpha: 1,

          duration: 3000,
        });
      }

      update() {
        if (this.gameEnded) return;

        // Movement
        if (this.cursors.left.isDown) {
          this.player.setVelocityX(-200);

          this.player.setFlipX(true);

          this.facingLeft = true;
        } else if (
          this.cursors.right.isDown
        ) {
          this.player.setVelocityX(200);

          this.player.setFlipX(false);

          this.facingLeft = false;
        } else {
          this.player.setVelocityX(0);
        }

        // Jump
        if (
          this.cursors.up.isDown &&
          this.player.body?.touching.down
        ) {
          this.player.setVelocityY(-500);
        }

        // Shoot
        if (
          Phaser.Input.Keyboard.JustDown(
            this.spaceKey
          ) &&
          this.time.now > this.lastFired + 200
        ) {
          this.lastFired = this.time.now;

          this.sound.play("gunshot", {
            volume: 0.3,
          });

          const bullet =
            this.add.rectangle(
              this.player.x +
                (this.facingLeft
                  ? -70
                  : 70),

              this.player.y + 20,

              20,

              4,

              0xff2200
            );

          bullet.setDepth(30);

          bullet.setData(
            "speed",
            this.facingLeft
              ? -20
              : 20
          );

          this.bullets.push(bullet);

          this.player.x += this.facingLeft
            ? 10
            : -10;
        }

        // Bullets
        this.bullets.forEach(
          (bullet, index) => {
            bullet.x +=
              bullet.getData("speed");

            if (
              bullet.x < -100 ||
              bullet.x > 1700
            ) {
              bullet.destroy();

              this.bullets.splice(
                index,
                1
              );
            }

            // Rats
            this.rats.forEach(
              (rat, ratIndex) => {
                const distance =
                  Phaser.Math.Distance.Between(
                    bullet.x,
                    bullet.y,
                    rat.x,
                    rat.y
                  );

                if (distance < 120) {
                  bullet.destroy();

                  this.bullets.splice(
                    index,
                    1
                  );

                  let hp =
                    rat.getData("hp");

                  hp--;

                  rat.setData(
                    "hp",
                    hp
                  );

                  const blood =
                    this.add.circle(
                      rat.x,
                      rat.y,
                      30,
                      0xaa0000,
                      0.8
                    );

                  blood.setDepth(25);

                  this.tweens.add({
                    targets: blood,

                    alpha: 0,

                    scale: 2,

                    duration: 300,

                    onComplete: () => {
                      blood.destroy();
                    },
                  });

                  if (hp <= 0) {
                    rat.destroy();

                    this.rats.splice(
                      ratIndex,
                      1
                    );

                    this.killCount++;

                    if (
                      this.killCount >= 15 &&
                      !this.bossSpawned
                    ) {
                      this.spawnBoss();
                    }
                  }
                }
              }
            );

            // Boss
            if (this.bossActive && this.boss) {
              const bossDistance =
                Phaser.Math.Distance.Between(
                  bullet.x,
                  bullet.y,
                  this.boss.x,
                  this.boss.y
                );

              if (bossDistance < 220) {
                bullet.destroy();

                const blood =
                  this.add.circle(
                    this.boss.x,
                    this.boss.y,
                    70,
                    0xaa0000,
                    0.9
                  );

                blood.setDepth(80);

                this.tweens.add({
                  targets: blood,

                  alpha: 0,

                  scale: 3,

                  duration: 500,

                  onComplete: () => {
                    blood.destroy();
                  },
                });

                this.boss.setTint(
                  0xff4444
                );

                this.time.delayedCall(
                  100,
                  () => {
                    if (this.boss) {
                      this.boss.clearTint();
                    }
                  }
                );

                this.boss.x +=
                  this.facingLeft
                    ? -10
                    : 10;

                let hp =
                  this.boss.getData("hp");

                hp--;

                this.boss.setData(
                  "hp",
                  hp
                );

                if (hp <= 0) {
                  const deathBlood =
                    this.add.circle(
                      this.boss.x,
                      this.boss.y,
                      180,
                      0x880000,
                      0.95
                    );

                  deathBlood.setDepth(90);

                  this.tweens.add({
                    targets: deathBlood,

                    alpha: 0,

                    scale: 4,

                    duration: 1500,

                    onComplete: () => {
                      deathBlood.destroy();
                    },
                  });

                  this.boss.destroy();

                  this.boss = null;

                  this.endGame();
                }
              }
            }
          }
        );

        // Rats movement
        this.rats.forEach((rat) => {
          if (rat.x < this.player.x) {
            rat.setVelocityX(40);
          } else {
            rat.setVelocityX(-40);
          }
        });

        // Boss movement
        if (this.bossActive && this.boss) {
          if (this.boss.x > this.player.x) {
            this.boss.setVelocityX(-20);
          } else {
            this.boss.setVelocityX(20);
          }
        }
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,

      width: 1600,

      height: 900,

      parent: gameRef.current,

      physics: {
        default: "arcade",

        arcade: {
          gravity: { x: 0, y: 1000 },

          debug: false,
        },
      },

      scene: MainScene,
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black overflow-hidden">
      <div ref={gameRef} />
    </div>
  );
}