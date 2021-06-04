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

  
function custom_compare_prob (a,b) {
    // I'm assuming all probabilitys are numbers
    return a.resVal - b.resVal;
  }


class MedianReducer extends BaseReducer {
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
		
        res.sort(custom_compare_prob).reverse();
        let result =  0;

        if(res.length % 2 == 0)
            result = res[res.length / 2].oneOutcome;
        else
            result= res[(res.length - 1) / 2].oneOutcome;

		return result;
	}
}

export default MedianReducer;