import loadJson from '../components/load-json/';
import { createLeagueObject, maxDataValParsed, getPcVals } from '../js/libs/parse-data';

var maxDataVal;


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
		let laligaObj = createLeagueObject(players, "Ligue 1");

		premObj = getPcVals(premObj,maxDataVal);
		laligaObj = getPcVals(laligaObj,maxDataVal);

		buildBuyView(premObj,"premierleague");
		buildBuyView(laligaObj,"laliga");
		//buildBuyView(laligaObj,"laliga");
		// buildBuyView(serieObj,"seriea");
		// buildBuyView(serieObj,"ligue1");
		// buildBuyView(serieObj,"bundesliga");

		addAxisVals();
}


let buildBuyView = function(dataObj,idAppend){
	console.log(dataObj,idAppend);

	dataObj.premOutsPosition.forEach((o,k) =>{
		document.getElementById(idAppend+"_position"+"_lhBar_"+k).style.width=(o.pcVal/2)+"%"; //charts are 50% of width so half the value 
		document.getElementById(idAppend+"_position"+"_BarTitle_"+k).innerHTML = getBarTitleStr(o.sortOn, o.niceTotal);  //premierleague_position_BarTitle_0
	})	

	dataObj.premInsPosition.forEach((o,k) =>{
		document.getElementById(idAppend+"_position"+"_rhBar_"+k).style.width=(o.pcVal/2)+"%"; //charts are 50% of width so half the value 
		document.getElementById(idAppend+"_position"+"_BarTitle_"+k).innerHTML += " <span class='money-out'>"+(o.niceTotal)+"m out</span>";  //premierleague_position_BarTitle_0
	})
}

let addAxisVals = function(){
	document.querySelectorAll('.max-tick').forEach((tick) => {
		tick.innerHTML = maxDataVal/1000000+"m";
	})
}

let getBarTitleStr = function(s, total){
	
	if(s === "GK"){s = "Goalkeepers"}
	if(s === "D"){s = "Defenders"}
	if(s === "M"){s = "Midielders"}
	if(s === "W"){s = "Wingers"}
	if(s === "F"){s = "Forwards"}

	var strFee = getFee(total);
	return "<b>"+s+"</b> <span class='money-in'>"+strFee+"m in</span> |";
}


let getFee = function(n){
	return (n);
}



