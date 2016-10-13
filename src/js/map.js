"use strict";
var map;
var drawingManager;
var markers = [];
var model = {
    categories: ko.observable([]),
    selectedCategory: ko.observable(),
    displayedLocations: ko.observableArray([]),
    selectedLocation: ko.observable(),
    categoryError: null,
    locationError: null
};

readyMap = function () {
    var mapDiv = $("#map").get();
    //Code based on tutorials found @ https://developers.google.com/maps/documentation/javascript/libraries
    map = new google.maps.Map(mapDiv, {
        center: {lat: 33.4936, lng: -117.1484},
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
        results = JSON.parse(results);
        model.categories(results.categories);
        //Hard coded, gross!
        model.selectedCategory("All");
    }).fail(function () {
        model.categoryError = "Unable to load the location categories";
    });
};


//Clear displayed locations.
model.displayedLocations.subscribe(function () {
    $.each(markers, function (i, l) {
        l.marker.setMap(null);
    });
    model.selectedLocation(null);
}, null, "beforeChange");

function findPlaces(category) {
    model.displayedLocations(null);
    //Send the request to the server to use the Python yelp client,
    //keeps secret api tokens out of the browser.
    return $.ajax("yelp", {
        data: {
            latitude: 40.7128,
            longitude: -74.0059,
            category_filter: category
        }
    }).done(function (result) {
        model.displayedLocations(result.businesses);
    }).fail(function () {
        model.locationsError = "Unable to get the locations.";
    });
}

function displayCategory(category) {
    if (category) {
        model.displayedLocations([]);
        var categories = model.categories()[category];
        findPlaces(categories);
    }
}

function selectCategory(item) {
    model.selectedCategory(item);
}

function centerMap(position) {
    if (position) {
        //http://stackoverflow.com/a/3817835
        map.panTo(position);
    }
}

function selectPoi(poi) {
    model.selectedLocation(poi);
    centerMap({
        lat: poi.location.coordinate.latitude,
        lng: poi.location.coordinate.longitude
    });
}

ko.applyBindings(model);
model.selectedCategory.subscribe(displayCategory);

model.displayedLocations.subscribe(function (locations) {
    markers = [];
    $.each(locations, function (i, result) {
        var marker = new google.maps.Marker({
            position: {
                lat: result.location.coordinate.latitude,
                lng: result.location.coordinate.longitude
            },
            draggable: false,
            map: map,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        markers.push({location: result.id, marker: marker});
        (function () {
            marker.addListener("click", function () {
                selectPoi(result);
            });
        }());
    });
});

model.selectedLocation.subscribe(function (location) {
    if (location) {
        var markerPair = markers.find(function (m) {
            return m.location === location.id;
        });
        var originalMarker = markerPair.marker;
        (function () {
            markerPair.marker.addListener("click", function () {
                selectPoi(
                    model.displayedLocations().find(function (l) {
                        return l.id === markerPair.location;
                    })
                );
            });
        }());
        markerPair.marker = new google.maps.Marker({
            position: markerPair.marker.position,
            draggable: false,
            map: map
        });
        originalMarker.setMap(null);
    }
});

model.selectedLocation.subscribe(function (location) {
    if (location) {
        var markerPair = markers.find(function (m) {
            return m.location === location.id;
        });
        var originalMarker = markerPair.marker;
        markerPair.marker = new google.maps.Marker({
            position: markerPair.marker.position,
            draggable: false,
            map: map,
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        (function () {
            markerPair.marker.addListener("click", function () {
                selectPoi(
                    model.displayedLocations().find(function (l) {
                        return l.id === markerPair.location;
                    })
                );
            });
        }());
        originalMarker.setMap(null);
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