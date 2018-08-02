import { groupBy } from '../libs/group-by';

export var maxDataValTemp = 0;

export function createLeagueObject(players, leagueSelector){
	let premIns = players.filter(function (p) {
		  return p.newLeague === leagueSelector;
		});

		let premOuts = players.filter(function (p) {
		  return p.prevLeague === leagueSelector && p.newLeague != leagueSelector;
		});

		let premInOuts = players.filter(function (p) {
		  return p.prevLeague === leagueSelector && p.newLeague === leagueSelector;
		});

		premInOuts = addDataSort(premInOuts,'prevLeague','priceGBP');

		let tempObj = {};

		tempObj.oldLeagueGroup = addDataSort(premIns,'prevLeague','priceGBP');
		tempObj.newLeagueGroup = addDataSort(premOuts,'newLeague','priceGBP');
		tempObj.premInsPosition = addDataSort(premIns,'position','priceGBP');
		tempObj.premOutsPosition = addDataSort(premOuts,'position','priceGBP');
		tempObj.premInsNation = addDataSort(premIns,'nation','priceGBP');
		tempObj.premOutsNation = addDataSort(premOuts,'nation','priceGBP');

		tempObj.buyGroup = groupBy(premIns, transfer => transfer.newClub);
		tempObj.sellGroup = groupBy(premIns, transfer => transfer.prevClub);
		tempObj.nationsGroup = groupBy(premIns, transfer => transfer.nation);

		tempObj.oldLeagueGroup.sort(function (a, b) { return b.total - a.total; });
		tempObj.oldLeagueGroup.length = 10;
		tempObj.oldLeagueGroup.sort(function (a, b) { return b.total - a.total; });
		tempObj.oldLeagueGroup.reverse();

		tempObj.premInsNation.sort(function (a, b) { return b.total - a.total; });
		tempObj.premInsNation.length = 10;
		tempObj.premInsNation.reverse();

		tempObj.premOutsNation = getOutsArray( tempObj.premInsNation, tempObj.premOutsNation )

		// can't use getOutsArray function for leagues 
		// tempObj.newLeagueGroup = getOutsArray( tempObj.oldLeagueGroup, tempObj.newLeagueGroup )

		var tempArr = [];
		tempArr.length = 10;
		tempObj.oldLeagueGroup.forEach((obj,k) => {
			var sortStr = obj.sortOn;
			var ob = tempObj.newLeagueGroup.find(function (ob) { return ob.sortOn === sortStr; });
			if(!ob){ ob = {sortOn: sortStr, objArr:[], total:0} ;}
			if(sortStr == leagueSelector){ ob = premInOuts[0] }
			tempArr[k] = ob;
		});
		tempObj.newLeagueGroup = tempArr;
		// end can't use getOutsArray for leagues 

		return tempObj;
}


let getOutsArray = function(insArr, outsArr){
	var tempArr = [];
	tempArr.length = insArr.length;

		insArr.forEach((obj,k) => {
			var ob;
			var sortStr = obj.sortOn;
			ob = outsArr.find(function (ob) { return ob.sortOn === sortStr; });
			if(!ob){ ob = {sortOn: sortStr, objArr:[], total:0} ;}
			tempArr[k] = ob;
		});

	return tempArr;
}




let addDataSort = function(arrIn, outputVal, numVal){

	let tempGroup = groupBy(arrIn, transfer => transfer[outputVal]);

		let tempArr = [];

		tempGroup.forEach((arr,k) => {
			var o = {};
			o.sortOn = k
			o.objArr = arr;
			o.total = arr.map(item => item[numVal]).reduce((prev, next) => prev + next);

			if (o.total > maxDataValTemp){ maxDataValTemp = o.total } // set max value for charts here

			tempArr.push(o);	
		});

	tempArr.sort(function (a, b) { return b.total - a.total; });


	if (outputVal == 'position'){ 
		var tempArrTwo = [ ];

		tempArr.forEach((o,k) => {
			if(o.sortOn == "GK"){ tempArrTwo[0] = o } // add long label
			if(o.sortOn == "D"){ tempArrTwo[1] = o }
			if(o.sortOn == "M"){ tempArrTwo[2] = o }
			if(o.sortOn == "W"){ tempArrTwo[3] = o }
			if(o.sortOn == "F"){ tempArrTwo[4] = o }
		});

		tempArr = tempArrTwo;

	}

	console.log(maxDataValTemp)

	return tempArr;

}



export function maxDataValParsed(){
	return maxDataValTemp;
}