import Steering from "./steering";
import {Separation} from "./separation";
import {Evade} from "./evade";
import {Arrive} from "./arrive";
import Vector2 from "phaser/src/math/Vector2";

class LeaderFollowing extends Steering {
    constructor (owner, objects, force = 1, ownerSpeed, targetSpeed) {
        super(owner, objects, force);
        this.ownerSpeed = ownerSpeed;
        this.targetSpeed = targetSpeed;
        this.leaderDistance = 10;
        this.leaderAway = 100;
    }

    calculateImpulse () {
        if (this.owner === this.objects[1][0]) {
            let targetVelocity = new Vector2(this.objects[1][0].x, this.objects[1][0].y).
                                     multiply(new Vector2(-1)).
                                     normalize().
                                     multiply(new Vector2(this.leaderDistance));
            let behind = new Vector2(this.objects[1][0].x, this.objects[1][0].y).
                             add(targetVelocity);
            this.objects[2].x = behind.x;
            this.objects[2].y = behind.y;

            return new Arrive(this.owner, [this.objects[0]], this.force, this.ownerSpeed, this.targetSpeed).
                        calculateImpulse();
        }

        let away = new Vector2(this.objects[1][0].x, this.objects[1][0].y).
                        normalize().
                        multiply(new Vector2(this.leaderAway)).
                        add(new Vector2(this.objects[1][0].x, this.objects[1][0].y));
        let force = new Vector2();
        if (this.isOnLeaderWay(away))
            force.add(new Evade(this.owner, [this.objects[1][0]], this.force, this.ownerSpeed, this.targetSpeed).
                        calculateImpulse());

        force.add(new Arrive(this.owner, [this.objects[2]], this.force, this.ownerSpeed, this.objects[2].speed).
                         calculateImpulse()).
              add(new Separation(this.owner, this.objects, this.force, this.ownerSpeed, this.targetSpeed).
                         calculateImpulse());
        return force;
    }

    isOnLeaderWay(pointAhead) {
        return pointAhead.subtract(new Vector2(this.owner.x, this.owner.y)).length() <= this.leaderAway ||
               new Vector2(this.owner.x, this.owner.y).subtract(pointAhead).length() <= this.leaderAway;

    }
}

export {LeaderFollowing};