import Vector2 from 'phaser/src/math/Vector2'
const eps = 20;
export default class Slime extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name, frame) {
        super(scene, x, y, name, frame);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.state = "";
        this.hp = 100;
    }
    update() {
        switch (this.state) {
            case 'rotate':
                break

            case 'middle range':
                break

            case 'rocket':
                break

            case 'short range':
                break

            case 'get close':
                break

            default:
                break

        }
        this.updateAnimation();
    }

    updateAnimation() {
        const animsController = this.anims;
        if (this.wantToJump) {
            animsController.play(this.animations[1], true);
        } else {
            animsController.play(this.animations[0], true);
        }

    }
    hasArrived() {
        return this.pointOfInterest === undefined || this.pointOfInterest.distance(this.body.position) < eps;
    }
    selectNextLocation() {
        const nextTile = this.path.shift();
        if (nextTile) {
            this.nextLocation = new Vector2(nextTile.x * 32, nextTile.y * 32);
        } else {
            this.nextLocation = this.body.position;
        }
    }
}