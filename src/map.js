"use strict";
var map;
var drawingManager;
var places;
var markers = [];
var model = {
	categories : ko.observable([]),
	selectedCategory : ko.observable(),
	displayedLocations : ko.observableArray([]),
	selectedLocation : ko.observable()
};

ko.applyBindings(model);
model.selectedCategory.subscribe(displayCategory);
model.selectedCategory.subscribe(console.log);

//Clear displayed locations.
model.displayedLocations.subscribe(function(oldLocations){
	$.each(markers, function(i, l){
		l.setMap(null);
	});
	model.selectedLocation(null);
}, null, "beforeChange");

model.displayedLocations.subscribe(function(locations){
	markers = [];
	$.each(locations, function(i, result){
		var marker = new google.maps.Marker({
			position: {
				lat : result.location.coordinate.latitude,
				lng : result.location.coordinate.longitude
			},
			draggable : false,
			map : map
		});
		markers.push(marker);
		(function(){
			marker.addListener('click', function(){
				selectPoi(result);
			});
		}());
	});
});

$(document).ready(function(){
	var mapDiv = document.getElementById("map");
	//Code based on tutorials found @ https://developers.google.com/maps/documentation/javascript/libraries
	map = new google.maps.Map(mapDiv, {
		center : {lat : 33.4936, lng : -117.1484},
		zoom : 15,
		clickable : false,
		disableDefaultUi : true,
		//Hiding default POI: http://stackoverflow.com/a/22792482
		styles : [
		{
			featureType: "poi",
			stylers : [
				{visibility: 'off'}
			]
		}],
		events : {
			click : function(){}
		}
	});
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode : null,
		drawingControl : false,	
	});
	drawingManager.setMap(map);
});

$.ajax("static/data/categories.json", {
	
}).done(function(results){
	results = JSON.parse(results);
	model.categories(results.categories);
	var initialcategory = model.categories();
	//Hard coded, gross!
	model.selectedCategory("All");
});

function findPlaces(category){
	model.displayedLocations(null);
	//Yelp Python client is much easier to use to make requests against api.
	return $.ajax("yelp", {
		data : {
			latitude : 40.7128,
			longitude : -74.0059,
			category_filter : category
		}
	}).done(function(result){
		model.displayedLocations(result.businesses);
	});
}

function displayCategory(category){
	if(category){
		model.displayedLocations([]);
		var categories = model.categories()[category]
		findPlaces(categories);
	}
};

function selectCategory(item){
	model.selectedCategory(item);
}

function selectPoi(poi){
	model.selectedLocation(poi);
	centerMap({
		lat :poi.location.coordinate.latitude,
		lng : poi.location.coordinate.longitude
	});
}

function centerMap(position){
	if(position){
		//http://stackoverflow.com/a/3817835
		map.panTo(position);
	}
}

$(window).resize(function(){
	if(model.selectedLocation()){
		var selectedPosition  = model.selectedLocation().location.coordinate;
		centerMap({
			lat : selectedPosition.latitude,
			lng : selectedPosition.longitude
		});
	}
});