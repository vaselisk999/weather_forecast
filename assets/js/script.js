var appid = "455d0818b84baef5c1f8652ca6a4a0ad";

function weatherQuery(cityName, countryCode) {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName + "," + countryCode + "&appid=" + appid;

    return $.ajax({
        url: queryURL,
        method: "GET"
    })
}

function getLocalCountryCode() {
    var queryURL = "https://ipinfo.io";
    return $.ajax({
        url: queryURL, 
        method: "GET",
        dataType :"jsonp"
    })
}

function saveCity() {

}

function createCountrySelect() {
    for (let index = 0; index < countryCode.length; index++) {
        const element = countryCode[index];
        $("#countryCodeSelect").append($("<option />").val(element.code).text(element.name))
    }
}

$(function () {

    // option
    createCountrySelect();

    getLocalCountryCode().then(function (response) {
        $('select option[value=' + response.country + ']').attr("selected",true);
    })


});

function createButton(){
    
}

// $("form-select")

// console.log(countryCode)

//click event on button
$("#search-button").on("click", function (event) {
    event.preventDefault();
    var cityName = $("#search-input").val();
    var countryCode = $("#countryCodeSelect").val();
    console.log(countryCode);
    console.log(cityName);
    // var person = $(this).attr("data-person");

    // console.log()
    // var countryCode = "EN-en";
    // var countryCode = "GB";
    // var cityName = "Manchester";

    //url plus params


    weatherQuery(cityName, countryCode).then(function (response) {
        console.log(response);
    }).fail(function(error){
        console.log(error)
    })

    $(".list-group").append("<button>sdfasd</button>")
});