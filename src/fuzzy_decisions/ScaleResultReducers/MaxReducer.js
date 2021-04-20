import BaseReducer from "./BaseReducer";

class MaxReducer extends BaseReducer {
	reduce(results) {
		return results.reduce(
			(acc, result) => result.probability > acc ? result : acc.probability,
			{
				probability: 0,
				outcome: null
			}
		).outcome;
	}
}

export default MaxReducer;
