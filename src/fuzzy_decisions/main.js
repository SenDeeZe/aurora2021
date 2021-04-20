import BaseFuzzyFunction from "./FuzzyLogicFunctions/BaseFuzzyFunction";

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
		// TODO: validate other
	}

	getDecision(parameters) {
		if (this.reducer === null) {
			throw new Error("scaleResultsReducer is not set");
		}

		const fuzzyDecisions = [];
		parameters.forEach(({scaleName, value}) => {
			const scale = this.scales.find((scale) => scale.scaleName === scaleName);
			// TODO: check if scaleName is valid (scale exists). throw Error

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
