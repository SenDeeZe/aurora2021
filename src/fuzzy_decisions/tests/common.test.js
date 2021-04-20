import FuzzyDesicions from "../main.js";
import Table from "../FuzzyLogicFunctions/Table";

test("full pipeline simple test", () => {
	const fuzzyDecider = new FuzzyDesicions();
	const table1 = new Table({
		lBorder: {x: 0, y: 0.5},
		rBorder: {x: 1, y: 0.5}
	});
	const table3 = new Table({
		lBorder: {x: 0, y: 0.5},
		rBorder: {x: 2, y: 0.5}
	});
	const table2 = new Table({
		lBorder: {x: 1, y: 0.3},
		rBorder: {x: 2, y: 0.3}
	});
	const table4 = new Table({
		lBorder: {x: 1, y: 0.2},
		rBorder: {x: 3, y: 0.2}
	});
	const table5 = new Table({
		lBorder: {x: 2, y: 0.8},
		rBorder: {x: 3, y: 0.8}
	});
	fuzzyDecider.addScale(
		"param1",
		[
			{
				func: table1,
				outcome: "outcome1"
			},
			{
				func: table2,
				outcome: "outcome2"
			},
			{
				func: table3,
				outcome: "outcome3"
			},
			{
				func: table4,
				outcome: "outcome4"
			},
			{
				func: table5,
				outcome: "outcome5"
			}
		]
	);
	fuzzyDecider.addScale(
		"param2",
		[
			{
				func: table1,
				outcome: "outcome1"
			},
			{
				func: table2,
				outcome: "outcome2"
			},
			{
				func: table3,
				outcome: "outcome3"
			},
			{
				func: table4,
				outcome: "outcome4"
			},
			{
				func: table5,
				outcome: "outcome5"
			}
		]
	);
	fuzzyDecider.setScaleResultsReducer("max");
	const input = [
		{
			scaleName: "param1",
			value: 1.5
		},
		{
			scaleName: "param2",
			value: 2.5
		}
	];
	const decision = fuzzyDecider.getDecision(input);
	expect(decision).toBe("outcome5");
});
