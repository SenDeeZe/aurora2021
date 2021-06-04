import BaseReducer from "./BaseReducer";

const groupBy = key => array =>
  array.reduce((objectsByKeyprobability, obj) => {
    const probability = obj[key];
    objectsByKeyprobability[probability] = (objectsByKeyprobability[probability] || []).concat(obj);
    return objectsByKeyprobability;
  }, {});

  function custom_compare (a,b) {
    // I'm assuming all probabilitys are numbers
    return a.outcome - b.outcome;
  }



class MaxGroupReducer extends BaseReducer {
	reduce(results) {
		let arr = results.sort(custom_compare).reverse();
		const groupByOutcome = groupBy('outcome');
		let resByOutcome= groupByOutcome(arr)
		let res = [];
		let resVal = 0;
		  for (var oneOutcome in resByOutcome){
			for(var i = 0; i < resByOutcome[oneOutcome].length; i++){
				resVal = resVal + resByOutcome[oneOutcome][i].probability;
			}
			res.push({oneOutcome, resVal});
			resVal = 0;
		}
		
		return res.reduce(
			(acc, result) => result.resVal > acc.resVal ? result : acc,
			{
				resVal: 0,
				oneOutcome: null
			}
		).oneOutcome;
	}
}

export default MaxGroupReducer;
