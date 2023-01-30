// weather API Key
var appid = "455d0818b84baef5c1f8652ca6a4a0ad";

// array of cities
var cities = [];

// weather API request
function weatherQuery(cityName, countryCode) {
    try {
        // API path
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +
            cityName + "," + countryCode + "&appid=" + appid;
        //ajax get request
        return $.ajax({
            url: queryURL,
            method: "GET"
        })
    } catch (error) {
        console.log(error)
    }

}

// info API request
function getLocalCountryCode() {
    try {
        // API path
        var queryURL = "https://ipinfo.io";
        //ajax get request
        return $.ajax({
            url: queryURL,
            method: "GET",
            dataType: "jsonp"
        })
    } catch (error) {
        console.log(error)
    }

}

// fills selection tag with country codes
function createCountrySelect() {
    for (let index = 0; index < countryCode.length; index++) {
        const element = countryCode[index];
        $("#countryCodeSelect").append($("<option />").val(element.code).text(element.name))
    }
}

//create city button
function createCityButton(cityName, countryCode) {
    $(".list-group").append("<button data-city=" + cityName + " data-code=" + countryCode + " class='btn btn-primary cityButton'>" + cityName + "</button>");
}

$(function () {
    // runs filling select tag with country codes
    createCountrySelect();

    // gets default select option  
    getLocalCountryCode().then(function (response) {
        $('select option[value=' + response.country + ']').attr("selected", true);
    });

    renderWeather();


});

function removeCity() {

}


// for date uses dt_txt (not timestamp dt)
// creates today selection

function currentDayWeather(currentDay, name) {
    var titleEl = $("<h2></h2>");
    titleEl.text(name + "(" + moment(currentDay.dt_txt, "YYYY-MM-DD HH:mm.ss").format("DD/MM/YYYY") + ")");

    var tempEl = $("<p> Temp: " + currentDay.main.temp + " °C </p>");
    var windEl = $("<p> Windp: " + currentDay.wind.speed + "KPH </p>");
    var humidityEl = $("<p> Humidity: " + currentDay.main.humidity + "% </p>");
    $("#today").append(titleEl);
    $("#today").append(tempEl);
    $("#today").append(windEl);
    $("#today").append(humidityEl);
}

// for date uses dt_txt (not timestamp dt)
// creates forecast selection
function forecastWeather(daysForecast){
    var forecastEl = $("<div></div>");
    forecastEl.addClass('card');
    forecastEl.attr('style', "min-width: 11rem");
    
    daysForecast.forEach(element => {
        if(moment(element.dt_txt, "YYYY-MM-DD HH:mm.ss").format("HH:mm.ss") === "12:00.00"){
            console.log(element, "11111111");
            forecastEl.text(moment(element.dt_txt, "YYYY-MM-DD HH:mm.ss").format("DD/MM/YYYY"));
            
        }
        
    });

    
    // forecastEl.text(moment(currentDay.dt_txt, "YYYY-MM-DD HH:mm.ss").format("DD/MM/YYYY"));

    // var tempEl = $("<p> Temp: " + average.temp + " °C </p>");
    // var windEl = $("<p> Windp: " + average.wind + "KPH </p>");
    // var humidityEl = $("<p> Humidity: " + average.humidity + "% </p>");
    // $("#today").append(titleEl);
    // $("#today").append(tempEl);
    // $("#today").append(windEl);
    $("#forecast").append(forecastEl);

    
    // console.log(element);
            // date icon
            // Temp 
            // Wind
            // Humanity
}

//rendre the weather block
function renderWeather() {
    try {
        var data = localStorage.getItem("data");
        if (data) {
            var fiveWeather = JSON.parse(data);
            $("#today").empty();
            $("#forecast").empty();

            for (const key in fiveWeather[0].list) {
                if (Object.hasOwnProperty.call(fiveWeather[0].list, key)) {
                    const element = fiveWeather[0].list[key];
                    if (key === moment().format("YYYY-MM-DD")) {
                        // displaies today
                        currentDayWeather(element[0], fiveWeather[0].name);
                    } else {
                        // displaies forecast
                        forecastWeather(element);
                    }
                }
            }

        }
    } catch (error) {

    }

}


//search button event click
$("#search-button").on("click", function (event) {
    event.preventDefault();
    try {
        // var cityName = $("#search-input").val();
        var cityName = "London";
        var countryCode = $("#countryCodeSelect").val();
        if (cityName === "") return;

        // get weather response
        weatherQuery(cityName, countryCode).then(function (response) {

            // splite  weather responce by date into separate arrays
            var splitedCities = response.list.reduce((group, value) => {
                group[moment(value.dt_txt, "YYYY-MM-DD HH:mm.ss").format("YYYY-MM-DD")] = group[moment(value.dt_txt, "YYYY-MM-DD").format("YYYY-MM-DD")] ?? [];
                group[moment(value.dt_txt, "YYYY-MM-DD HH:mm.ss").format("YYYY-MM-DD")].push(value)
                return group
            }, {})

            //creates cities object with name and splited cities
            cities.push({
                name: response.city.name,
                code: countryCode,
                list: splitedCities
            });

            //adds to local storage
            localStorage.setItem("data", JSON.stringify(cities));

            // creates button
            createCityButton(cityName, countryCode);

            renderWeather(cities);

        }).fail(function (error) {
            alert(error.responseJSON.message);
            $("#search-input").val("");
        })
    } catch (error) {
        console.log(error)
    }

});