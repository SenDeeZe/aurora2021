import BaseFuzzyFunction from "./FuzzyLogicFunctions/BaseFuzzyFunction";
import LeftShoulderFuzzyFunction from "./FuzzyLogicFunctions/LeftShoulderFuzzyFunction";
import RightShoulderFuzzyFunction from "./FuzzyLogicFunctions/RightShoulderFuzzyFunction";
import SFunctionFuzzyFunction from "./FuzzyLogicFunctions/SFunctionFuzzyFunction";
import Table from "./FuzzyLogicFunctions/Table";
import TrapezoidFuzzyFunction from "./FuzzyLogicFunctions/TrapezoidFuzzyFunction";
import TriangleFuzzyFunction from "./FuzzyLogicFunctions/TriangleFuzzyFunction";

// singleton instantiation
import Reducers from "./ScaleResultReducers/Reducers";


class FuzzyDecisions {
	constructor() {
		this.scales = [
			// {
			// 	name: string,
			// 	rules: [
			// 		{
			// 			func: FuzzyLogicFunction,
			// 			outcome: string
			// 		}
			// 	]
			// },
		];
		this.reducer = null;
	}

	addScale(scaleName, rules) {
		// TODO: check scaleName for uniqueness
		this.validateRules(rules);
		this.scales.push({scaleName, rules});
	}

	setScaleResultsReducer(type) {
		this.reducer = Reducers.get(type);
	}

	validateRules(rules) {
		if (!rules.every(({func}) => func instanceof(BaseFuzzyFunction))) {
			throw new Error("All rules should be instance of BaseFuzzyFunction");
		}

		let sections = [];
		let areaSum = 0;
		let rightShoulderEnd = Number.MAX_VALUE;

		rules.forEach(({func}) => {
			if (func instanceof(Table)) {
				sections.push({left: func.lBorder, right: func.rBorder});
				areaSum += func.rBorder - func.lBorder;
			} else if (func instanceof(LeftShoulderFuzzyFunction)) {
				if (sections.some(sec => sec.left === 0)) {
					throw new Error("must be only one left shoulder function");
				}
				sections.push({left: 0, right: func.p2});
				areaSum +=
				func.p1 
					+ 1/2 * (func.p2 - func.p1);
			} else if (func instanceof(RightShoulderFuzzyFunction)) {
				sections.push({left: func.p1, right: func.p2});
				if (rightShoulderEnd !== Number.MAX_VALUE) {
					throw new Error("must be only one right shoulder function");
				}
				rightShoulderEnd = func.p2;
				areaSum +=
					1/2 * (func.p2 - func.p1);
			} else if (func instanceof(TrapezoidFuzzyFunction)) {
				sections.push({left: func.p1, right: func.p4});
				areaSum +=
					func.p3 - func.p2
					+ 1/2 * (func.p2 - func.p1)
					+ 1/2 * (func.p4 - func.p3);
			} else if (func instanceof(TriangleFuzzyFunction)) {
				sections.push({left: func.p1, right: func.p3});
				areaSum += 1/2 * (func.p3 - func.p2);
			} else if (func instanceof(SFunctionFuzzyFunction)) {
				const x1 = func.p - 1;
				const x2 = func.p + 1;
				sections.push({left: x1, right: x2});
				areaSum +=
					(- func.p * func.p * x2 + func.p * x2 * x2 - x2 * x2 * x2 / 3 + x2)
					- (- func.p * func.p * x1 + func.p * x1 * x1 - x1 * x1 * x1 / 3 + x1);
			}
		});

		sections.sort((a, b) => a.left - b.left);

		let combinedSections = {left: 0, right: 0};
		let rightMaximum = Number.MIN_VALUE;

		sections.forEach(sec => {
			if (sec.left <= combinedSections.right && combinedSections.right <= sec.right) {
				combinedSections.right = sec.right;
			}
			if (rightMaximum < sec.right) {
				rightMaximum = sec.right;
			}
		})
		
		if (combinedSections.right < rightMaximum) {
			throw new Error("there is a segment section without any defined functions");
		}

		const EPS = 0.00001;
		if (Math.abs(rightMaximum - areaSum) > EPS) {
			throw new Error("function sum must be 1 at any point");
		}
	}

	getDecision(parameters) {
		if (this.reducer === null) {
			throw new Error("scaleResultsReducer is not set");
		}

		const fuzzyDecisions = [];
		parameters.forEach(({scaleName, value}) => {
			const scale = this.scales.find((scale) => scale.scaleName === scaleName);

			if (!scale) {
				throw new Error("scale not exists")
			}

			scale.rules.forEach((rule) => {
				fuzzyDecisions.push({
					probability: rule.func.evaluate(value),
					outcome: rule.outcome
				});
			});
		});

		return this.reducer.reduce(fuzzyDecisions);

	}
}


export default FuzzyDecisions;
