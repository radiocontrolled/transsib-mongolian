
/* 
 * by Alison Benjamin 
 * http://benj.info
 */

var height,
	width, 
	mapData,
	map,
	trackData,   
	track,  		
	railway, 
	projection, 
	path, 
	city,
	cityName;
	

var getViewportDimensions = function(){	
	width = document.getElementById("map").offsetWidth;	
	height = window.innerHeight * 0.90; 	
};



queue()
    .defer(d3.json, "data/europeAsiaSimple.json") // Russia-Mongolia-China GeoJSON
    .defer(d3.json, "data/transSiberianSimple.json") // Transsiberian line
    .defer(d3.csv, "data/cities.csv") // city names & lat long
    .await(function(error, map, rail, cities) { 
    	if(error){
    		console.log(error);
    	}
    	else{
    		mapData = map;
    		trackData = rail;
			city = cities;
    		drawSVGMap();
    	}
    	
    });


var drawSVGMap = function(){


	getViewportDimensions();
	
	map = d3.select("#map")
		.append("svg")
		.attr({
			"width": width,
			"height": height
		});


	projection = d3.geo.albers()
		.rotate([-90, 0])
 		.center([-10, 70])
   		.parallels([52, 64])
   		.scale(height/1.25)
   		.translate([width/2.2, height/3]); 
   


	path = d3.geo.path()
		.projection(projection);
	
	map
		.append("g")
		.classed("russia-mongolia-china",true)
		.selectAll("path.map")
		.data(mapData.features)
		.enter()
		.append("path")
		.classed("map", true)
		.attr({
			"d": path,
			"class": function(d){
				return d.properties.sovereignt;
			}
		});
		

	map
		.append("g")
		.classed("rail",true)
		.selectAll("path")
		.data(trackData.features)
		.enter()
        .append("svg:path")
        .attr("d", path)
        .attr("fill-opacity", 0.5)
        .attr("fill", "#fff")
        .attr("stroke", "#333");
        
    
	map
		.append("g")
		.classed("cities",true)
		.selectAll("circle")
		.data(city)
		.enter()
		.append("g")
		.classed("dot", true)
		.attr({
			"transform": function(d){
				return "translate(" + projection([d.Lat,d.Long]) + ")";
			}
		})
		.append("circle")
		.attr({
			"r": 3
		});	
	
	map.selectAll("g.dot")
		.append("text")
		.text(function(d){
			return d.City;
		})
		.attr({
			"transform":"translate(0,-10)",
			"xml:space": "preserve"
		});
		
	
	// label each country 
	map
		.selectAll(".mapName")
		.data(mapData.features)
		.enter()
		.append("text")
		.attr({
				"transform": function(d) {
					return "translate(" + path.centroid(d) + ")"; 
				},
				
				"class": "mapLabel"
		})
		.text(function(d){
			return d.properties.name;
		});
		 
	
	
};



d3.select(window).on('resize', resize);

function resize(map){
	
	
	getViewportDimensions();

	
	map = d3.select("#map svg")
		.attr({
			"width": width,
			"height": height
		});
	

	projection = d3.geo.albers()
		.rotate([-90, 0])
 		.center([-10, 70])
   		.parallels([52, 64])
   		.scale(height/1.25)
   		.translate([width/2.2, height/3]); 
   		

	path = d3.geo.path()
		.projection(projection);
   	
 	d3.selectAll(".russia-mongolia-china path")
 		.attr("d", path);
 	
 	d3.selectAll(".rail path")
		.attr("d", path);
	
	d3.selectAll("g.dot")
		.attr({
			"transform": function(d){
				return "translate(" + projection([d.Lat,d.Long]) + ")";
			}
		})
	
	d3.selectAll(".mapLabel")
		.attr({
			"transform": function(d) {
				return "translate(" + path.centroid(d) + ")"; 
			}
		})
		
	
   	
  
}

