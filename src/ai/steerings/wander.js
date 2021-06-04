import Vector2 from "phaser/src/math/Vector2";
import Steering from "./steering";

class Wander extends Steering {
    constructor (owner, objects, force = 1, ownerSpeed, targetSpeed) {
        super(owner, objects, force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed
    }

    calculateImpulse () {
        const ANGLE_CHANGE = 0.5;
        let circleCenter = this.owner.body.velocity
            .clone()
            .normalize()
            .multiply(new Vector2(this.ownerSpeed, this.ownerSpeed));

        let displacement = new Vector2(0, -1)
            .multiply(new Vector2(this.ownerSpeed, this.ownerSpeed));

        let angle = this.owner.body.velocity.angle();
        angle += (Math.random() * ANGLE_CHANGE) - (ANGLE_CHANGE * 0.5);

        displacement = this.rotate(displacement, angle);
        let force = circleCenter.add(displacement)

        return force
            .normalize()
            .multiply(new Vector2(this.ownerSpeed, this.ownerSpeed));//new Vector2(x, y);

    }

    setTarget(target) {
        this._target = target;
    }

    setObstacles(obstacles) {

    }

    rotate(vector, value) {
        return new Vector2(
            Math.cos(value) * vector.length(),
            Math.sin(value) * vector.length()
        )
    }
}

export { Wander }