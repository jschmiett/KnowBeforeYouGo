console.log("hello world");
// inputCity
var tableTitle = document.querySelector("#tableTitle");
var userCity = document.querySelector("#cityInput");
console.log(userCity);
var queryButton = document.getElementById("searchButton");
console.log(queryButton);
var airQualityAPIResults = document.getElementById("airQualityResults");
console.log(airQualityAPIResults);
var localCurrencyAPIResults = document.getElementById("localCurrency");
var exchangeRateAPIResults = document.getElementById("exchangeRate");
var cityTitle = document.getElementById("userInputCity");
var priceOne = document.getElementById("priceOne");
var priceTwo = document.getElementById("priceTwo");
var priceThree = document.getElementById("priceThree");
var priceFour = document.getElementById("priceFour");
var priceFive = document.getElementById("priceFive");
var seatsOne = document.getElementById("seatsOne");
var seatsTwo = document.getElementById("seatsTwo");
var seatsThree = document.getElementById("seatsThree");
var seatsFour = document.getElementById("seatsFour");
var seatsFive = document.getElementById("seatsFive");
// var durationOne = document.getElementById("durationOne");
// var durationTwo = document.getElementById("durationTwo");
// var durationThree = document.getElementById("durationThree");
// var durationFour = document.getElementById("durationFour");
// var durationFive = document.getElementById("durationFive");
// var connectionsOne = document.getElementById("connectionsOne");
// var connectionsTwo = document.getElementById("connectionsTwo");
// var connectionsThree = document.getElementById("connectionsThree");
// var connectionsFour = document.getElementById("connectionsFour");
// var connectionsFive = document.getElementById("connectionsFive");



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

function addCityTitle() {
    console.log("hello");
    tableTitle.textContent = userCity.value;
 }

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
        exchangeRateAPIResults.innerText = "Exchange rate is " + json.new_amount;
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
  myPromise.then(data=> {
    console.log(data);
    priceOne.innerText = planeResults[0].price
    priceTwo.innerText = planeResults[1].price
    priceThree.innerText = planeResults[2].price
    priceFour.innerText = planeResults[3].price
    priceFive.innerText = planeResults[4].price
    seatsOne.innerText = planeResults[0].seats
    seatsTwo.innerText = planeResults[1].seats
    seatsThree.innerText = planeResults[2].seats
    seatsFour.innerText = planeResults[3].seats
    seatsFive.innerText = planeResults[4].seats
    // durationOne.innerText = planeResults[0].duration
    // durationTwo.innerText = planeResults[1].duration
    // durationThree.innerText = planeResults[2].duration
    // durationFour.innerText = planeResults[3].duration
    // durationFive.innerText = planeResults[4].duration
    // connectionsOne.innerText = planeResults[0].connections
    // connectionsTwo.innerText = planeResults[1].connections
    // connectionsThree.innerText = planeResults[2].connections
    // connectionsFour.innerText = planeResults[3].connections
    // connectionsFive.innerText = planeResults[4].connections

  });
}
//Input Airfare API function here
// function airfairBudget() {
//     console.log("airplane prices");
//     airfareAPIResults.innerHTML = "Hello World";

// }

// userCity.addEventListener()

queryButton.addEventListener("click", airQualityAPI);
queryButton.addEventListener("click", financialInfo);
queryButton.addEventListener("click", addCityTitle);
queryButton.addEventListener("click", getMockData);





