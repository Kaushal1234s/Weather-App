
// [ ] ke andar custom class wale likhe h

const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");

const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchform]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const grantAccessButton=document.querySelector("[data-grantAccess]");
const searchInput=document.querySelector("[data-searchInput]");



let oldTab=userTab;     //current tab usertab ko maan liya
const API_KEY="34a9b504350d4c8d404d43fdda178042";
// ye api key mujhe weather api ki site pe mili h
oldTab.classList.add("current-tab");
getfromsession();


// ye neeche wala function ye kaam kar raha h ki jab jis tag pe click kiya h woh current tab nahi h toh current tab ke andar ki properties ko remove kar dena and current tab clicked tab ko bana ke usme woh properties daal dena
 function switchTab(newTab){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTab;
        oldTab.classList.add("current-tab");

        // according to neeche wali if condition agar mera searchform is invisible tha toh usko visible mark kar diya
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // matlab mein pehle search tab pe tha ab mujhe your weather visible karna h 
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // now after removing search form i am in weather tab so weather bhi display karna padega , so let's check local storage first for local coordinates if we have saved them there

            getfromsession();     //function call
        }
    }
 }


// event listner lagayenge jiss se tab switching ho sake usertab , searchtab mein
userTab.addEventListener("click",() =>{
    // we have passed clicked tab as input parameter
    switchTab(userTab);
});

// humne ek switch tab banaya h jo ki switching ka kaam karega between search and user tab
searchTab.addEventListener("click",() =>{
    // we have passed clicked tab as input parameter
    switchTab(searchTab);
});



function getfromsession(){              //this function checks that coordinates are already present in session storage or not   

    const localCoordinates=sessionStorage.getItem("user-coordinates");                  //matlab kya sesssion storage mein get item se humne check kiya ki koi user coordinates ki item h ya nahi
    // data in "localStorage" doesn't expire, data in "sessionStorage" is cleared when the page session ends.
    if(!localCoordinates){
        // agar local coordinates nahi mile toh
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);        // json.parse is used to convert json string to json object ( ye kya hote h google kar le)
        fetchUserWeatherInfo(coordinates);    //function call
    }

}



async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;             //matlab latittude , longitude nikale coordinates se

    // make grantaccaesscontainer invisible
    grantAccessContainer.classList.remove("active");

    // make loading screen visible
    loadingScreen.classList.add("active");

    // API call
    try{
const response=await fetch(

    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`

);
const data=await response.json();        //response is converted to json

// ab hamari API call ho chuki h or data aa chuka h toh loading hat jayegi
   loadingScreen.classList.remove("active");
   userInfoContainer.classList.add("active");
   renderWeatherInfo(data);                  //function call
    }
    catch(err){
    loadingScreen.classList.remove("active");


    }
}


function renderWeatherInfo(weatherInfo){

    // first we have to fetch the elements

    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness ]");


// fetch values from weatherInfo object and put it in UI elements

// IMPORTANT STEP -> FETCH WALI API KO COPY KARNA USME API KEY MEIN JO LINE 16 KI API KEY H WOH DAAL DE AND ANY LAT AND LON VALUE (LON > LAT ) , { } BHI HATANA FIR USKO GOOGLE OE SEARCH KARNA THEN JO AAYEGA USKO JSON FORMATTER MEIN JAAKE FORMAT KARKE DEKH LENA , THEN ONLY YOU CAN UNDERSTAND THE BELOW FEW LINES OF CDODE

cityName.innerText=weatherInfo?.name;         //matlab weatherInfo mein se city ka naam nikala 
countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;                  //matlab mein weatherInfo se sys mein gaya fir sys se country mein gaya
desc.innerText=weatherInfo?.weather?.[0]?.description;
weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
temp.innerText=`${Math.round(weatherInfo?.main?.temp-273)} °C`;                              //by default ye faranahite mein dikha raha tha isliye celcius mein convert kiya h or roundoff kiya h
windspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
humidity.innerText=`${weatherInfo?.main?.humidity} %`;
cloudiness.innerText=`${weatherInfo?.clouds?.all} %`;            // the dollar sign ($) is often used as a shorthand for the jQuery

}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // alert likhna ki no gelocation available
    }
}


function showPosition(position){

    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAccessButton.addEventListener("click",getLocation);


searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;

    if(cityName==="")                      //agaar kuch bina dale search ho raha h toh return
    return ;
    else{
        fetchSearchWeatherInfo(cityName);                   //verna function call for that city name
    }
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=await fetch(

            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`         //doubt h chale na chale ye id

        );
        const data=await response.json();
       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);

    }
    catch(err){


    }
}
