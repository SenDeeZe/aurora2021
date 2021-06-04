import EasyStar from "easystarjs";

import tilemapPng from '../assets/tileset/Dungeon_Tileset.png'
import dungeonRoomJson from '../assets/dungeon_room.json'
import auroraSpriteSheet from '../assets/sprites/characters/aurora.png'
import punkSpriteSheet from '../assets/sprites/characters/punk.png'
import blueSpriteSheet from '../assets/sprites/characters/blue.png'
import yellowSpriteSheet from '../assets/sprites/characters/yellow.png'
import greenSpriteSheet from '../assets/sprites/characters/green.png'
import slimeSpriteSheet from '../assets/sprites/characters/slime.png'
import CharacterFactory from "../src/characters/character_factory";
import Footsteps from "../assets/audio/footstep_ice_crunchy_run_01.wav";

import Vector2 from "phaser/src/math/Vector2";

import {LeaderFollowing} from "../src/ai/steerings/leaderFollowing";
import { DecisionController } from "../src/ai/fuzzy/DecisionController";
import UsualRules from "../src/ai/fuzzy/rules/usual";


let StartingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function StartingScene() {
            Phaser.Scene.call(this, {key: 'StartingScene'});
        },
    characterFrameConfig: {frameWidth: 31, frameHeight: 31},
    slimeFrameConfig: {frameWidth: 32, frameHeight: 32},
    preload: function () {

        //loading map tiles and json with positions
        this.load.image("tiles", tilemapPng);
        this.load.tilemapTiledJSON("map", dungeonRoomJson);

        //loading spitesheets
        this.load.spritesheet('aurora', auroraSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('blue', blueSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('green', greenSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('yellow', yellowSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('punk', punkSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('slime', slimeSpriteSheet, this.slimeFrameConfig);
        this.load.audio('footsteps', Footsteps);
        this.load.glsl('fire', ".shaders/sample.frag");
    },
    create: function () {
        this.gameObjects = [];
        const map = this.make.tilemap({key: "map"});

        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("Dungeon_Tileset", "tiles");


        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createStaticLayer("Floor", tileset, 0, 0);
        const worldLayer = map.createStaticLayer("Walls", tileset, 0, 0);
        const aboveLayer = map.createStaticLayer("Upper", tileset, 0, 0);
        this.tileSize = 32;
        this.finder = new EasyStar.js();
        let grid = [];
        for(let y = 0; y < worldLayer.tilemap.height; y++){
            let col = [];
            for(let x = 0; x < worldLayer.tilemap.width; x++) {
                const tile = worldLayer.tilemap.getTileAt(x, y);
                col.push(tile ? tile.index : 0);
            }
            grid.push(col);
        }

        this.finder.setGrid(grid);
        this.finder.setAcceptableTiles([0]);

        worldLayer.setCollisionBetween(1, 500);
        aboveLayer.setDepth(10);



        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.characterFactory = new CharacterFactory(this);

        // Creating characters
        this.player = this.characterFactory.buildCharacter('aurora', 100, 100, {player: true});
        this.player.speed = new Vector2(1);
        this.gameObjects.push(this.player);
        this.physics.add.collider(this.player, worldLayer);

        this.slimes =  this.physics.add.group();
        let params = {};
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! количество желешек здесь !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111
        const fakeSlime = {
          x: 0,
          y: 0,
          speed: new Vector2(1),
          body: {velocity: new Vector2()}
        };
        for(let i = 0; i < 20; i++) {
            const x = Phaser.Math.RND.between(50, this.physics.world.bounds.width - 50 );
            const y = Phaser.Math.RND.between(50, this.physics.world.bounds.height -50 );
            params.slimeType = i === 0 ? 1 : 4//Phaser.Math.RND.between(0, 4);
            const slime = this.characterFactory.buildSlime(x, y, params);
            slime.setSteerings([
            //    new Pursuit(slime, [this.player], 1, slime.speed, this.player.speed)
            //    new Arrive(slime, [this.player], 1, slime.speed, this.player.speed),
            //    new Separation(slime, [this.player, this.slimes.children.entries], 1, slime.speed, this.player.speed)
            //    new Evade(slime, [this.player], 1, slime.speed, this.player.speed)
                new LeaderFollowing(slime, [this.player, this.slimes.children.entries, fakeSlime], 1, slime.speed, this.player.speed)
            ]);
            this.slimes.add(slime);
            this.physics.add.collider(slime, worldLayer);
            this.gameObjects.push(slime);
        }

        //adding controller
        this.controller = new DecisionController(new UsualRules(), this.player, this.gameObjects)
        this.controller.setScales();

        this.physics.add.collider(this.player, this.slimes);
        for (let i = 0; i < this.slimes.children.entries.length; i++) {
            this.physics.add.collider(this.slimes.children.entries[i], this.slimes);
            let otherSlimes = this.slimes.children.entries.slice();
            otherSlimes.splice(i, 1);
            this.slimes.children.entries[i].setSteerings([
                //new Wander(this.slimes.children.entries[i], [], 10, 40, 50),
                //new CollisionAvoidance(this.slimes.children.entries[i], [], 10, 40, 50)
                //new Seek(slime, [], 10, 40, 50)
            ]);
            this.slimes.children.entries[i].selectTarget(this.player);
            this.slimes.children.entries[i].setObstacles([this.player]);
        }

    //    this.input.keyboard.once("keydown_D", event => {
            // Turn on physics debugging to show player's hitbox
            this.physics.world.createDebugGraphic();

            const graphics = this.add
                .graphics()
                .setAlpha(0.75)
                .setDepth(20);
      //  });
    //    this.fire = this.add.shader('fire', 300, 50, 400, 400);

    },
    update: function () {
        //changing states of slimes
        this.controller.setState();
        this.player.update();
        if (this.gameObjects)
        {
            this.gameObjects.forEach( function(element) {
                element.update();
            });
        }
    },
    tilesToPixels(tileX, tileY)
    {
        return [tileX*this.tileSize, tileY*this.tileSize];
    }
});

export default StartingScene