class BaseReducer {
	reduce(results) {
		throw Error("Base interfaces should not be instantiated or called!");
	}
}

export default BaseReducer;
