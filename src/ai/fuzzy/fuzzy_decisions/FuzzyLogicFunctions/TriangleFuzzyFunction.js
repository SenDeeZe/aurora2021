import BaseFuzzyFunction from "./BaseFuzzyFunction";

/**
 *  Triangle function (from point1, point2, point3) 
 */
class TriangleFuzzyFunction extends BaseFuzzyFunction {

    /**
    *  The conctructor takes three points:
    *  @param {number} p1 Point 1 (left at y = 0)
    *  @param {number} p2 Point 2 (at y = 1)
    *  @param {number} p3 Point 3 (right at y = 0)
    */
	constructor({p1, p2, p3}) {
		super();
		this.p1 = p1;
		this.p2 = p2;
        this.p3 = p3;
		if (p1 > p2 || p2 > p3) {
			throw new Error("Sorry, but the points are not positioned correctly");
		}
	}

    /**
    *  Calculate a the value of a function:
    *  @param {number} x Input parameter
    *  @returns {number} Calculated function value
    */
	evaluate(x) {
        if(x <= this.p1 || x > this.p3)
            return 0
        if(x > this.p1 && x <= this.p2)
            return (x - this.p1) / (this.p2 - this.p1)
        return (this.p3 - x) / (this.p3 - this.p2)
        /*
            Note:
            formally: denominators can be zero,
            in fact: the first condition saves us from the value 'Infinity' in js (when divided by zero)
        */
	}
}

export default TriangleFuzzyFunction;