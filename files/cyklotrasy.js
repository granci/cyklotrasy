var map;
var geocoder;
// var layer_c;
var layer1;
var layer2;
var layer3;
var layer4;
var stojany;
var cyklotrasy1;
var cyklotrasy2;
var cyklotrasy3;
var cyklotrasy_oma;
var pozicovne;
var trafficLayer;
var panoramioLayer;
var weatherLayer;
var directionsDisplay;
var rendererOptions = {
    draggable: true,
	markerOptions: {draggable: true},
	//PolylineOptions: {strokeWeight: 10, strokeColor: "red"},
  };
// Enable the visual refresh
google.maps.visualRefresh = true;
// inicializacia mapy
function initialize() {
	geocoder = new google.maps.Geocoder();
	directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
	map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: new google.maps.LatLng(48.138199, 17.106400),
		zoom: 12,
		panControl: false,
		streetViewControlOptions: {
			position: google.maps.ControlPosition.TOP_LEFT
		},
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.DEFAULT,
			position: google.maps.ControlPosition.TOP_LEFT,
		},
		scaleControl: true,
		scaleControlOptions: {
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		},
		overviewMapControl: true,
		mapTypeId: google.maps.MapTypeId.TERRAIN //ROADMAP
	});
	// vrstva cyklotras (farby definovane podla stlpca COLOUR)
/* 	layer_c = new google.maps.FusionTablesLayer({
		map: map,
		query: {
			select: "col8",
			from: "1HIWaZLF_h9LQ0hQ-BAc10IrUSNe9B5iSD2ZmWZg" //"1G05nQ7hSNgG6dSlWaAW4cvhyngG_BAj6P40dYno"
		},
		options: {
			styleId: 2,
			templateId: 2
		},
		styles: [{
			polylineOptions: {
				strokeOpacity: 0.35
			}
		}]
	}); */
	// nevhodne ulice 
	layer1 = new google.maps.FusionTablesLayer({
		map: null,
		query: {
			select: "col11",
			from: "1wbJ7qg_i4hvXhpmTNAoQhtMvR3u67WS9W4ls0RE",
			where: ""
		},
		options: {
			styleId: 2,
			templateId: 2
		}
	});
	//vedlajsie ulice
	layer2 = new google.maps.FusionTablesLayer({
		map: null,
		query: {
			select: "col10",
			from: "1FzBRaa4jUWYWZpsObSDangJo83IZQGXpOrNmWCA",
			where: ""
		},
		options: {
			styleId: 2,
			templateId: 2
		}
	});
	//chodniky
	layer3 = new google.maps.FusionTablesLayer({
		map: null,
		query: {
			select: "col11",
			from: "15QEdHhOP9efriPR8wFFV813drZ0uFO2kIpal3G4",
			where: ""
		},
		options: {
			styleId: 2,
			templateId: 2
		}
	});
	//poi
	layer4 = new google.maps.FusionTablesLayer({
		map: null,
		heatmap: { enabled: false },
		query: {
			// select: "col6",
			// from: "1Bia7Vd08TyJ4yMigiQ8UBzJQYRO9-F2MN1WL0AQ",
			// where: ""
			select: "col2",
			from: "1CJ5x5zch1KiZz6P5188BFgL8nnv0btDkvvM6K_A",
			where: ""
		},
		options: {
			styleId: 2,
			templateId: 2
		}
	});
	//kml stojany
	stojany = new google.maps.KmlLayer({
		map: null,
		url: 'https://dl.dropboxusercontent.com/u/58021984/files/slovensko-stojany1.kml',
		preserveViewport: true
	});
	//kml cyklotrasy
	cyklotrasy1 = new google.maps.KmlLayer({
		map: map,
		url: 'https://dl.dropboxusercontent.com/u/58021984/files/slovensko-cyklotrasy14.kml',
		preserveViewport: true
	});
	cyklotrasy2 = new google.maps.KmlLayer({
		map: map,
		url: 'https://dl.dropboxusercontent.com/u/58021984/files/slovensko-cyklotrasy25.kml',
		preserveViewport: true
	});
	cyklotrasy3 = new google.maps.KmlLayer({
		map: map,
		url: 'https://dl.dropboxusercontent.com/u/58021984/files/slovensko-cyklotrasy33.kml',
		preserveViewport: true
	});
	cyklotrasy_oma = new google.maps.KmlLayer({
		map: map,
		url: 'https://dl.dropboxusercontent.com/u/58021984/files/cyklotrasa5.kml',
		preserveViewport: true
	});
	//kml pozicovne
	pozicovne = new google.maps.KmlLayer({
		map: null,
		url: 'https://dl.dropboxusercontent.com/u/58021984/files/slovensko-pozicovne4.kml',
		preserveViewport: true
	});
	// doprava
	trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(null);
	// panoramio
	panoramioLayer = new google.maps.panoramio.PanoramioLayer();
	panoramioLayer.setMap(null);
	//pocasie
	weatherLayer = new google.maps.weather.WeatherLayer({
		temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
	});
	weatherLayer.setMap(null);
}
google.maps.event.addDomListener(window, 'load', initialize);

//samostatne funkcie
// funkcia na prepinanie vrstiev
function toggleLayer(this_layer){
	if(this_layer.getMap() == null) {
		this_layer.setMap(map)
	} else {
		this_layer.setMap(null);
	}
}
// funkcia na vyhladanie adresy
var marker1;
var infowindow1;
function codeAddress() {
	var address = document.getElementById('address').value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			// Remove the current marker1, if there is one
			if (marker1) marker1.setMap(null);
			marker1 = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location,
				title: "Výsledky Vášho vyhľadávania",
				animation: google.maps.Animation.DROP,
				// draggable:true,
			});
			// Remove the current infoWindow1, if there is one
			//if (infoWindow1) infoWindow1.setMap(null);
			infowindow1 = new google.maps.InfoWindow({
				content: "<b>Nájdená adresa</b>" //+ results[1].formatted_address
			});
			google.maps.event.addListener(marker1, 'click', function() {
				infowindow1.open(map,marker1);
			});
		} else {
			alert('Vyhľadávanie neprebehlo úspešne z nasledujúceho dôvodu: ' + status);
		}
	});
}
//najdenie trasy
var directionsService = new google.maps.DirectionsService();
// najdenie trasy zo zadanych hodnot v textovych poliach
function findRoute() {
	var from = document.getElementById('from').value;
	var to = document.getElementById('address').value;
	calcRoute(from, to);
}
// vseobecne vyhladanie trasy podla parametrov	
function calcRoute(from, to) {
	//directions (zobrazenie navigacnej trasy)
	directionsDisplay.setMap(map);
	var start = from;
	var end = to;
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.WALKING
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
		else if (status == google.maps.DirectionsStatus.NOT_FOUND) {
			alert("Niektorá zo zadaných adries nebola nájdená.");
		}
		else if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
			alert("Nie je možné nájsť trasu.");
		}
		else if (status == google.maps.DirectionsStatus.INVALID_REQUEST) {
			alert("Neplatná požiadavka.");
		}
		else {alert("Prihodilo sa voľačo strašnô: " + status);}
  });
}
//odstranenie trasy
function delRoute() {
	if(directionsDisplay.getMap() == map) {
		directionsDisplay.setMap(null)
	}
}
//geokodovanie polohy
function geocodePosition(position) {
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	geocoder.geocode({'latLng': latlng}, findAddress);
}
//najdenie adresy
function findAddress(results, status, callback) {
	if (status == google.maps.GeocoderStatus.OK) {
		if (results[0]) {
			found_address = results[0].address_components[1].long_name+' '+results[0].address_components[0].long_name+', '+results[0].address_components[3].long_name;
			$('#from').val(found_address);
		}
	} else {
		alert("Nepodarilo sa priradiť adresu Vašej polohe: " + status);
	}
	callback();
}
//navigacia
function navigate(position) {
	var pos = position;
	var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	geocoder.geocode({'latLng': latlng}, function(results, status) {
		var res = results;
		var stat = status;
		findAddress(res, stat, function() {
			var from = found_address;
			var to = document.getElementById('address').value;
			calcRoute(from, to);
			$("#trasa").click();
		});
	});
}
		
//lokalizacia
var marker;
var infoWindow;
var watchID;		
// jednorazove spustenie lokalizacie
function getLocation(action){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(action, displayError);
	}
	else{
		alert("Prehliadač nepodporuje geolokalizáciu!");
	}
}
// pravidelne aktualizovana lokalizacia
function getLocationUpdate(){
	if(navigator.geolocation){
		var timeoutVal = 10 * 1000 * 1000;
		watchID = navigator.geolocation.watchPosition(
			displayPosition, 
			displayError,
			{ enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0 }
		);
	}
	else{
		alert("Prehliadač nepodporuje geolokalizáciu!");
	}
}
// vypnutie pravidelnej akutalizacie
function stopWatch(){
	navigator.geolocation.clearWatch(watchID);
}
// prepinanie pravidelnej akutalizacie
function toggleLocation(checkboxID){
	if (checkboxID.checked) {
		getLocationUpdate();
	}else {
		stopWatch();
		marker.setMap(null);
		watchID = null;
	}
}
// zobrazenie polohy
function displayPosition(position) {
	var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	// Remove the current marker, if there is one
	if (typeof(marker) != "undefined") marker.setMap(null);
	var animation;
	if (watchID) { 
		animation = google.maps.Animation.BOUNCE;
	}
	else {
		animation = google.maps.Animation.DROP;
	}
	marker = new google.maps.Marker({
		position: pos,
		map: map,
		title: "Vaša poloha",
		animation: animation,
		// draggable:true
	});
	map.panTo(marker.getPosition());
	if (position.coords.speed = "null") {
		var contentString = "<b>Vaše súradnice:</b><br/>Lat: " + position.coords.latitude + "<br/>Long: " + position.coords.longitude;
	}
	else {
		var contentString = "<b>Vaše súradnice:</b><br/>Lat: " + position.coords.latitude + "<br/>Long: " + position.coords.longitude + "<br/><b>Rýchlosť: </b>" + position.coords.speed + " m/s";
	}
	// Remove the current infoWindow, if there is one
	if (typeof(infoWindow) != "undefined") infoWindow.setMap(null);
	infowindow = new google.maps.InfoWindow({
		content: contentString
	});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(map,marker);
	});
}
// chybova hlaska
function displayError(error) {
	var errors = { 
		1: 'Prístup zamietnutý',
		2: 'Vaša poloha nie je k dispozícií',
		3: 'Request timeout'
	};
	alert("Prihodilo sa voľačo strašnô: " + errors[error.code]);
}

// effects
$(document).ready(function(){
// displaying legend on/off
    $("#legend_button").click(function(e){
        $("#legend").show('fadeIn');
		$("#legend_button").hide('fadeOut');
    });
    $("#button_hide").click(function(e){
        $("#legend").hide('fadeOut');
		$("#legend_button").show('fadeIn');
    });
// toggle info sliding
    $("#info_show").click(function(){
        $("#info").slideToggle();
    });
// toggle vyhladavanie sliding
    $("#hladat").click(function(){
		if ($('#trasa').is(':checked')) {
			// $("#vyhladavanie").slideToggle();
			$("#path").slideToggle();
			$("#a").toggle('slide');
			$("#b").toggle('slide');
			$("#search").toggle();
			$("#navigate").toggle('fade');
			$("#pedestrian").toggle();
			//$("#geocode").toggle();
			$("#delete").hide('fadeOut');
			$("#trasa").attr('checked', false);
		}
		else {
			$("#search, #navigate, #address").show();
			$("#a, #b, #path, #pedestrian, #delete, #geocode").hide();
			$("#vyhladavanie").slideToggle();
		}
		// $("label[for=trasa]").toggle('slide');
		// $(this).toggleClass("rounded_left");
		// $(this).toggleClass("rounded");
    });
// toggle trasa sliding
    $("#trasa").click(function(){
		if ($('#hladat').is(':checked')) {
			$("#path").slideToggle();
			$("#a").toggle('slide');
			$("#b").toggle('slide');
			$("#search").toggle();
			$("#navigate").toggle('fade');
			$("#pedestrian").toggle();
			$("#geocode").show();
			$("#hladat").attr('checked', false);
		}
		else {
			$("#search, #navigate").hide();
			$("#a, #b, #path, #address, #pedestrian, #geocode").show();
			$("#vyhladavanie").slideToggle();
		}
    });
// toggle 'Vymaz'
	$("#pedestrian, #navigate").click(function(){
		$("#delete").show('fadeIn');
	});
	$("#delete").click(function(){
		$("#delete").hide('fadeOut');
	});
// trigger button on hitting enter
	$("#address").keyup(function(event){
		if(event.keyCode == 13){
			$("#search").click();
		}
	});
	$("#from").keyup(function(event){
		if(event.keyCode == 13){
			$("#pedestrian").click();
		}
	});
});
