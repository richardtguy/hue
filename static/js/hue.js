/*
Really simple interface for Philips Hue lights

By Richard Guy, based on Javascript examples and tutorials from www.w3schools.com

v1.0.1, 6 March 2016
*/

// Check if Hue Bridge IP address is stored in cookie
var myHueIP = checkCookie();

// Page configuration settings - max number of lamps
var maxLamps = 9;

// Update Hue IP address
function updateHueIP() {
	// Get new IP address from input field
	myHueIP = document.getElementById('hueIP').value;
	// Save new IP in cookie
	setCookie('HueIP', myHueIP, 365);
	// Add check mark to show hue IP stored in cookie
	document.getElementById('check').classList.add("fa-check");
	// Reset page
	initialise(myHueIP);
}

/* Initialise page - start by getting details of connected lamps from Hue Bridge, then
	copying HTML for controls for each lamp.
*/
function initialise(HueIP) {
	console.log('Attempting to contact Hue Bridge on IP: ' + HueIP);
	// Start refresh icon spinning while working
	document.getElementById('refresh').classList.add("w3-spin");
	// Write blank html for each lamp block
	for (i = 1; i <= maxLamps ; i++) {
		document.getElementById(i).innerHTML = "";
	}
	// Get number of lights and their ID numbers from Hue Bridge, and write HTML for each
	var xmlhttp = new XMLHttpRequest();
	var url = "http://" + HueIP + "/api/newdeveloper/lights/";
	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    var lights = JSON.parse(xmlhttp.responseText);
		    var lightIDs = Object.keys(lights);
		    console.log('Number of lamps = '+lightIDs.length);
		    for (i=0; i<lightIDs.length; i++) {
		    	writeHTML(lightIDs[i], lights[lightIDs[i]].name, i, HueIP);
		    	getLampSettings(lightIDs[i], HueIP);
		    }
		// We've finished if we get here, so stop refresh icon spinning
    	document.getElementById('refresh').classList.remove("w3-spin");
    	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.ontimeout = function () {
		alert("Error! Unable to contact Hue Bridge");
	}
	xmlhttp.send();
}


// Write HTML for controls for each light and initialise sliders
function writeHTML(lampID, lampName, num, HueIP) {

	console.log('Writing HTML for lamp: '+ lampID);
	
	// Write html
	var html = "<header class=\"w3-container w3-blue-grey w3-padding-0 w3-xxlarge\">"+lampName+"\
						<i class=\"w3-btn w3-blue-grey w3-right\" onclick=\"reveal('detail"+lampID+"')\"><i class=\"fa fa-caret-down\" style=\"height:60px;\"></i></i>\
						<i class=\"w3-btn w3-blue-grey w3-left\" onclick=\"toggleLamp("+lampID+", myHueIP)\"><img id=\"bulb"+lampID+"\" src=\"/static/img/ajax-loader.gif\" style=\"height:60px;\"></i>\
				</header>\
		<div id=\"detail"+lampID+"\" class =\"w3-accordion-content w3-container\">\
			<table class=\"w3-padding-small\">\
				<tr>\
					<td><i class=\"fa fa-square\" style=\"font-size:48px; color:#bbFFFF;\"></i></td><td style=\"width:100%;\"><div id=\"ct-slider"+lampID+"\"></div></td><td><i class=\"fa fa-square fa-lg\" style=\"font-size:48px; color:#FFdd00;\"></i></td>\
				</tr><tr>\
					<td><i class=\"fa fa-sun-o\" style=\"font-size:36px;\"></i></td><td style=\"width:100%;\"><div id=\"bri-slider"+lampID+"\"></div></td><td><i class=\"fa fa-sun-o\" style=\"font-size:48px;\"></i></td>\
				</tr>\
			</table>\
		</div>";
	document.getElementById(num+1).innerHTML = html;
	
	//Initialise sliders - update lamp settings when user finishes adjusting sliders
	$( "#ct-slider"+lampID ).slider({
		min: 153, max: 500, stop: function(event, ui) {updateLampSettings(lampID, HueIP)}
	});
	$( "#bri-slider"+lampID ).slider({
		max: 254, stop: function(event, ui) {updateLampSettings(lampID, HueIP)}
	});
}

// Reveal detail block below header (w3css accordion)
function reveal(id) {
    document.getElementById(id).classList.toggle("w3-show");
}

// Toggle lamp on or off
function toggleLamp(lamp, HueIP) {
	console.log('Toggling lamp: ' + lamp);
	
	// Replace bulb icon with loader while working
	document.getElementById('bulb'+lamp).src = "/static/img/ajax-loader.gif";

	var xmlhttp = new XMLHttpRequest();
	var url = "http://" + HueIP + "/api/newdeveloper/lights/" + lamp;

	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    var arr = JSON.parse(xmlhttp.responseText);
    		if (arr.state.on == false) {
        		lampOn(lamp, HueIP);
    		} else {
        		lampOff(lamp, HueIP);
    		}
    	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.ontimeout = function () {
		document.getElementById('bulb'+lamp).src = "/static/img/error.png";
	}
	xmlhttp.send();
}

// Switch lamp on
function lampOn(lamp, HueIP) {
	console.log('Switching on lamp: ' + lamp);
	var xmlhttp = new XMLHttpRequest();
	var mimeType = "text/plain";  
	var url = "http://" + HueIP + "/api/newdeveloper/lights/" + lamp + "/state/";
	var command = "{\"on\": true}";
	xmlhttp.open("PUT", url, true);
	xmlhttp.setRequestHeader('Content-Type', mimeType);  
   	xmlhttp.send(command);
	// Update bulb icon to on
    document.getElementById('bulb'+lamp).src = "/static/img/pic_bulbon.gif";
	// Enable sliders
	$( "#bri-slider"+lamp ).slider( "enable" );
	$( "#ct-slider"+lamp ).slider( "enable" );

}

// Switch lamp off
function lampOff(lamp, HueIP) {
	console.log('Switching off lamp: ' + lamp);
	var HueIP = document.getElementById("hueIP").value;
	var xmlhttp = new XMLHttpRequest();
	var mimeType = "text/plain";  
	var url = "http://" + HueIP + "/api/newdeveloper/lights/" + lamp + "/state/";
	var command = "{\"on\": false}";
	xmlhttp.open("PUT", url, true);
	xmlhttp.setRequestHeader('Content-Type', mimeType);  
   	xmlhttp.send(command);
   	// Update bulb icon
   	document.getElementById('bulb'+lamp).src = "/static/img/pic_bulboff.gif"
    // Disable sliders
   	$( "#bri-slider"+lamp ).slider( "disable" );
 	$( "#ct-slider"+lamp ).slider( "disable" );

}

// Update colour temperature and brightness on lamp to value from sliders
function updateLampSettings(lamp, HueIP) {    
    var newCT = $( "#ct-slider"+lamp ).slider( "value" );
    var newBri = $( "#bri-slider"+lamp ).slider( "value" );

	var xmlhttp = new XMLHttpRequest();
	var mimeType = "text/plain";  
	var url = "http://" + HueIP + "/api/newdeveloper/lights/" + lamp + "/state/";
	var command = "{\"bri\":" + newBri + ", \"ct\": " + newCT + "}";
	xmlhttp.open("PUT", url, true);
	xmlhttp.setRequestHeader('Content-Type', mimeType);  
   	xmlhttp.send(command);
   	// Set lamp to off if brightness set to zero
   	if (newBri == 0) lampOff(lamp, HueIP);
   	
}

/* 	Get current lamp status (on/off, color temperature & brightness)
	from Hue Bridge, update sliders and on/off bulb icons 
*/
function getLampSettings(lamp, HueIP) {
	console.log('Checking settings of lamp: ' + lamp);
	document.getElementById('bulb'+lamp).src = "/static/img/ajax-loader.gif";
	var xmlhttp = new XMLHttpRequest();
	var url = "http://" + HueIP + "/api/newdeveloper/lights/" + lamp;

	xmlhttp.onreadystatechange = function() {
    	if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
		    var arr = JSON.parse(xmlhttp.responseText);
			$( "#ct-slider"+lamp ).slider( "value", arr.state.ct );
       		$( "#bri-slider"+lamp ).slider( "value", arr.state.bri );
    		if (arr.state.on == false) {
        		document.getElementById('bulb'+lamp).src = "/static/img/pic_bulboff.gif"
        		// Disable sliders
   				$( "#bri-slider"+lamp ).slider( "disable" );
 			  	$( "#ct-slider"+lamp ).slider( "disable" );
    		} else {
        		document.getElementById('bulb'+lamp).src = "/static/img/pic_bulbon.gif";
    		}
    	}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.ontimeout = function () {
		document.getElementById('bulb'+lamp).src = "/static/img/error.png";
		alert("Error! Unable to contact Hue Bridge");
	}
	xmlhttp.send();
		
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// Read IP address from cookie or prompt user for input
function checkCookie() {
    var cookie = getCookie("HueIP");
    if (cookie != "") {
    	console.log('Found IP: '+cookie);
    } else {
    	console.log('Prompting user for input');
        cookie = prompt("Please enter IP address for Hue Bridge:", "");
        if (cookie != "" && cookie != null) {
            setCookie("HueIP", cookie, 365);
        }
    }
	document.getElementById('hueIP').value = cookie;
	return cookie;
}

function removeCheck(id) {
	document.getElementById(id).classList.remove('fa-check');
}