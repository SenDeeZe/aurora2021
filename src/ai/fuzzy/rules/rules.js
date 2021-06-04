import FuzzyDesicions from "../fuzzy_decisions/main.js";

export default class Rules {
    constructor() {
        this.params = ["hp", "distance", "density"];
        this.fuzzyDecider = new FuzzyDesicions();
    }

    getDecision() {
        throw Error("Base interfaces should not be instantiated or called!");
    }
}