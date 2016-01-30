var width = $(window).width(), height = $(window).height();

$("#infoDiv").ready (function() {
	$("#infoDiv").animate({
		width:'toggle'
	}, 0.1);
});

var getInfoWidth = function(){
	var infoWidth = $("#infoDiv").width();
	return infoWidth;
};

var getInfoHeight = function() {
	var infoHeight = $("#infoDiv").height();
	return infoHeight;
};

var divToggled = false;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);
	//.attr("style", "outline: thin solid grey;");

var projection = d3.geo.orthographic()
	.scale(2000)
	.translate([width/2, height/2])
	.center([2.1833, 41.3833]);

var path = d3.geo.path()
	.projection(projection);

var active_countries = ["Portugal","Spain","France","Netherlands","England","Denmark"];

d3.json("region_un_Europe_subunits.json", function( json) {
	
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("class", function(d) {
        	if(active_countries.indexOf(d.properties.subunit)>-1) {
        		return "country active"
        	}
        	else {
        		return "country not-active"
        	};
      	})
		.attr("d", path)
		//.on("dblclick", function(d){
		//	if (active_countries.indexOf(d.properties.subunit)>-1) {
		//		console.log(d.properties);
				//var searchURL = "https://www.google.ae/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=" + denmark%20slave%20trade
		//	}
		//})
      	// .style("fill", function(d){
      	// 	var colourScale = d3.scale.log()
      	// 						.domain([50000, 4700000])
      	// 						.range([50, 150]);
      	// 	if (active_countries.indexOf(d.properties.subunit)>-1) {
      	// 		return "rgb(100, 100," + colourScale(d.properties.slaves_transported) + ")";
      	// 	}
      	// })
		.on("click", function(d){
			if(active_countries.indexOf(d.properties.subunit)>-1){
				console.log(d.properties);
				$('#infoDiv').html("<p><p>");
				$('#infoDiv').append("<p><p>");
				$('#infoDiv').append('<div class="title">'+d.properties.sovereignt+"</div>");
				$('#infoDiv').append("<div>"+d.properties.sovereignt+ " made " +d.properties.voyages+ " voyages from Africa to the Americas and carried over " +d.properties.slaves_transported+" slaves to the New World</div>");

				var h = getInfoHeight()*(0.7);
				var w = getInfoWidth();
				var barPadding = 2;
				var regPadding = 20;
				var embark = d.properties.embarkations;

				var yScale = d3.scale.linear()
							.domain([0, d3.max(embark, function(d) {return d; })])
							.range([0, h-regPadding]);
							
				var xScale = d3.scale.ordinal()
							.domain(["1501-1580", "1580-1640", "1640-1700", "1700-1760", "1760-1820", "1820-1880"])
							.rangeRoundBands([0, w]);
							//.rangePoints([(w / embark.length - barPadding) / 2, 5*((w / embark.length - barPadding) / 2)]);

				var barsvg = d3.select("#infoDiv")
								.append("svg")
								.attr("width", w)
								.attr("height", h)
								.attr("transform", "translate(0, -20)");

				var xAxis = d3.svg.axis()
								.scale(xScale)
								.orient("bottom");

				barsvg.selectAll("rect")
						.data(embark)
						.enter()
						.append("rect")
						.attr("x", function(d, i) {
							return i * (w/embark.length);
						})
						.attr("y", function(d) {
							return h-(yScale(d)) - regPadding;
						})
						.attr("width", w/embark.length - barPadding)
						.attr("height", function(d) {return yScale(d) - 15;
						});

				barsvg.selectAll("text")
						.data(embark)
						.enter()
						.append("text")
						.text(function(d) {return d; })
						.attr("x", function(d, i) {
							return i * (w/embark.length) + (w / embark.length - barPadding) / 2;
						})
						.attr("y", function(d) {
							if (d<9000){
								return h-(yScale(d)+25+15);
							} else {
								return h - yScale(d)-8;
							}

						})
						.attr("font-family", "sans-serif")
						.attr("font-size", "11px")
						.attr("text-anchor", "middle")
						.attr("fill", function(d) {
							if (d>9000) {
								return "white";
							}
						});

				barsvg.append("g")
						.attr("class", "axis")
						.attr("transform", "translate(0," + ((h - regPadding)-15) + ")")
						.call(xAxis);


				barsvg.append("text")
            			.attr("text-anchor", "middle")
            			.attr("transform", "translate("+ (w/2) +","+(h-(regPadding/3) + 5)+")") 
            			.text("Date");

				if (divToggled === false) {
					$("#infoDiv").animate({
						width: ['toggle', 'swing'],
					}, 400);

					divToggled = true;
				}

			} else {
				if (divToggled === true) {
					$('#infoDiv').html("<div></div>");
					$("#infoDiv").animate({
						width:'toggle'
					}, 400);
				divToggled = false;
			}
		
			}

		});
});
var pageTitle = "The Case for Reparations?";
$("body").append('<div class="page-title"><strong>'+pageTitle+"</strong></div>");



