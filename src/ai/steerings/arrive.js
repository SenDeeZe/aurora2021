import Steering from "./steering";
import Vector2 from "phaser/src/math/Vector2";
import {Pursuit} from "./pursuit";

class Arrive extends Steering {
    constructor (owner, objects, force = 1, ownerSpeed, targetSpeed) {
        super(owner, objects, force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed;
        this.radius = 80;
    }

    calculateImpulse () {
        let velocity = new Pursuit(this.owner, this.objects, this.force, this.ownerSpeed, this.targetSpeed).calculateImpulse();
        let distance = new Vector2(this.owner.x, this.owner.y).subtract(new Vector2(this.objects[0].x, this.objects[0].y)).length();
        if (distance < this.radius) {
            velocity.multiply(new Vector2(distance / this.radius));
        }
        return velocity;
    }
}

export {Arrive};