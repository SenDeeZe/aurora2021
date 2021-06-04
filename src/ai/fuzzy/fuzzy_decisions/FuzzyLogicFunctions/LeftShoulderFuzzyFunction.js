import BaseFuzzyFunction from "./BaseFuzzyFunction";

/**
 * Left shoulder function (from point1, point2)
 */
class LeftShoulderFuzzyFunction extends BaseFuzzyFunction {

    /**
     * The constructor takes two points:
     * @param {number} p1 x-coord 1 (at y = 1)
     * @param {number} p2 x-coord 2 (at y = 0)
     */
    constructor(p1, p2) {
		super();
		this.p1 = p1;
        this.p2 = p2;
		if (p1 > p2) {
			throw new Error("Sorry, but p1 is assumed to be to the left of p2");
		}
	}

    /**
     * Calculate the value of a function
     * @param {number} x Input parameter
     * @returns {number} Calculated function value
     */
	evaluate(x) {
		if (x <= this.p1) 
            return 1;
        if (x > this.p2)
            return 0;
        return (this.p2 - x) / (this.p2 - this.p1);
        /*
            Note:
            formally: the denominator (this.p2 - this.p1) can be zero,
            in fact: this state is unattainable due to the first two conditions        
        */
	}
}

export default LeftShoulderFuzzyFunction;