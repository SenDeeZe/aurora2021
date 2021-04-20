import BaseFuzzyFunction from "./BaseFuzzyFunction";

/**
 * Note:
 * Table assumes equal value within all the interval.
 * For right trapezoid (e.g. non-equal lBorder.y and rBorder.y) create separate class
 */
class Table extends BaseFuzzyFunction {
	constructor({lBorder, rBorder}) {
		super();
		this.lBorder = lBorder;
		this.rBorder = rBorder;
		if (rBorder.y !== lBorder.y) {
			throw new Error("Trying to create right trapezoid instead of table");
		}
	}


	evaluate(x) {
		return x => this.lBorder && x < this.rBorder ? this.lBorder.y : 0;
	}
}

export default Table;
