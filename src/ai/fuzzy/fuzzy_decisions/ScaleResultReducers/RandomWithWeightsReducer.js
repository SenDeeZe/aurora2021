import BaseReducer from "./BaseReducer";

const groupBy = key => array =>
  array.reduce((objectsByKeyprobability, obj) => {
    const probability = obj[key];
    objectsByKeyprobability[probability] = (objectsByKeyprobability[probability] || []).concat(obj);
    return objectsByKeyprobability;
  }, {});

  function custom_compare (a,b) {
    // I'm assuming all probability are numbers
    return a.outcome - b.outcome;
  }

function generalSum(arr){
    let sum = 0;
    for(let i=0; i< arr.length; i++)
        sum += arr[i].probability;
    return sum
} 

function custom_compare_prob (a,b) {
    // I'm assuming all probabilitys are numbers
    return a.val - b.val;
  }

class RandomWithWeightsReducer extends BaseReducer {
	reduce(results) {
		let arr = results.sort(custom_compare).reverse();
		const groupByOutcome = groupBy('outcome');
		let resByOutcome= groupByOutcome(arr)
        let sum = generalSum(arr)
		let res = [];
		let resVal = 0;
		  for (var oneOutcome in resByOutcome){
			for(var i = 0; i < resByOutcome[oneOutcome].length; i++){
				resVal = resVal + resByOutcome[oneOutcome][i].probability;
			}
            let val = resVal / sum
			res.push({oneOutcome, val});
			resVal = 0;
		}

        let randWeight = Math.random()
        res.sort(custom_compare_prob);
		    let result = 0;

        for(let i = 1; i<res.length; i++){
            if(Math.abs(res[i].val - randWeight) >= Math.abs(res[i-1].val - randWeight)){
                result = res[i-1].oneOutcome;
                break;
            }
            if(result == 0)
            result=res[res.length-1].oneOutcome
        }

		return result;
	}
}

export default RandomWithWeightsReducer;
