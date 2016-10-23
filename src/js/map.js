//Google maps load callback, must be declared at global scope.
var readyMap;

var blueIconUrl="http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
var redIconUrl="http://maps.google.com/mapfiles/ms/icons/red-dot.png";
(function(){
"use strict";
var map;
var drawingManager;
var markers = [];
function Model(){
    this.categories= ko.observable();
    this.selectedCategory= ko.observable();
	this.locations = ko.observableArray([]);
	this.filter = ko.observable();
    this.displayedLocations= ko.computed(function(){
		this.locations().forEach(function (location) {
			var existingMarker = markers.find(function(marker){
				return marker.location == location.id;
			});
			if(!existingMarker){
				var marker = new google.maps.Marker({
					position: {
						lat: location.location.coordinate.latitude,
						lng: location.location.coordinate.longitude
					},
					draggable: false,
					map: map,
					icon: blueIconUrl,
					visible : true
				});
				markers.push({location: location.id, marker: marker});
				(function () {
					marker.addListener("click", function () {
						model.selectPoi(location);
					});
				}());
			}
		});
		markers.forEach(function(marker){
			marker.marker.setVisible(false);
		});
		var self = this;
		var displayed = this.locations().filter(function(e){
			return !self.filter() || e.name.toLowerCase().indexOf(self.filter().toLowerCase()) !== -1;
		});
		displayed.forEach(function(location){
			var markerPair = markers.find(function(m){
				return m.location == location.id;
			});
			markerPair.marker.setVisible(true);
		});
		return displayed;
	}, this);
    this.selectedLocation= ko.observable();
    this.categoryError= ko.observable();
    this.locationError= ko.observable();
	this.selectPoi = function(poi) {
			model.selectedLocation(poi);
			centerMap({
				lat: poi.location.coordinate.latitude,
				lng: poi.location.coordinate.longitude
			});
		};
}
var model = new Model();

readyMap = function () {
    var mapDiv = $("#map").get()[0];
    //Code based on tutorials found @ https://developers.google.com/maps/documentation/javascript/libraries
    map = new google.maps.Map(mapDiv, {
        center: {lat: 40.7142700, lng: -74.0059700},
        zoom: 15,
        clickable: false,
        disableDefaultUi: true,
        //Hiding default POI: http://stackoverflow.com/a/22792482
        styles: [
            {
                featureType: "poi",
                stylers: [
                    {visibility: "off"}
                ]
            }
        ]
    });
    drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: false
    });
    drawingManager.setMap(map);
    $.get("static/data/categories.json").done(function (results) {
        model.categories(results.categories);
        //Hard coded, gross!
        model.selectedCategory("All");
    }).fail(function () {
        model.categoryError("Unable to load the location categories");
    });
	ko.applyBindings(model);
};

window.maperror = function(msg, url, line, column, error){
	$("#map").text("Something went wrong when trying to load the script for the map.");
}

function findPlaces(category) {
    //Send the request to the server to use the Python yelp client,
    //keeps secret api tokens out of the browser.
    return $.ajax("yelp", {
        data: {
            latitude: 40.7128,
            longitude: -74.0059,
            category_filter: category,
			radius_filter: 10000
        }
    }).done(function (result) {
        model.locations(result.businesses);
    }).fail(function () {
        model.locationError("Unable to get the locations.");
    });
}

function displayCategory(category) {
    if (category) {
        model.locations([]);
        var categories = model.categories()[category];
        findPlaces(categories);
		if(model.locations().length){
			model.selectedLocation(model.locations()[0]);
		}
    }
}

function centerMap(position) {
    if (position) {
        //http://stackoverflow.com/a/3817835
        map.panTo(position);
    }
}

model.selectedCategory.subscribe(displayCategory);


model.selectedLocation.subscribe(function (newLocation) {
    if (newLocation) {
        var markerPair = markers.find(function (m) {
            return m.location === newLocation.id;
        });
        markerPair.marker.setIcon(redIconUrl);
    }
});

model.locations.subscribe(function(){
	markers.forEach(function(m){
		m.marker.setMap(null);
	});
	markers = [];
}, null, "beforeChange");

model.selectedLocation.subscribe(function (oldLocation) {
    if (oldLocation) {
        var markerPair = markers.find(function (m) {
            return m.location === oldLocation.id;
        });
        markerPair.marker.setIcon(blueIconUrl);
    }
}, null, "beforeChange");


$(window).resize(function () {
    if (model.selectedLocation()) {
        var selectedPosition = model.selectedLocation().location.coordinate;
        centerMap({
            lat: selectedPosition.latitude,
            lng: selectedPosition.longitude
        });
    }
});
})();