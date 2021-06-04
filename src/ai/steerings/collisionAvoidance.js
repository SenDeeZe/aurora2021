import Vector2 from "phaser/src/math/Vector2";
import Steering from "./steering";

class CollisionAvoidance extends Steering {
    constructor (owner, objects, force = 1, ownerSpeed, targetSpeed) {
        super(owner, objects, force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed;
        this.obstacles = [];
    }

    calculateImpulse () {
        const MAX_AVOID_FORCE = this.ownerSpeed * 10;
        const MAX_SEE_AHEAD = this.ownerSpeed * 4;

        let ahead = this.owner.body.position.clone().add(
            this.owner.body.velocity
                .clone()
                .normalize()
                .multiply(new Vector2(MAX_SEE_AHEAD, MAX_SEE_AHEAD))
            );

        let ahead2 = this.owner.body.position.clone().add(
            this.owner.body.velocity
                .clone()
                .normalize()
                .multiply(new Vector2(MAX_SEE_AHEAD * 0.5, MAX_SEE_AHEAD * 0.5))
            );


        let avoidance = new Vector2(0, 0);
        let obstacle = this.getTargetObstacle(ahead, ahead2);
        if (obstacle) {
            avoidance.x = ahead.x - obstacle.body.position.x;
            avoidance.y = ahead.y - obstacle.body.position.y;
 
            avoidance.normalize();
            avoidance.multiply(new Vector2(MAX_AVOID_FORCE, MAX_AVOID_FORCE));
        }

        return avoidance;

    }

    isIntersecting(vector, bounds) {
        return vector.x > bounds.left && vector.x < bounds.right
                && vector.y > bounds.top && vector.y < bounds.bottom;
    }

    getTargetObstacle(ahead1, ahead2) {
        let target;
        this.obstacles.forEach(obstacle => {
            let collision = this.isIntersecting(ahead1, obstacle.body)
                || this.isIntersecting(ahead2, obstacle.body);
            if (collision && (target == null 
                || this.owner.body.position.distance(obstacle.body.position) < this.owner.body.position.distance(target.body.position))) {
                    target = obstacle;
                }
        });
        return target;
    }

    setObstacles(obstacles) {
        this.obstacles = obstacles;
    }

    setTarget(target) {

    }

    rotate(vector, value) {
        return new Vector2(
            Math.cos(value) * vector.length(),
            Math.sin(value) * vector.length()
        )
    }
}

export { CollisionAvoidance }