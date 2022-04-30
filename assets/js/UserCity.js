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
var cityTitle = document.getElementById("userInputCity");

var priceElements = [1,2,3,4,5].map(i => document.getElementById(`price${i}`));
var seatsElements = [1,2,3,4,5].map(i => document.getElementById(`seats${i}`));

//Dummy Array Here
let planeResults = [
    {
        price: 100,
        seats: 1,
        duration: "1 hr",
        connections: 1
    },
    {
        price: 200,
        seats: 2,
        duration: "2 hr",
        connections: 2
    },
    {
        price: 300,
        seats: 3,
        duration: "3 hr",
        connections: 3
    },
    {
        price: 400,
        seats: 4,
        duration: "4 hr",
        connections: 4
    },
    {
        price: 500,
        seats: 5,
        duration: "5 hr",
        connections: 5
    }
]

userCity.addEventListener('keyup',(e)=>{
    e.preventDefault();
     if(e.keyCode === 13){
         queryButton.click(); // triggering click if `keycode === 13`
         console.log("query button clicked")
    }
  })


//Input interface for air quality API here
 function airQualityAPI() {
    getAQI(userCity.value,aqi=>{
        console.log(aqi)
        airQualityAPIResults.innerText = "Air quality in " + userCity.value + " is " + aqi + " today";
    });
}

//Input interface for Currency and Exchange Rate here
function financialInfo() {
    getCurrencyExchangeRate(userCity.value, json=>{
        localCurrencyAPIResults.innerText = "Local currency is the " + json.new_currency;
        exchangeRateAPIResults.innerText = `Exchange rate is ${json.new_amount} ${json.new_currency} for ${json.old_amount} ${json.old_currency}`;
    },
    ()=>{console.log('fetch call failed!')});   
}


//Dummy json function to call from dummy array
function getMockData() {
    const myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(planeResults);
    }, 300);
  });
  return myPromise;
}

function showPlaneFares(){
    getPlanePrices(userCity.value)
    //getMockData()
    .then(flights => {
        console.log(flights);
        let nf = Math.min(5, flights.length);
        let i = 0;
        for(; i < nf; ++i){
            priceElements[i].textContent = `$${flights[i].price}`;
            seatsElements[i].textContent = `${1+flights[i].seats} seats left at`;
        }
        for(; i < 5; ++i){
            priceElements[i].textContent = '';
            seatsElements[i].textContent = '';
        }
    });
}


queryButton.addEventListener("click", airQualityAPI);
queryButton.addEventListener("click", financialInfo);
//queryButton.addEventListener("click", addCityTitle);
queryButton.addEventListener("click", showPlaneFares);





