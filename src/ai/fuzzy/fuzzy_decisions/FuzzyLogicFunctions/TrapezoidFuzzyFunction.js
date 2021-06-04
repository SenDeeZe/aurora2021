import BaseFuzzyFunction from "./BaseFuzzyFunction";

/**
 *  Trapezoid function (from point1, point2, point3, point4) 
 */
class TrapezoidFuzzyFunction extends BaseFuzzyFunction {

    /**
    *  The conctructor takes four points:
    *  @param {number} p1 Point 1 (left at y = 0)
    *  @param {number} p2 Point 2 (left at y = 1)
    *  @param {number} p3 Point 3 (right at y = 1)
    *  @param {number} p4 Point 4 (right at y = 0)
    */
	constructor({p1, p2, p3, p4}) {
		super();
		this.p1 = p1;
		this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
		if (p1 > p2 || p2 > p3 || p3 > p4) {
			throw new Error("Sorry, but the points are not positioned correctly");
		}
	}

    /**
    *  Calculate a the value of a function:
    *  @param {number} x Input parameter
    *  @returns {number} Calculated function value
    */
	evaluate(x) {
		if(x <= this.p1 || x >= this.p4)
            return 0;
        if(x > this.p2 && x <= this.p3)
            return 1;
        if(x > this.p1 && x <= this.p2)
            return (x - this.p1) / (this.p2 - this.p1)
        return (this.p4 - x) / (this.p4 - this.p3)
        /*
            Note:
            formally: denominators can be zero,
            in fact: if the points match, we will exit earlier in the conditions, i.e. for us the actual division by zero is unattainable (we could not counterargument the argument, so we think so)
        */
	}
}

export default TrapezoidFuzzyFunction;