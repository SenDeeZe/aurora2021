import buildLevel from "../src/utils/level_procedural_generator/level-builder";
import CharacterFactory from "../src/characters/character_factory";

import auroraSpriteSheet from '../assets/sprites/characters/aurora.png'
import punkSpriteSheet from '../assets/sprites/characters/punk.png'
import blueSpriteSheet from '../assets/sprites/characters/blue.png'
import yellowSpriteSheet from '../assets/sprites/characters/yellow.png'
import greenSpriteSheet from '../assets/sprites/characters/green.png'
import slimeSpriteSheet from '../assets/sprites/characters/slime.png'
import Footsteps from "../assets/audio/footstep_ice_crunchy_run_01.wav";

import tilemapPng from '../assets/tileset/Dungeon_Tileset.png'

const TILE_MAPPING = {
    BLANK: 17,
    FLOOR: 95,
    BAD_SAND: 156,
    SAND: 206, 
    COLUMN_UP: 208,
    COLUMN_DOWN: 224
};

const LEVEL_TO_TILE = {
    0: TILE_MAPPING.BLANK,
    1: TILE_MAPPING.FLOOR,
    2: TILE_MAPPING.BAD_SAND,
    3: TILE_MAPPING.SAND,
    4: TILE_MAPPING.COLUMN_UP,
    5: TILE_MAPPING.COLUMN_DOWN
}

const RANDOM = Math.random() + 1

let RandomScene = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function RandomScene() {
        Phaser.Scene.call(this, {key: 'RandomScene'})
    },

    characterFrameConfig: {frameWidth: 31, frameHeight: 31},
    slimeFrameConfig: {frameWidth: 32, frameHeight: 32},

    preload: function() {
        this.load.image("tiles", tilemapPng);
        this.load.spritesheet('aurora', auroraSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('blue', blueSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('green', greenSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('yellow', yellowSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('punk', punkSpriteSheet, this.characterFrameConfig);
        this.load.spritesheet('slime', slimeSpriteSheet, this.slimeFrameConfig);
        this.load.audio('footsteps', Footsteps);
        // this.load.glsl('example', "./shaders/example.frag");
    }, 

    create: function() {
        this.gameObjects = [];
        this.characterFactory = new CharacterFactory(this);
        this.hasPlayerReachedStairs = false;
        const width = 25; const height = 19;

        let levelMatrix = []
        for(let y = 0; y < height; y++){
            let col = [];
            for (let x = 0; x < width; x++)
                col.push(0);
            levelMatrix.push(col);
        }

        const tilesize = 32;
        this.map = this.make.tilemap({
            tileWidth: tilesize,
            tileHeight: tilesize,
            width: width,
            height: height
        });

        const tileset = this.map.addTilesetImage("tiles", null, tilesize, tilesize);
        const outsideLayer = this.map.createBlankDynamicLayer("Water", tileset);
        const groundLayer = this.map.createBlankDynamicLayer("Ground", tileset);
        const stuffLayer = this.map.createBlankDynamicLayer("Stuff", tileset);


        if (RANDOM < 0.5) 
            levelMatrix = getSandMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer)
        else
            levelMatrix = getDungeonMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer)

        this.player = this.characterFactory.buildCharacter('aurora', 60, 60, {player: true});
        this.player.setDepth(1);

        this.physics.add.collider(this.player, groundLayer);
        this.physics.add.collider(this.player, outsideLayer);
        this.gameObjects.push(this.player);

        const camera = this.cameras.main;
        camera.setZoom(1.0)
        camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        camera.startFollow(this.player);
        camera.roundPixels = true;

        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
        groundLayer.setCollisionBetween(1, 500);
        stuffLayer.setDepth(10);
        outsideLayer.setDepth(9999);
        outsideLayer.setCollisionBetween(1, 500);

        this.wave = this.add.shader('example', 0, 0, 10000, 10000);
        this.wave.setUniform('centerX.value', 300.0);
        this.wave.setUniform('centerY.value', 300.0);
        this.wave.setUniform('radius.value', 40.0);
    },

    update: function() {
        if (this.gameObjects) {
            this.gameObjects.forEach( function(element) {
                element.update();
            })
        }
    },
    tilesToPixels(tileX, tileY) {
        return [tileX*this.tileSize, tileY*this.tileSize];
    }
})

export default RandomScene

function getSandMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer) {
    for(let y = 0; y < height; y++)
    {
        for(let x = 0; x < width; x++)
        {
            let index = levelMatrix[y][x];
            if(index === 0 && y != 0 && x != 0 && x != width - 1 && y != height - 1)
                groundLayer.putTileAt(LEVEL_TO_TILE[3], x, y)
            else
                outsideLayer.putTileAt(LEVEL_TO_TILE[0], x, y)
        }
    }

    for (let i = 0; i < getRandomInt(5, 10); i++) {
        let x = getRandomInt(2, 27)
        let y = getRandomInt(2, 27)
        outsideLayer.putTileAt(LEVEL_TO_TILE[2], x, y)
        outsideLayer.putTileAt(LEVEL_TO_TILE[2], x + 1, y)
        outsideLayer.putTileAt(LEVEL_TO_TILE[2], x - 1, y)
        outsideLayer.putTileAt(LEVEL_TO_TILE[2], x, y + 1)
        outsideLayer.putTileAt(LEVEL_TO_TILE[2], x, y - 1)

        groundLayer.putTileAt(187, x - 1, y + 1)
        groundLayer.putTileAt(189, x + 1, y + 1)
        groundLayer.putTileAt(155, x - 1, y - 1)
        groundLayer.putTileAt(157, x + 1, y - 1)
    }

    return levelMatrix
}

function getDungeonMap(height, width, levelMatrix, outsideLayer, stuffLayer, groundLayer) {
    for(let y = 0; y < height; y++)
    {
        for(let x = 0; x < width; x++)
        {
            let index = levelMatrix[y][x];
            if(index === 0 && y != 0 && x != 0 && x != width - 1 && y != height - 1)
                groundLayer.putTileAt(LEVEL_TO_TILE[1], x, y)
            else
                outsideLayer.putTileAt(LEVEL_TO_TILE[0], x, y)
        }
    }

    let matrix = []
    for(let y = 0; y < height; y++){
        let col = [];
        for (let x = 0; x < width; x++)
            col.push(0);
        matrix.push(col);
    }

    // for (let k = 0; k < getRandomInt(5, 8); k++) {
    //     let x = getRandomInt(1, 24)
    //     let y = getRandomInt(1, 24)
    //     let tile_counter = 0
    //     let flag = false

    //     for (let j = 0; j < 4; j++) {
    //         for (let i = 0; i < 3; i++) {
    //             if (matrix[y + j][x + i] != 0) {
    //                 flag = true
    //                 break
    //             }
    //         }
    //     }

    //     if (!flag) {
    //         for (let j = 0; j < 4; j++) {
    //             for (let i = 0; i < 3; i++) {
    //                 outsideLayer.putTileAt(tile_counter + i, x + i, y + j)
    //                 matrix[y + j][x + i] = 1
    //             }
    //             tile_counter += 16
    //         }
    //     }
    // }

    // for (let i = 0; i < getRandomInt(15, 25); i++) {
    //     let x = getRandomInt(1, 28)
    //     let y = getRandomInt(2, 28)
    //     if (matrix[y][x] != 1 && matrix[y - 1][x] != 1) {
    //         outsideLayer.putTileAt(LEVEL_TO_TILE[5], x, y)
    //         stuffLayer.putTileAt(LEVEL_TO_TILE[4], x, y - 1)
    //         matrix[y][x] = 1
    //         matrix[y - 1][x] = 1
    //     }
    // }

    return levelMatrix
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}