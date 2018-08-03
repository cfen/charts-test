import Handlebars from 'handlebars/dist/handlebars'

import mainTemplate from "./src/templates/main.html!text"

import chartTemplate from "./src/templates/chartTemplate.html!text"

const premClubs = ["Arsenal","Bournemouth","Brighton","Burnley","Cardiff_City","Chelsea","Crystal_Palace","Everton","Fulham","Huddersfield_Town","Leicester_City","Liverpool","Manchester_City","Manchester_United","Newcastle_United","Southampton","Tottenham_Hotspur","Watford","West_Ham_United","Wolverhampton_Wanderers"];

const reqLeaguesArr = [{displayTitle:"Premier League", leagueId:"premierleague"},
                        {displayTitle:"Serie A", leagueId:"seriea"},
                        {displayTitle:"La Liga", leagueId:"laliga"},
                        {displayTitle:"Ligue 1", leagueId:"ligue1"},
                        {displayTitle:"Bundesliga", leagueId:"bundesliga"}];


const reqCharts = ["position", "league", "nation"]

const chartArr = [{chartTitle: "position", fiveBar: true, tenBar: false, reqLeagues: reqLeaguesArr},{chartTitle: "league", fiveBar: false, tenBar: true, reqLeagues: reqLeaguesArr},{chartTitle: "nation", fiveBar: false, tenBar: true, reqLeagues: reqLeaguesArr}]

export async function render() {
	let dataObj = {};

    dataObj.objArr = [];

    reqCharts.forEach((o,k) =>{
        dataObj.objArr.push(buildObject(o,k))
    })
    
    dataObj.objArr.forEach((o,k) =>{

        // console.log(o.teamNameID)
        // console.log(o.chartsArr)
    })


	let html = compileHTML(dataObj);

    return html;

}


function compileHTML(dataIn) {

    Handlebars.registerHelper('html_decoder', function(text) {
        var str = unescape(text).replace(/&amp;/g, '&');
        return str;
    });

    Handlebars.registerPartial({
        'chartTemplate': chartTemplate
    });

    var content = Handlebars.compile(
        mainTemplate, {
            compat: true
        }
    );

    var newHTML = content(dataIn);

    return newHTML

}




function buildObject(o,k) {
        

        if(k===0){ console.log(k,"position")}
        if(k===1){ console.log(k,"league")}
        if(k===2){ console.log(k,"nation")}


        var t = {}
        var s = o;
        t.sortOn = o;
        t.teamNameID = s.split(" ").join("").toLowerCase();
        t.chartsArr = reqLeaguesArr;
        t.chartsArr.every((item,k) => item.parentId = t.teamNameID);
   
        return t;

}








