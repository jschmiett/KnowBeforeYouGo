var aqiApiKey = 'f0e219ddc1e9e02d7eb8f05a9898db976526d09a';
var aqiApiUrl = 'https://api.waqi.info/feed';

var countryApiUrl = 'https://countriesnow.space/api/v0.1/countries/population/cities';

var currencyApiUrl = 'https://countriesnow.space/api/v0.1/countries/currency';

var currencyExchangeApiUrl = 'https://api.api-ninjas.com/v1/convertcurrency';
var currencyExchangeApiKey = 'zoACBAtFNJtKJAL8Nl7DlA==nqcwIFNykYOqSb4K';

var flightBaseUrl = 'https://api.flightapi.io/roundtrip';
var flightApiKey = '6269e43d1e2d38302b44a480';

var airportBaseUrl = 'https://www.air-port-codes.com/api/v1/multi';
var airportApiKey = '238d287918';
var airportApiSecretKey = 'dfe70229bf280a4';

var localCurrency = 'USD';
var localAirportCode = 'AUS';


var accessTokenTimestampKey = 'accessTokenTimeout'
var accessTokenKey = 'accessTokenKey'


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
        if (response.status == 200)
            return response.json();
        else
            return {"data":{"country":""}};
    })
    .then(json => {
        console.log('countryjson:', json);
        return json.data.country;
    });
}

function getCurrency(country){
    if (country === "")
        return new Promise((res, rej) => {res("");});
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
    console.log('foregn currency:', foreignCurrency);
    return fetch(`${currencyExchangeApiUrl}?have=${localCurrency}&want=${foreignCurrency}&amount=1`, {
        headers: {
            'X-Api-Key': currencyExchangeApiKey,
        }
    })
    .then(function(response){
        return response.json();
    });
}

function getPlanePricesHelper(from, to, departureDate, returnDate){
    console.log('from:', from, 'to:', to,'depart:',departureDate, 'arrive:',returnDate);
    var url = `${flightBaseUrl}/${flightApiKey}/${from}/${to}/${departureDate}/${returnDate}/1/0/1/Economy/USD`;
    console.log(url);
    return fetch(url)
    .then(response => {console.log('response:',response);return response.json();});
}

function getAirportCode(city){
    console.log('getting airport code of ', city)
    var url = `${airportBaseUrl}?term=${city}&limit=1&type=a`;
    var headers = {
        'APC-Auth':'238d287918',
        'APC-Auth-Secret':'dfe70229bf280a4'
    };
    return fetch(url, {
        'headers':headers,
        'method':'POST'
    })
    .then(response => {return response.json()})
    .then(json => {
        if (json.statusCode == 200){
            console.log('<airport>', json, '</airport>');return json.airports[0].iata;
        }
        else
            return "";
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

function getPlanePrices(city){
    console.log('get plane prices');
    return getAirportCode(city)
    .then(airportCode => {
        console.log('got airport code=',airportCode);
        if (airportCode == "")
            return new Promise((res, rej) => {res({});});
        else
            return getPlanePricesHelper(localAirportCode,airportCode,moment().add(3, 'month').format('YYYY-MM-DD'), moment().add(3, 'month').add(1,'week').format('YYYY-MM-DD'));
    })
    .then(json => {
        console.log('json:',json, json.length);
        if (!('fares' in json))
            return [];
        var fares = {};
        var jf = json.fares;
        for (f of jf)
            if (!(f.tripId in fares) || fares[f.tripId]["price"] > f.price.totalAmount)
                fares[f.tripId] = {"price":f.price.totalAmount,"seats":f.remainingSeatsCount};
        console.log('fares:', fares);
        var options = Object.values(fares);
        options.sort((x,y) => {
            if (x.price === y.price)
                return y.seats - x.seats;
            return x.price - y.price;
        });
        // ToDo: add flight duration and stops for each leg
        console.log('opions:', options);
        return options;
    })
    .catch('plane crashed');
}
