import Vector2 from "phaser/src/math/Vector2";
import Steering from "./steering";

class Seek extends Steering {
    constructor (owner, objects, force = 1, ownerSpeed, targetSpeed) {
        super(owner, objects, force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed
    }

    calculateImpulse () {
        const searcherDirection = this.owner.body.velocity.clone();
        const target = this._target === undefined ? this.objects[0] : this._target;
        const desiredVelocity = new Vector2(target.x - this.owner.x, target.y - this.owner.y)
            .normalize()
            .multiply(new Vector2(this.ownerSpeed, this.ownerSpeed));
        
        let steering = new Vector2(
            (desiredVelocity.x - searcherDirection.x),
            (desiredVelocity.y - searcherDirection.y));

        if (steering.length() > this.ownerSpeed) {
            steering.normalize().multiply(new Vector2(this.ownerSpeed, this.ownerSpeed));
        }

        return steering;//new Vector2(x, y);

    }

    setTarget(target) {
        this._target = target;
    }

    setObstacles(obstacles) {
        
    }
}

export { Seek }