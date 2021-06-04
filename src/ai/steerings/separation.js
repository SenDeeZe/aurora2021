import Vector2 from 'phaser/src/math/Vector2'
import Steering from "./steering";

class Separation extends Steering {
    constructor (owner, objects, force = 1, ownerSpeed, targetSpeed) {
        super(owner, objects, force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed;
        this.radius = 2 * this.owner.height;
    }

    calculateImpulse () {
        if (this.owner === this.objects[0])
            return new Vector2();

        let neighboursCount = 0
        let velocity = new Vector2(0, 0);
        this.objects[1].forEach(slime => {
            let distance = new Vector2(this.owner.x, this.owner.y).subtract(new Vector2(slime.x, slime.y)).length();
            if (distance <= this.radius) {
                neighboursCount++;
                velocity.add(new Vector2(slime.x, slime.y).subtract(new Vector2(this.owner.x, this.owner.y)));
            }
        });

        if (neighboursCount === 0)
            return new Vector2();

        velocity.divide(new Vector2(neighboursCount)).
                 multiply(new Vector2(-1)).
                 normalize();
        return velocity;
    }

}

export {Separation};