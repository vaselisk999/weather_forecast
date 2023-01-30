// weather API Key
var appid = "455d0818b84baef5c1f8652ca6a4a0ad";

// weather API request
function weatherCoordsQuery(lat, lon) {
    try {
        // API path
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat + "&lon=" + lon + "&appid=" + appid;
        //ajax get request
        return $.ajax({
            url: queryURL,
            method: "GET"
        })
    } catch (error) {
        console.log(error)
    }

}
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

    renderWeather(0);
    renderButtons();
});



// for date uses dt_txt (not timestamp dt)
// creates forecast selection
function forecastWeather(daysForecast) {
    var forecastEl = $("<div></div>");
    forecastEl.addClass('card');
    forecastEl.attr('style', "min-width: 11rem");

    var imgEl = $("<img alt='weather-icon' />");
    imgEl.attr("style", "width: 70px");
    var dateEl = $("<p></p>");
    dateEl.addClass('title-card');
    var tempEl = $("<p></p>");
    var windEl = $("<p></p>");
    var humidityEl = $("<p></p>");

    // gets forecast at noon
    daysForecast.forEach(element => {
        if (moment(element.dt_txt, "YYYY-MM-DD HH:mm.ss").format("HH:mm.ss") === "12:00.00") {
            var iconurl = "http://openweathermap.org/img/w/" + element.weather[0].icon + ".png";
            imgEl.attr('src', iconurl);
            dateEl.text(moment(element.dt_txt, "YYYY-MM-DD HH:mm.ss").format("DD/MM/YYYY"));
            tempEl.text("Temp: " + element.main.temp + " °C");
            windEl.text("Wind: " + element.wind.speed + "KPH");
            humidityEl.text("Humidity: " + element.main.humidity + "%");
        }
    });

    forecastEl.append(dateEl);
    forecastEl.append(imgEl);
    forecastEl.append(tempEl);
    forecastEl.append(windEl);
    forecastEl.append(humidityEl);
    $("#forecast").append(forecastEl);

}

// renders buttons
function renderButtons() {
    try {
        var data = localStorage.getItem("data");
        if (data) {
            var buttonsArr = JSON.parse(data);
            buttonsArr.forEach((value, index) => {
                createCityButton(value.name, value.code);
            })

        }
    } catch (error) {
        console.log(error);
    }
}

// for date uses dt_txt (not timestamp dt)
// creates today selection

function currentDayWeather(currentDay, name) {
    var titleEl = $("<h2></h2>");
    var iconurl = "http://openweathermap.org/img/w/" + currentDay.weather[0].icon + ".png";
    var imgEl = $("<img alt='weather-icon' />");
    imgEl.attr('src', iconurl);
    titleEl.text(name + "(" + moment(currentDay.dt_txt, "YYYY-MM-DD HH:mm.ss").format("DD/MM/YYYY") + ")");
    var tempEl = $("<p> Temp: " + currentDay.main.temp + " °C </p>");
    var windEl = $("<p> Wind: " + currentDay.wind.speed + "KPH </p>");
    var humidityEl = $("<p> Humidity: " + currentDay.main.humidity + "% </p>");
    $("#today").append(titleEl);
    $("#today").append(imgEl);
    $("#today").append(tempEl);
    $("#today").append(windEl);
    $("#today").append(humidityEl);

}

//rendre the weather block
function renderWeather(index) {
    try {
        var data = localStorage.getItem("data") ? localStorage.getItem("data") : data;
        if (data) {
            var fiveWeather = JSON.parse(data);
            $("#today").empty();
            $("#forecast").empty();

            for (const key in fiveWeather[index].list) {
                if (Object.hasOwnProperty.call(fiveWeather[0].list, key)) {
                    const element = fiveWeather[index].list[key];
                    if (key === moment().format("YYYY-MM-DD")) {
                        console.log(element)
                        // displaies today
                        currentDayWeather(element[0], fiveWeather[index].name);
                    } else {
                        // displaies forecast
                        forecastWeather(element);
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

}

//history buttons
$("#history").on("click", "button", function (event) {
    event.preventDefault();
    var data = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : [];
    data.forEach((value, index) => {
        if (value.name === $(this).attr("data-city")) {
            renderWeather(index);
        }
    })
})


//search button event click
$("#search-button").on("click", function (event) {
    event.preventDefault();
    try {
        var cityName = $("#search-input").val();
        // var cityName = "London";
        var countryCode = $("#countryCodeSelect").val();
        if (cityName === "") return;

        var data = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : [];

        // get weather response
        weatherQuery(cityName, countryCode).then(function (response) {

            // splite  weather responce by date into separate arrays
            var splitedCities = response.list.reduce((group, value) => {
                group[moment(value.dt_txt, "YYYY-MM-DD HH:mm.ss").format("YYYY-MM-DD")] = group[moment(value.dt_txt, "YYYY-MM-DD").format("YYYY-MM-DD")] ?? [];
                group[moment(value.dt_txt, "YYYY-MM-DD HH:mm.ss").format("YYYY-MM-DD")].push(value)
                return group
            }, {});

            weatherCoordsQuery(response.city.coord.lat, response.city.coord.lon).then((res) => {
                splitedCities[moment().format("YYYY-MM-DD")] = [{
                    dt_txt: moment().format("YYYY-MM-DD HH:mm.ss"),
                    main: {
                        humidity: res.main.humidity,
                        temp: res.main.temp,
                    },
                    wind: {
                        speed: res.wind.speed
                    },
                    weather: [{
                        icon: "03n",
                        main: "Clouds"
                    }]
                }]

                //creates cities object with name and splited cities
                data.unshift({
                    name: response.city.name,
                    code: countryCode,
                    list: splitedCities,
                    coord: response.city.coord
                });

                //adds to local storage
                localStorage.setItem("data", JSON.stringify(data));

                // creates button
                createCityButton(cityName, countryCode);
                renderWeather(0);

                $("#search-input").val("");
            })

        }).fail(function (error) {
            alert(error.responseJSON.message);
            $("#search-input").val("");
        })
    } catch (error) {
        console.log(error);
    }

});