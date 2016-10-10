"use strict";
//Code based on tutorials found @ https://developers.google.com/maps/documentation/javascript/libraries
var apiKey = "AIzaSyC39F98J8I20xdZDOKeVTO-R5jP8nNXQic";
var map;
var drawingManager;
var places;
var model = {
/*
	this.categories = ko.observableArray(["Amusement Park", "Aquarium", "Art Gallery", "Bakery", "Bar", 
		"Beauty Salon", "Book Store", "Cafe", "Casino", "Clothing Store", "Electronics Store", "Hair Care", 
		"Jewelry Store", "Museum", "Night Club", "Park", "Restaurant", "Shoe Store", "Shopping Mall", "Spa",
		"Zoo"]);
	this.selectedCategory = ko.observable();
	*/
	aValue : ko.observable("Value")
};
ko.applyBindings(model);
/*
$(document).ready(function(){
	
	var mapDiv = $("#map").get()[0];
	map = new google.maps.Map(mapDiv, {
		center : {lat : 33.4936, lng : -117.1484},
		zoom : 16
	});
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode : google.maps.drawing.OverlayType.MARKER,
		drawingControl : false,
		markerOptions: {
			icon : ""
		}
	});
	drawingManager.setMap(map);
	places = new google.maps.places.PlacesService(map);
	/*
	model.selectedCategory.subscribe(function(newVal){
		var request = {
			location : {lat : 33.4936, lng : -117.1484},
			radius : 10000
		};
		places.nearbySearch(request, function(searchResult){
			
		});
	});
});
*/