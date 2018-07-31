import Handlebars from 'handlebars/dist/handlebars'

import mainTemplate from "./src/templates/main.html!text"

const clubs = ["Arsenal","Bournemouth","Brighton","Burnley","Cardiff_City","Chelsea","Crystal_Palace","Everton","Fulham","Huddersfield_Town","Leicester_City","Liverpool","Manchester_City","Manchester_United","Newcastle_United","Southampton","Tottenham_Hotspur","Watford","West_Ham_United","Wolverhampton_Wanderers"];


export async function render() {

	let teamObj = {};

	teamObj.objArr = buildObject(clubs);

	console.log(teamObj)

	let html = compileHTML(teamObj);

	// let newObj = {}

	// newObj.clubs = clubs;

 //    // this function just has to return a string of HTML
 //    // you can generate this using js, e.g. using Mustache.js

 return html;

}


function compileHTML(dataIn) {
    Handlebars.registerHelper('html_decoder', function(text) {
        var str = unescape(text).replace(/&amp;/g, '&');
        return str;
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
        t.teamNameDisplay = t.teamName.split("_").join(" ");
        a.push(t);
    }

    return a;
}