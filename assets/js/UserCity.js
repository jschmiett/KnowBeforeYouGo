console.log("hello world");
// inputCity
var userCity = document.querySelector("#cityInput");
console.log(userCity);
var queryButton = document.getElementById("searchButton");
console.log(queryButton);
var airQualityAPIResults = document.getElementById("airQualityResults");
console.log(airQualityAPIResults);
var localCurrencyAPIResults = document.getElementById("localCurrency");
var exchangeRateAPIResults = document.getElementById("exchangeRate");
var airfareAPIResults = document.getElementById("airfareRestults");




//Input interface for air quality API here
 function airQualityAPI() {
    getAQI(userCity.value,aqi=>{
        console.log(aqi)
        airQualityAPIResults.innerText = "The air quality in " + userCity.value + " is " + aqi + " today.";
    });
}

//Input interface for Currency and Exchange Rate here
function financialInfo() {
    getCurrencyExchangeRate(userCity.value, json=>{
        localCurrencyAPIResults.innerText = "The local currency is the " + json.new_currency + ".";
        exchangeRateAPIResults.innerText = "The exchange rate is " + json.new_amount + ".";
    },
    ()=>{console.log('fetch call failed!')});   
}

queryButton.addEventListener("click",airQualityAPI)
queryButton.addEventListener("click",financialInfo)





