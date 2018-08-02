import loadJson from '../components/load-json/';
import { createLeagueObject, maxDataValParsed } from '../js/libs/parse-data';



var maxDataVal;

const chartColors = { lhsColor:"#02B7FF", rhsColor:"#02B7FF", axisColor: "#CCC", labelColor:"#222"}

loadJson("https://interactive.guim.co.uk/docsdata-test/1OK4iKZwounIniO0ZOL-rp_Q5AkPmts4LK1gicT6JtyU.json")
      .then((data) => {
	  	let dataObj = setData(data.sheets.Transfers);
	  	buildBuyView(dataObj);
 })

let setData = function(players){

		players.forEach((player,k) => {
			player.prevClub = player['What was the previous club?'];
			player.newClub = player['What is the new club?'];
			player.newClubID = player.newClub.split(" ").join("_");
			player.position = player['Primary player position'];
			player.prevLeague = player['What was the previous league?'];
			player.newLeague = player['What is the new league?'];
			if(!player['Price in £']){ player['Price in £'] = 0 };

			player.priceGBP = Number(player['Price in £']);
			if(player['Players international country']){ player.nation = player['Players international country'];}
		});

		let premObj = createLeagueObject(players, "Premier League")
		maxDataVal = maxDataValParsed(); //run this after most expensive league - can be done intelligently by comparing with a temp val after each league
		
		let laligaObj = createLeagueObject(players, "Ligue 1")



		buildBuyView(premObj,"premierleague")
		buildBuyView(laligaObj,"laliga")
		// buildBuyView(serieObj,"seriea")
		// buildBuyView(serieObj,"ligue1")
		// buildBuyView(serieObj,"bundesliga")
}

let buildBuyView = function(dataObj,idAppend){
	console.log(dataObj,idAppend);
	// buildPairChart(dataObj.premInsPosition, dataObj.premOutsPosition, document.getElementById("graphicOne-"+idAppend),idAppend,"by position")
	// buildPairChart(dataObj.oldLeagueGroup, dataObj.newLeagueGroup, document.getElementById("graphicTwo-"+idAppend),idAppend,"by previous league")
	// buildPairChart(dataObj.premInsNation, dataObj.premOutsNation, document.getElementById("graphicThree-"+idAppend),idAppend,"by nationality")
}



