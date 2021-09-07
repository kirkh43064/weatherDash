let myApiKey = "9a94c8c67f075fb39aa42064a387c33f";
let apiUrl= "https://api.openweathermap.org/";
let city = "";
let date = "";
let tempF = "";
let humidity = "";
let wind = "";
let UVIndex = "";
let latitude = "";
let longitude = "";
let minTempK = "";
let maxTempK = "";
let minTempF = "";
let maxTempF = "";
let dayhumidity = "";
let weatherIconCode = "";
let weatherIconUrl = "";
let iconCode = "";
let iconUrl = "";
let country = "";

let searchedCities = [];


let getSeachedCities = JSON.parse(localStorage.getItem("searchedCities"));

if (getSeachedCities !== null) {
    getSeachedCities.forEach(function(city) {city.toUpperCase();});
    searchedCities = getSeachedCities;  
}

$(document).ready(function(){
  displayCities(searchedCities);
  if (getSeachedCities !== null) {
    let lastCity = searchedCities[0];
    searchCity(lastCity);
  }
});

function displayCurrentWeather() {
    let cardDiv = $("<div class='container border bg-light'>");
    let weatherImage = $("<img>").attr('src', weatherIconUrl);
    let cardHeader = $("<h4>").text(city + " " + currentDate.toString());
    cardHeader.append(weatherImage);
    let temperatureEl = $("<p>").text("Temperature: " + tempF+ " ºF");
    let humidityEl = $("<p>").text("Humidity: " + humidityValue + "%");
    let windEl = $("<p>").text("Wind Speed: " + wind + " MPH");
    let UVIndexEl = $("<p>").text("UV Index: ");
    
    let UVIndexEl = $("<span>").text(UVIndex).css("background-color", getColorCodeForUVIndex(UVIndex)); 
    UVIndexEl.append(UVIndexEl);
    cardDiv.append(cardHeader);
    cardDiv.append(temperatureEl);
    cardDiv.append(humidityEl);
    cardDiv.append(windEl);
    cardDiv.append(UVIndexEl);
    $("#currentConditions").append(cardDiv);
}

function displayDayForeCast() { 
    var imgEl = $("<img>").attr("src", iconurl);  
    var cardEl = $("<div class='card'>").addClass("pl-1 bg-primary text-light");
    var cardBlockDiv = $("<div>").attr("class", "card-block");
    var cardTitleDiv = $("<div>").attr("class", "card-block");
    var cardTitleHeader = $("<h6>").text(dateValue).addClass("pt-2");
    var cardTextDiv = $("<div>").attr("class", "card-text");
    var minTempEl = $("<p>").text("Min Temp: " + minTempF + " ºF").css("font-size", "0.5em");
    var maxTempEl = $("<p>").text("Max Temp: " + maxTempF + " ºF").css("font-size", "0.5em");
    var humidityEl = $("<p>").text("Humidity: " + dayhumidity + "%").css("font-size", "0.5em");
  
    cardTextDiv.append(imgEl);
    cardTextDiv.append(minTempEl);
    cardTextDiv.append(maxTempEl);
    cardTextDiv.append(humidityEl);
    cardTitleDiv.append(cardTitleHeader);
    cardBlockDiv.append(cardTitleDiv);
    cardBlockDiv.append(cardTextDiv);
    cardEl.append(cardBlockDiv);
    $(".card-deck").append(cardEl);
}

function displayCities(citiesList) {
    $("#searchedCities").removeClass("hide");
    let count = 0;
    citiesList.length > 5 ? count = 5 : count = citiesList.length
    for (let i=0; i < count; i++) {
      $("#citiesList").css("list-style-type", "none");
      $("#citiesList").append(`<a href="#" class="list-group-item" style="text-decoration: none; color: black;">
      <li>${citiesList[i]}</li>
      </a>`);
    }
}

function getColorCodeForUVIndex(uvIndex) {
    let UVIndex = parseFloat(uvIndex);
    let colorcode = "";
    if (UVIndex <= 2) {
      colorcode = "#00ff00";
    }
    else if ((UVIndex > 2) && (UVIndex <= 5)) {
      colorcode = "#ffff00";
    }
    else if ((UVIndex > 5) && (UVIndex <= 7)) {
      colorcode = "#ffa500";
    }
    else if ((UVIndex > 7) && (UVIndex <= 10)) {
      colorcode = "#9e1a1a";
    }
    else if (UVIndex > 10) {
      colorcode = "#7f00ff";
    }
    return colorcode;
}

function searchCity(cityName){
    // constuct URL for city search
    console.log(cityName);
    let queryURL = apiUrl + "data/2.5/weather?q=" + cityName + "&appid=" + myApiKey;
  
    fetch(queryURL);
   
    // create object response for the data
    .then(function(response) {
        .then(function(response) { return response.json() }) 
        .then(function(data) {

        console.log(data);
        })
        city = result.name.trim();
        //  
        //

        currentDate = moment.unix(result.dt).format("l");
        console.log(currentDate);
        let tempK = result.main.temp;

        // Converts the temp from Kalvin
        tempF = ((tempK - 273.15) * 1.80 + 32).toFixed(1);

        humidity = result.main.humidity;
        wind = result.wind.speed;
        weatherIconCode = result.weather[0].icon;
        weatherIconUrl = apiUrl + "img/w/" + weatherIconCode + ".png";
        let latitude = result.coord.lat;
        let longitude = result.coord.lon;
        let UVIndexQueryUrl = apiUrl + "data/2.5/uvi?&appid=" + myApiKey + "&lat=" + latitude + "&lon=" + longitude;

        fetch(UVIndexQueryUrl);
            
        })

        .then(function(response) {
            UVIndex = response.value;
            displayCurrentWeather()
         
            let futureDayQueryUrl = apiUrl + "data/2.5/forecast/daily?q=" + city + "&appid=" + myApiKey + "&cnt=5";

            fetch(futureDayQueryUrl)

            .then(function(response) {
                let futureDayForecast = response.list;

                addCardDeckHeader();

                for (let i=0; i < future; i++) {
                iconcode = futureDayForecast[i].weather[0].icon;

                iconurl = apiUrl + "img/w/" + iconcode + ".png";
           //  dateValue = moment().tz(country + "/" + city).add(i, 'days').format('l');

                dateValue = moment.unix(futureDayForecast[i].dt).format('l');
                minTempK = futureDayForecast[i].temp.min;
                minTempF =  ((minTempK - 273.15) * 1.80 + 32).toFixed(1);
                maxTempK = futureDayForecast[i].temp.max;
                maxTempF =  (((futureDayForecast[i].temp.max) - 273.15) * 1.80 + 32).toFixed(1);
                dayhumidity = futureDayForecast[i].humidity;
                displayDayForeCast()
                }

            });

        });

    });

}

function clearWeatherInfo() {
    $("#currentConditions").empty();
    $("#cardHeader").remove();
    $(".card-deck").empty();
}

function resetVariables() {
    city = "";
    currentDate = "";
    tempF = "";
    humidityValue = "";
    windSpeed = "";
    uvIndexValue = "";
    latitude = "";
    longitude = "";
    minTempK = "";
    maxTempK = "";
    minTempF = "";
    maxTempF = "";
    dayhumidity = "";
    currentWeatherIconCode = "";
    currentWeatherIconUrl = "";
    iconcode = "";
    iconurl = "";
    country = "";
}


$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    clearWeatherInfo()
    resetVariables()
    let cityName = $("searchInput").val().toUpperCase().trim();
    $("#searchInput").val("");
    searchCity(cityName);
  
    if (cityName !== ""&& searchedCities[0] !== cityName) {
      searchedCities.unshift(cityName);
      localStorage.setItem("searched-cities", JSON.stringify(searchedCities));
      if (searchedCities.length === 1) {
        $("#searchedCities").removeClass("hide");
      }
      
      console.log($("ul#citiesList a").length);
      if ($("ul#citiesList a").length >= 5) {
        ($("ul#citiesList a:eq(4)").remove());
      }
      $("#citiesList").prepend(`<a href="#" class="list-group-item" style="text-decoration: none; color: black; list-style-type: none">
      <li>${cityName}</li>
      </a>`);
    }
    console.log(cityName);
});
  
  $(document).on("click", ".list-group-item", function() {
    var cityName = $(this).text();
    clearWeatherInfo();
    resetVariables();
    searchCity(cityName);
  });
  
  

