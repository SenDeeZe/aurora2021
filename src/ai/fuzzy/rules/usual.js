import Rules from "./rules.js";
import LeftShoulderFuzzyFunction from "../fuzzy_decisions/FuzzyLogicFunctions/LeftShoulderFuzzyFunction.js";
import TrapezoidFuzzyFunction from "../fuzzy_decisions/FuzzyLogicFunctions/TrapezoidFuzzyFunction.js";
import RightShoulderFuzzyFunction from "../fuzzy_decisions/FuzzyLogicFunctions/RightShoulderFuzzyFunction.js";
import TriangleFuzzyFunction from "../fuzzy_decisions/FuzzyLogicFunctions/TriangleFuzzyFunction.js";

export default class UsualRules extends Rules{
    constructor() {
        super()
        this.funcs = []
        this.input = []

        //hp
        this.funcs.push(new LeftShoulderFuzzyFunction(25, 35))
        this.funcs.push(new TrapezoidFuzzyFunction(25, 35, 65, 75))
        this.funcs.push(new RightShoulderFuzzyFunction(65, 75))

        //distance
        this.funcs.push(new LeftShoulderFuzzyFunction(60, 70))
        this.funcs.push(new TriangleFuzzyFunction(60, 70, 80))
        this.funcs.push(new TrapezoidFuzzyFunction(80, 90, 150, 160))
        this.funcs.push(new RightShoulderFuzzyFunction(150, 160))

        //density
        this.funcs.push(new LeftShoulderFuzzyFunction(500, 1000))
        this.funcs.push(new RightShoulderFuzzyFunction(500, 1000))
    }

    getDecision() {
        return this.fuzzyDecider.getDecision(this.input);
    }
}