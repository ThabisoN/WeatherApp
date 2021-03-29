/**
 *   Weather Widget
 *   Author: Thabiso Ntoi, 8 July 2019
 *----------------------------------------------------------------------------------------------------------------------------------*/
"use strict";
const APPID = "4455126546bac1679be454c3be52c990"

// Variables
var temp;
var loc;
var icon;
var humidity;
var wind;
var direction;

window.onload = function () {

    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");

    /**
     * Search 
     */
    var srchbtn = document.getElementById("search-btn");
    var srchInput = document.getElementById("search-txt");

    srchbtn.addEventListener("click", weatherInfo);
    srchInput.addEventListener("keyup", entername);

    function entername(event) {
        if (event.key === "Enter") {
            weatherInfo();
        }
    }

    function weatherInfo() {
        if (srchInput.value === "") {

        } else {
            var srchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + srchInput.value + "&appid=" + APPID;
            sendHttpRequest(srchLink, LoadData);
        }
    }

    /**
     *   Automatically Update the current location
     **/
    if (navigator.geolocation) {
        var showcurrentlocaction = function (position) {
            updateByGeo(position.coords.latitude, position.coords.longitude);
        }
        navigator.geolocation.getCurrentPosition(showcurrentlocaction);
    } else {
        var showdata = window.prompt("Cannot discover the location");
        updateData(showdata);
    }
}
/**
 *   Load data into the widget
 **/
function LoadData(weather) {
    icon.src = "img/icons/" + weather.code + ".png";
    humidity.innerHTML = weather.humidity;
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    loc.innerHTML = weather.location;
    temp.innerHTML = weather.temp;
}
/**
 *   Get location from api
 **/
function updateByGeo(lat, lon) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
        "lat=" + lat +
        "&lon=" + lon +
        "&APPID=" + APPID;
    sendHttpRequest(url);
}

/**
 *   Get weather data from api
 **/
function updateData(showdata) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
        "showdata=" + showdata +
        "&APPID=" + APPID;
    sendHttpRequest(url);
}

function sendHttpRequest(url) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var data = JSON.parse(httpRequest.responseText);
            var weather = {};
            weather.code = data.weather[0].id;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.direction = windDegrees(data.wind.deg)
            weather.location = data.name;
            weather.temp = K2F(data.main.temp);
            LoadData(weather);
        }
    };

    httpRequest.open("GET", url, true);
    httpRequest.send();
}
     /**
     *  Get Wind Degrees and Directions
     */
function windDegrees(degrees) {
    var range = 360 / 16;
    var low = 360 - range / 2;
    var high = (low + range) % 360;
    var angles = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    for (var i in angles) {
        if (degrees >= low && degrees < high) {
            console.log(angles[i]);
            return angles[i];
            console.log("derp")
        }
        low = (low + range) % 360;
        high = (high + range) % 360;
    }
    return "N";
}

function K2F(k) {
    return Math.round(k * (9 / 5) - 459.67)
}

function K2C(k) {
    return Math.round(k - 273.15)
}