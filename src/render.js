import Handlebars from 'handlebars/dist/handlebars'

import mainTemplate from "./src/templates/main.html!text"

import chartTemplate from "./src/templates/chartTemplate.html!text"

const premClubs = ["Arsenal","Bournemouth","Brighton","Burnley","Cardiff_City","Chelsea","Crystal_Palace","Everton","Fulham","Huddersfield_Town","Leicester_City","Liverpool","Manchester_City","Manchester_United","Newcastle_United","Southampton","Tottenham_Hotspur","Watford","West_Ham_United","Wolverhampton_Wanderers"];

const reqLeagues = ["Premier League","Serie A","La Liga","Ligue 1","Bundesliga"];

const chartSet = [{chartTitle: "position", fiveBar: true, tenBar: false},{chartTitle: "league", fiveBar: false, tenBar: true},{chartTitle: "nation", fiveBar: false, tenBar: true}]

export async function render() {
	let dataObj = {};
	dataObj.objArr = buildObject(reqLeagues);
	console.log(dataObj)
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


function buildObject(obj) {
    let keys = Object.keys(obj), i, len = keys.length;
    //keys.sort();

    var a = []

    for (i = 0; i < len; i++) {
        let k = keys[i];
        let t = {}
        t.sortOn = k;
        t.teamName = obj[k];
        t.teamNameID = t.teamName.split(" ").join("").toLowerCase();
        t.teamNameDisplay = t.teamName.split("_").join(" ");
        t.chartsArr = chartSet;

        a.push(t);
    }

    return a;
}








