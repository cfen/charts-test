import loadJson from '../components/load-json/';
import { createLeagueObject, maxDataValParsed } from '../js/libs/parse-data';

import * as d3Scale from 'd3-scale'
import * as d3Array from 'd3-array'
import * as d3Axis from 'd3-axis'
import * as d3Collection from 'd3-collection'
import * as d3Format from 'd3-format'
// import * as d3Path from 'd3-path'
import * as d3Select from 'd3-selection'
import * as d3Shape from 'd3-shape'
import * as d3Transition from 'd3-transition'
import * as d3Request from 'd3-request'
import * as d3Time from 'd3-time'

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
		// let serieObj = createLeagueObject(players, "Serie A")
		let laligaObj = createLeagueObject(players, "Ligue 1")

		

		buildBuyView(premObj,"prem")
		buildBuyView(laligaObj,"laliga")
		// buildBuyView(serieObj,"seriea")
}

let buildBuyView = function(dataObj,idAppend){
		buildPairChart(dataObj.premInsPosition, dataObj.premOutsPosition, document.getElementById("graphicOne-"+idAppend),idAppend,"by position")
		buildPairChart(dataObj.oldLeagueGroup, dataObj.newLeagueGroup, document.getElementById("graphicTwo-"+idAppend),idAppend,"by previous league")
		buildPairChart(dataObj.premInsNation, dataObj.premOutsNation, document.getElementById("graphicThree-"+idAppend),idAppend,"by nationality")
}

let buildPairChart = function(dIn, dOut, tgtSvg, leagueID, chartTitle){

	console.log("build",dIn,dOut)

	let heightUnit = 18;

	//var maxDataVal = d3Array.max(dIn, function(d) { return d.total });

	var chartPl = 0;

        //set up svg using margin conventions - we'll need plenty of room on the left for labels
        var margin = {
            top: 60,
            right: 25,
            bottom: 0,
            left: 0
        };

        var width = 820 - margin.left - margin.right,
            //height = (dIn.length*heightUnit) + margin.top + margin.bottom; //good
            height = 500;
        var svg = d3Select.select(tgtSvg).append("svg") 
            .attr("width", width + margin.left + margin.right)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //good

        var legend = svg.append("g")
		    .attr('class', 'legend')
		    .attr('width', width)
		    .attr('height', 20)
		    .attr('transform', 'translate(0,0)');

		legend.append('text')
		    .attr('x', 0)
		    .attr('y', 0)
		    .text(chartTitle);

        var chartWidth = width/2;
        var chartHeight = (dIn.length * heightUnit);
        chartPl = chartWidth;

        var g = svg.append("g")
        	.attr('class', 'chartRight')
	        .attr("width", chartWidth)
			.attr("transform", "translate("+ chartPl + "," +0+ ")");

		var x = d3Scale.scaleLinear().range([0, chartWidth]);
		var y = d3Scale.scaleBand().range([chartHeight, 0]);

		x.domain([0, maxDataVal]);
	    y.domain(dIn.map(function(d) { return d.sortOn; })).padding(0.1);

	    g.append("g")
	        .attr("class", "y axis")
	        //.call(d3Axis.axisRight(y).tickSizeInner((chartWidth-10)));

	    var barsGroup =  g.append("g")
	    	.attr("transform", "translate(0," + margin.top + ")")  
	    barsGroup.selectAll(".bar")
	        .data(dIn)
	      .enter().append("rect")
	        .attr("class", "bar")
	        .attr("data-id", function(d) { return d.sortOn; })
	        .attr("data-val", function(d) { return d.total; })
	        .attr("fill", chartColors.rhsColor)
	        .attr("x", 0)
	        .attr("height", y.bandwidth())
	        .attr("y", function(d) { return y(d.sortOn); })
	        .attr("width", function(d) { return x(d.total); })

	    g.append("g")
	        .attr("class", "x axis")
	       	.attr("transform", "translate(0," + 18 + ")")
	      	.call(d3Axis.axisTop(x).ticks(3).tickFormat(function(d) { return parseInt(d / 1000000); }).tickSizeInner([-(height-10)]));

	     chartPl = 0;

	     // new x set up for 2nd dataset
	     var x2 = d3Scale.scaleLinear().range([0, chartWidth  ]);	
	     x2.domain([0, maxDataVal]);

	     var gLeft = svg.append("g")
	        .attr("width", chartWidth)
			.attr("transform", "translate("+ chartPl + "," + 0 + ")");

		var barsGroup =  gLeft.append("g")
	    	.attr("transform", "translate(0," + margin.top + ")")  
	    barsGroup.selectAll(".bar")
	        .data(dOut)
	      .enter().append("rect")
	        .attr("class", "bar")
	        .attr("data-id", function(d) { return d.sortOn; })
	        .attr("data-val", function(d) { return d.total; })
	        .attr("fill", chartColors.lhsColor)
	        .attr("x", function(d) { return chartWidth - x(d.total) - 1;})
	        .attr("width", function(d) {  return x(d.total); })
	        .attr("height", y.bandwidth())
	        .attr("y", function(d) { return y(d.sortOn); });	

	    gLeft.append("g")
	        .attr("class", "x axis")
	       	.attr("transform", "translate(0," + 18 + ")")
	      	.call(d3Axis.axisTop(x2).ticks(3).tickFormat(function(d) { return parseInt(d / 1000000); }).tickSizeInner([-(height-10)]));
	}


function customXAxis(g) {
  g.call(xAxis);
  g.select(".domain").remove();
}


function customYAxis(g) {
  var s = g.selection ? g.selection() : g;
  g.call(yAxis);
  s.select(".domain").remove();
  s.selectAll(".tick line").filter(Number).attr("stroke", "#777").attr("stroke-dasharray", "2,2");
  s.selectAll(".tick text").attr("x", 4).attr("dy", -4);
  if (s !== g) g.selectAll(".tick text").attrTween("x", null).attrTween("dy", null);
}

