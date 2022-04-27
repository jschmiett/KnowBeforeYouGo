var aqiApiKey = 'f0e219ddc1e9e02d7eb8f05a9898db976526d09a';
var aqiApiUrl = 'https://api.waqi.info/feed';

var countryApiUrl = 'https://countriesnow.space/api/v0.1/countries/population/cities';

var currencyApiUrl = 'https://countriesnow.space/api/v0.1/countries/currency';

var currencyExchangeApiUrl = 'https://api.api-ninjas.com/v1/convertcurrency';
var currencyExchangeApiKey = 'zoACBAtFNJtKJAL8Nl7DlA==nqcwIFNykYOqSb4K';

var flightBaseUrl = 'https://test.api.amadeus.com/v2/shopping/flight-offers';
var flightApiAccessToken = 'K4PlszNFYpe2x0RPmcWRmzdRgF9V';

var flightAccessTokenRenewalUrl = 'https://test.api.amadeus.com/v1/security/oauth2/token';

var flightApiClientId = 'dQkp0EighixL15ZTeBzqq4k6pPuVuARd';
var flightApiClientSecret = '6tgvlbk4vllVwOrT';

var localCurrency = 'USD';
var localAirportCode = 'AUS';


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
    console.log(city);
    getCountry(city)
    .then(country=>{console.log(country); return getCurrency(country)})
    .then(cur => {console.log(cur); return getExchangeRate(localCurrency, cur)})
    .then(onSuccess)
    .catch(onFailure);  
}

function getPlanePrices(data, onSuccess, onFailure){
    var dest = 'BKK';
    var date = '2022-11-01';
    var url = `${flightBaseUrl}?originLocationCode=${localAirportCode}&destinationLocationCode=${dest}&departureDate=${date}&adults=1&currencyCode=USD`;
    fetch(url,{
        headers:{
            'Authorization': `Bearer ${flightApiAccessToken}`
        }
    })
    .then(response => {return response.json();})
    .then(json => {onSuccess(json.data);});
}

getAQI(city, aqi => {
        aqiElement.textContent = `AQI in ${city} is ${aqi}`;
    },
    ()=>{console.log('fetch call failed!')});

getCurrencyExchangeRate(city, json=>{
        exchangeElement.textContent = `${json.old_amount} ${json.old_currency} = ${json.new_amount} ${json.new_currency}`;
    }, 
    ()=>{console.log('fetch call failed!')});

getPlanePrices({}, json => {
    console.log(json);
    newJson = json.map(item => {return {
        "price":item.price.total,
        "seatsLeft": item.numberOfBookableSeats,
        "duration": formatTime(item.itineraries[0].duration),
        "connections": item.itineraries[0].segments.length
    }});
    console.log(newJson);
});

function formatTime(time){
    return time.replace('PT', '').replace('H', 'H ').trim();
}

function renewAccessToken(){
    var requestHeaders = new Headers();
    requestHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    
    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");
    urlencoded.append("client_id", "dQkp0EighixL15ZTeBzqq4k6pPuVuARd");
    urlencoded.append("client_secret", "6tgvlbk4vllVwOrT");
    
    var requestOptions = {
      method: 'POST',
      headers: requestHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch(flightAccessTokenRenewalUrl,requestOptions)
    .then(response=>{return response.json();})
    .then(json => {console.log(json)});
}

renewAccessToken();

