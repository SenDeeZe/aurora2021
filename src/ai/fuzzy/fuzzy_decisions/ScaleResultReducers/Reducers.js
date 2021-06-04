import MaxReducer from "./MaxReducer";
import MinReducer from "./MinReducer";
import MedianReducer from "./MedianReducer";
import RandomWithWeightsReducer from "./RandomWithWeightsReducer";
import MaxGroupReducer from "./MaxGroupReducer"

class Reducers {
	constructor() {
		this.reducers = [
			{
				type: "max",
				reducer: new MaxReducer()
			},
			{
				type: "min",
				reducer: new MinReducer()
			},
			{
				type: "median",
				reducer: new MedianReducer()
			},
			{
				type: "random",
				reducer: new RandomWithWeightsReducer()
			},
			{
				type: "maxGroup",
				reducer: new MaxGroupReducer()
			}
		];
	}

	get(type) {
		const result = this.reducers.find(r => r.type === type);
		if (!result) {
			throw Error("Can't find this type of reducer!");
		}
		return result.reducer;
	}
}

export default new Reducers();
