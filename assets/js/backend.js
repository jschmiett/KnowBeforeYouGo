var aqiApiKey = 'f0e219ddc1e9e02d7eb8f05a9898db976526d09a';
var aqiApiUrl = 'https://api.waqi.info/feed';

var countryApiUrl = 'https://countriesnow.space/api/v0.1/countries/population/cities';

var currencyApiUrl = 'https://countriesnow.space/api/v0.1/countries/currency';

var currencyExchangeApiUrl = 'https://api.api-ninjas.com/v1/convertcurrency';
var currencyExchangeApiKey = 'zoACBAtFNJtKJAL8Nl7DlA==nqcwIFNykYOqSb4K';

var city = 'Shanghai';
var localCurrency = 'USD';


// Helper functions
function getCountry(city){
    return fetch(countryApiUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"city":city})
    })
    .then(response => {
        return response.json();
    })
    .then(json => {
        return json.data.country;
    });
}

function getCurrency(country){
    return fetch(currencyApiUrl, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"country":country})
    })
    .then(function(response){
        return response.json();
    })
    .then(function(json){
        return json.data.currency;
    });
}

function getExchangeRate(localCurrency, foreignCurrency){
    return fetch(`${currencyExchangeApiUrl}?have=${localCurrency}&want=${foreignCurrency}&amount=1`, {
        headers: {
            'X-Api-Key': currencyExchangeApiKey,
        }
    })
    .then(function(response){
        return response.json();
    });
}



// API calls
function getAQI(city, onSuccess, onFailure){
    var url = `${aqiApiUrl}/${city}/?token=${aqiApiKey}`;
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(json => {return json.data.aqi;})
    .then(onSuccess)
    .catch(onFailure);
}

function getCurrencyExchangeRate(city, onSuccess, onFailure){
    getCountry(city)
    .then(country=>{return getCurrency(country)})
    .then(cur => {return getExchangeRate(localCurrency, cur)})
    .then(onSuccess)
    .catch(onFailure);  
}


var aqiElement = document.getElementById('aqi');
var exchangeElement = document.getElementById('exchange');

getAQI(city, aqi => {
        aqiElement.textContent = `AQI in ${city} is ${aqi}`;
    },
    ()=>{console.log('fetch call failed!')});

getCurrencyExchangeRate(city, json=>{
        exchangeElement.textContent = `${json.old_amount} ${json.old_currency} = ${json.new_amount} ${json.new_currency}`;
    }, 
    ()=>{console.log('fetch call failed!')});
