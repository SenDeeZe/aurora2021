import MaxReducer from "./MaxReducer";

class Reducers {
	constructor() {
		this.reducers = [
			{
				type: "max",
				reducer: new MaxReducer()
			}
		];
	}

	get(type) {
		const result = this.reducers.find(r => r.type === type);
		if (!result) {
			// TODO: throw Error
		}
		return result.reducer;
	}
}

export default new Reducers();
