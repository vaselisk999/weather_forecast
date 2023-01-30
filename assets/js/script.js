// weather API Key
var appid = "455d0818b84baef5c1f8652ca6a4a0ad";

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

function saveCity() {

}
// fills selection tag with country codes
function createCountrySelect() {
    for (let index = 0; index < countryCode.length; index++) {
        const element = countryCode[index];
        $("#countryCodeSelect").append($("<option />").val(element.code).text(element.name))
    }
}

$(function () {
    // runs filling select tag with country codes
    createCountrySelect();

    getLocalCountryCode().then(function (response) {
        $('select option[value=' + response.country + ']').attr("selected", true);
    })


});

function createCityButton() {
    $(".list-group").append("<button data-city=" + cityName + " data-code=" + countryCode + " class='btn btn-primary cityButton'>" + cityName + "</button>");
}

//search button event click
$("#search-button").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#search-input").val();
    var countryCode = $("#countryCodeSelect").val();
    if (cityName === "") return;

    console.log(countryCode);
    console.log(cityName);
    // var person = $(this).attr("data-person");

    // console.log()
    // var countryCode = "EN-en";
    // var countryCode = "GB";
    // var cityName = "Manchester";

    //url plus params


    weatherQuery(cityName, countryCode).then(function (response) {

        createCityButton(cityName, countryCode);

    }).fail(function (error) {
        alert(error.responseJSON.message);
        $("#search-input").val("");
    })

});