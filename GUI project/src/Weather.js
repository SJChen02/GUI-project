async function getInfo(nlat,nlon){
    const res = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${nlat}&lon=${nlon}&appid=b3e79ab765ac55b063567e2787d48609`)
    const json = await res.json()
    console.log(json)

    const info = json.list
    let timeResult = "";
    let tempResult = "";
    for(let weatherDate=0; weatherDate<5; weatherDate++){
        let next_time = new Date(info[weatherDate].dt_txt).toLocaleString(undefined,{hour: '2-digit', minute: '2-digit'});
        if (weatherDate==0){
            timeResult+=  `<div class="Time_Item">Now</div>`
        }
        else{
            timeResult+=  `<div class="Time_Item">${next_time}</div>`
        }
        
        tempResult+= `<div class="Temperature-WeatherForecast-container"> ${Math.round(kToC(info[weatherDate].main.temp)) + "°"}</div>`
    }

    
    document.getElementById('3hourTime').innerHTML= timeResult;
    document.getElementById('hourWeatherData').innerHTML= tempResult;
    document.getElementById('weatherHourIcon1').src = `${checkTypeIconOfWeather(info[0])}`;
    document.getElementById('weatherHourIcon2').src = `${checkTypeIconOfWeather(info[1])}`;
    document.getElementById('weatherHourIcon3').src = `${checkTypeIconOfWeather(info[2])}`;
    document.getElementById('weatherHourIcon4').src = `${checkTypeIconOfWeather(info[4])}`;
    document.getElementById('weatherHourIcon5').src = `${checkTypeIconOfWeather(info[5])}`;

    let weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    let weekdayResult ="";
    let tempDiffResult ="";
    let tempMax ="";
    let tempMin ="";
    for(let day=5; day<info.length; day+=8){
        // let today = new Date().getDay();
        let week = new Date(info[day].dt_txt).getDay();


        weekdayResult+= `<div class="Weekly_Time_container"> ${weekday[week]}</div>`
        
        tempDiffResult+= `<div class="Weekly_Time_container"> ${Math.ceil(kToC(info[day].main.temp_max)) + "°"}/${Math.floor(kToC(info[day].main.temp_min)) + "°"} </div>`
    }
    
    document.getElementById('weekDay').innerHTML= weekdayResult;
    document.getElementById('differentTemp').innerHTML = tempDiffResult;
    document.getElementById('weatherWeekIcon1').src = `${checkTypeIconOfWeather(info[0])}`;
    document.getElementById('weatherWeekIcon2').src = `${checkTypeIconOfWeather(info[8])}`;
    document.getElementById('weatherWeekIcon3').src = `${checkTypeIconOfWeather(info[8*2])}`;
    document.getElementById('weatherWeekIcon4').src = `${checkTypeIconOfWeather(info[8*3])}`;
    document.getElementById('weatherWeekIcon5').src = `${checkTypeIconOfWeather(info[8*4])}`;

    document.getElementById('umbrellaTmrCheck').innerHTML= `${checkBringUmbrella(info[8])}`
}

getInfo(51.5073, -0.1276);

async function getTodayInfo(nlat,nlon){
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${nlat}&lon=${nlon}&appid=b3e79ab765ac55b063567e2787d48609`)
    const json = await res.json()
    console.log(json)

    const info = json.main
    document.getElementById('todayDateTemp').innerHTML= `${Math.round(kToC(info.temp)) + "°"}`;
    // document.getElementById('nowTemp').innerHTML= `<div class="Temperature-WeatherForecast> ${Math.round(kToC(info.temp)) + "°"}</div>`;
    document.getElementById('differentTemp').innerHTML = `<div class="Weekly_Time_container"> ${Math.ceil(kToC(info.temp_max)) + "°"}/${Math.floor(kToC(info.temp_min)) + "°"} </div>`;

    const date = new Date()
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    document.getElementById('todayDate').innerHTML= `${day}-${month}-${year}`;
    document.getElementById('weatherName').innerHTML= `${checkTypeNameOfWeather(json)}`;
    document.getElementById('weatherIcon').src = `${checkTypeIconOfWeather(json)}`;

    document.getElementById('umbrellaTdyCheck').innerHTML= `${checkBringUmbrella(json)}`;
    document.getElementById('weatherLocation').innerHTML= `${weatherLocation(json)}`;

    document.getElementById('feelLikeData').innerHTML= `${Math.ceil(kToC(info.feels_like)) + "°"}`;
    document.getElementById('humidityData').innerHTML= `${info.humidity + "%"}`;
    document.getElementById('windDirectionData').innerHTML= `${degreesToCompass(json.wind.deg)}`;
    document.getElementById('windSpeedData').innerHTML= `${Math.floor(msToMph(json.wind.speed)) + "mph"}`;
    document.getElementById('pressureData').innerHTML= `${info.pressure + "hPa"}`;
    document.getElementById('visibilityData').innerHTML= `${mToKm(json.visibility) + "km"}`;
    document.getElementById('sunriseData').innerHTML= `${unixToTime(json.sys.sunrise)}`;
    document.getElementById('sunsetData').innerHTML= `${unixToTime(json.sys.sunset)}`;
}

getTodayInfo(51.5073, -0.1276);

function kToC(k){
    return k-273.15
}

function unixToTime(num){
    let time = new Date(num*1000).toLocaleString(undefined, {hour: '2-digit', minute: '2-digit'})
    return time;
}

function degreesToCompass(deg){
    val=Math.floor((deg/22.5)+.5)
    arr=["N","NNE","NE","ENE","E","ESE","SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"]
    com=arr[(val % 16)]
    return com;
}

function msToMph(ms){
    return ms /0.44704
}

function mToKm(m){
    return m /1000
}

function checkTypeNameOfWeather(tdy){
    const typeOfWeather = tdy.weather[0].main
    if(typeOfWeather==="Clouds"){
        return "Cloudy"
    }
    else if(typeOfWeather==="Rain"){
        return "Rain"
    }
    else if(typeOfWeather==="Smoke"){
        return "Smoke"
    }
    else if(typeOfWeather==="Clear"){
        return "Sunny"
    }
}

function checkTypeIconOfWeather(tdy){
    const typeOfWeather = tdy.weather[0].main
    if(typeOfWeather==="Clouds"){
        return "img/Cloud.png";
    }
    else if(typeOfWeather==="Smoke"){
        return "img/Cloud.png";
    }
    else if(typeOfWeather==="Rain"){
        return "img/Raining.png";
    }
    else if(typeOfWeather==="Clear"){
        return "img/Sunny.png";
    }
}

function checkBringUmbrella(data){
    if(data.rain){
        return "Recommend to bring Umbrella"
    }
    else{
        return "Not recommend to bring Umbrella"
    }
}

async function getInfo2(sta){
    const res = await fetch('https://api.tfl.gov.uk/line/mode/tube/status')
    const json = await res.json()

    document.getElementById('tubeStatus').innerHTML= json[sta].lineStatuses[0].statusSeverityDescription //first 0 depend on the line name
    document.getElementById('trianName').innerHTML= `${trianLineName(json[sta])}`;
}

getInfo2(7);


async function getInfo3(loc){
    const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${loc}&limit=1&appid=b3e79ab765ac55b063567e2787d48609`)
    const json = await res.json()

    getInfo(json[0].lat, json[0].lon);
    getTodayInfo(json[0].lat, json[0].lon);
}

getInfo3(`London`);


function weatherLocation(tn){
    const locat = tn.name
    if(locat === "London"){
        return "London";
    }
    else if(locat === "Durham"){
        return "Durham";
    }
    if(locat === "Manchester"){
        return "Manchester";
    }
    else if(locat === "Birmingham"){
        return "Birmingham";
    }
    else{
        return "London , Miles End";
    }
}

function trianLineName(tn){
    const diffName = tn.name
    if(diffName==="Bakerloo"){
        return "Bakerloo Line";
    }
    else if(diffName==="Central"){
        return "Central Line";
    }
    else if(diffName==="Circle"){
        return "Circle Line";
    }
    else if(diffName==="District"){
        return "District Line";
    }
    else if(diffName==="Hammersmith & City"){
        return "Hammersmith & City Line";
    }
    else if(diffName==="Jubilee"){
        return "Jubilee Line";
    }
    else if(diffName==="Metropolitan"){
        return "Metropolitan Line";
    }
    else if(diffName==="Piccadilly"){
        return "Piccadilly Line";
    }
    else if(diffName==="Waterloo & City"){
        return "Waterloo & City Line";
    }
    else if(diffName==="Victoria"){
        return "Victoria Line";
    }
    else{
        return "Northern Line";
    }
}

