let spbVoshod = document.getElementById('spb-voshod');
let spbZashod = document.getElementById('spb-zahod');
let spbDayTime = document.getElementById('spb-daytime');
let astVoshod = document.getElementById('ast-voshod');
let astZashod = document.getElementById('ast-zahod');
let astDayTime = document.getElementById('ast-daytime');
let raznVoshodNode = document.getElementById('razn-voshod');
let raznZahodNode = document.getElementById('razn-zahod');
let raznDayTime = document.getElementById('raznDayTime');

let voshodAstr, voshodSpb, zahodAstr, zahodSpb, sredastr, sredspb;

function fetchData(lat, lng, isSPB) {
  fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
    .then(response => response.json())
    .then(data => {
      const sunriseTime = new Date(data.results.sunrise);
      const sunsetTime = new Date(data.results.sunset);
      if (isSPB) {
        sunriseTime.setHours(sunriseTime.getHours());
        sunsetTime.setHours(sunsetTime.getHours());
      } else {
        sunriseTime.setHours(sunriseTime.getHours() + 1);
        sunsetTime.setHours(sunsetTime.getHours() + 1);
      }
      

      const sunriseFormatted = sunriseTime.toLocaleTimeString();
      const sunsetFormatted = sunsetTime.toLocaleTimeString();

      const dayLengthSeconds = data.results.day_length;
      const hours = Math.floor(dayLengthSeconds / 3600);
      const minutes = Math.floor((dayLengthSeconds % 3600) / 60);
      const seconds = dayLengthSeconds % 60;
      
      let dayLength
      if(hours < 10 && seconds < 10) {
      dayLength = `0${hours}:${minutes}:0${seconds}`;
    } else if (hours < 10 && seconds >= 10){
      dayLength = `0${hours}:${minutes}:${seconds}`;
    } else if (hours >= 10 && seconds < 10){
      dayLength = `${hours}:${minutes}:0${seconds}`;
    } else {
      dayLength = `${hours}:${minutes}:${seconds}`;
    }
      

      if (isSPB) {
        voshodSpb = sunriseFormatted;
        zahodSpb = sunsetFormatted;
        spbVoshod.textContent = sunriseFormatted;
        spbZashod.textContent = sunsetFormatted;
        spbDayTime.textContent = dayLength;
        sredspb = `${hours}:${minutes}:${seconds}`;

        if (voshodAstr) {
          const raznVoshod = subtractTimes(voshodAstr, voshodSpb);
          raznVoshodNode.textContent = raznVoshod;
        }
        if (zahodAstr) {
          const raznZahod = subtractTimes(zahodAstr, zahodSpb);
          raznZahodNode.textContent = raznZahod;
        }

      } else {
        voshodAstr = sunriseFormatted;
        zahodAstr = sunsetFormatted;
        astVoshod.textContent = sunriseFormatted;
        astZashod.textContent = sunsetFormatted;
        astDayTime.textContent = dayLength;
        sredastr = `${hours}:${minutes}:${seconds}`;


        if (voshodSpb) {
          const raznVoshod = subtractTimes(voshodAstr, voshodSpb);
          raznVoshodNode.textContent = raznVoshod;
        }
        if (zahodSpb) {
          const raznZahod = subtractTimes(zahodAstr, zahodSpb);
          raznZahodNode.textContent = raznZahod;
        }
        if (spbDayTime && astDayTime) {
          const razndaytimes = subtractTimes(sredspb, sredastr);  
          raznDayTime.textContent = razndaytimes
        }
      }
      
    })
    .catch(error => console.log('Ошибка:', error));
}


// Запрос для СПБ
fetchData(59.8940, 30.2640, true);

// Запрос для астрахани
fetchData(46.3497, 48.0408, false);

function subtractTimes(time1, time2) {

  const [hours1, minutes1, seconds1] = time1.split(':').map(Number);
  const [hours2, minutes2, seconds2] = time2.split(':').map(Number);

  const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
  const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;

  let resultSeconds = Math.abs(totalSeconds1 - totalSeconds2);

  const hours = Math.floor(resultSeconds / 3600);
  const minutes = Math.floor((resultSeconds % 3600) / 60);
  const seconds = resultSeconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}


const latitude = 59.8940;
const longitude = 30.2640;
const latitudeastr = 46.3497;
const longitudeastr = 48.0408;

let sunny = false;

const temp = (lat, long) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;

  return fetch(url).then(response => response.json()).then(data => {return `${data.current_weather.temperature}°C,`;});};

const weather = (lat, long) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const weatherCode = data.current_weather.weathercode;
      let weatherDescription;
      switch (weatherCode) {
        case 0:
          weatherDescription = "Ясно";
          sunny = true;
          break;
        case 1:
        case 2:
        case 3:
          weatherDescription = "Переменная облачность";
          break;
        case 45:
        case 48:
          weatherDescription = "Туман";
          break;
        case 51:
        case 53:
        case 55:
          weatherDescription = "Морось";
          break;
        case 61:
        case 63:
        case 65:
          weatherDescription = "Дождь";
          break;
        case 66:
        case 67:
          weatherDescription = "Замерзающий дождь";
          break;
        case 71:
        case 73:
        case 75:
          weatherDescription = "Снег";
          break;
        case 77:
          weatherDescription = "Снежные зерна";
          break;
        case 80:
        case 81:
        case 82:
          weatherDescription = "Ливень";
          break;
        case 85:
        case 86:
          weatherDescription = "Снегопад";
          break;
        case 95:
          weatherDescription = "Гроза";
          break;
        case 96:
        case 99:
          weatherDescription = "Гроза с градом";
          break;
        default:
          weatherDescription = "Неизвестная погода";
      }
      return weatherDescription;
    });
};


let tempspbrazn = 0;
let tempastrrazn = 0;

async function updateWeather(lat, lon, tempId, weatherId) {
  try {
    const [weathernow, weatherDescription] = await Promise.all([
      temp(lat, lon),
      weather(lat, lon)
    ]);

    document.getElementById(tempId).textContent = weathernow;
    document.getElementById(weatherId).textContent = weatherDescription;

    return weathernow;
  } catch (error) {
    console.error("Ошибка при получении данных о погоде:", error);
  }
}

async function updateIcons() {
  try {
    const weatherSpb = await weather(latitude, longitude);
    const weatherAstr = await weather(latitudeastr, longitudeastr);

    const isSunnySpb = weatherSpb.toLowerCase().includes("sunny");
    const isSunnyAstr = weatherAstr.toLowerCase().includes("sunny");

    document.getElementById('weatherazn').innerHTML = getWeatherIcon(isSunnySpb || isSunnyAstr);
  } catch (error) {
    console.error("Ошибка при обновлении иконки погоды:", error);
  }
}


function getWeatherIcon(isSunny) {
  return isSunny
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="yellow" class="bi bi-sun" viewBox="0 0 16 16">
  <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-cloud" viewBox="0 0 16 16">
  <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
</svg>`;
}

(async function () {
  tempspbrazn = await updateWeather(latitude, longitude, 'tempspb', 'weatherspb');
  tempastrrazn = await updateWeather(latitudeastr, longitudeastr, 'tempastr', 'weatherastr');
  await updateIcons();
})();


const calculateTemperatureDifference = () => {
  if (tempspbrazn && tempastrrazn) {
    const tempSPB = parseFloat(tempspbrazn.replace(/[^.-\d]+/g, ""));
    const tempAstr = parseFloat(tempastrrazn.replace(/[^.-\d]+/g, ""));
    const difference = Math.abs(tempSPB - tempAstr);
    document.getElementById('temprazn').textContent = `${difference.toFixed(1)}°C`;
  }
};

setTimeout(calculateTemperatureDifference, 2000);


const apiKey = "5768b380fc684ec9b5b125304253001";
let tempSpb = null;
let tempAstr = null;
let falloutastra = null;
let falloutspbu = null;
let windastrsred = null;
let windspbsred = null;
let humidityspb = null;
let humidityrazn = null;
let humidityastr = null;

const fetchWeatherData = async (city) => {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);

    const data = await response.json();

    const feelsLike = data.current.feelslike_c;
    const windSpeed = data.current.wind_kph;
    const precipitation = data.current.precip_mm;
    const humidity = data.current.humidity;

    if (city === "Saint Petersburg") {
      tempSpb = feelsLike;
      falloutspbu = precipitation;
      windspbsred = windSpeed;
      humidityspb = humidity;
      document.getElementById("temprealspb").textContent = `${feelsLike}°C`;
      document.getElementById("windspb").textContent = `${windSpeed} км/ч`;
      document.getElementById("falloutspb").textContent = `${precipitation} мм`;
      document.getElementById("humidityspb").textContent = `${humidity} мм`;
    } else if (city === "Astrakhan") {
      tempAstr = feelsLike;
      falloutastra = precipitation;
      windastrsred = windSpeed;
      humidityastr = humidity;
      document.getElementById("temprealastr").textContent = `${feelsLike}°C`;
      document.getElementById("windastr").textContent = `${windSpeed} км/ч`;
      document.getElementById("falloutastr").textContent = `${precipitation} мм`;
      document.getElementById("humidityastr").textContent = `${humidity} мм`;
    }

    if (tempSpb !== null && tempAstr !== null) {
      const tempDifference = Math.abs(tempSpb - tempAstr);
      document.getElementById("temprealrazn").textContent = `${tempDifference.toFixed(1)}°C`;
    }
    if (falloutastra !== null && falloutspbu !== null) {
      if(falloutastra > falloutspbu) {
        document.getElementById('falloutrazn').textContent = falloutastra - falloutspbu + ' мм';
      } else if (falloutastra < falloutspbu){
        document.getElementById('falloutrazn').textContent = falloutspbu - falloutastra + ' мм';
      } else {
        document.getElementById('falloutrazn').textContent = 0 + ' мм';
      }
    }
    if (windastrsred !== null && windspbsred !== null) {
      if(windastrsred > windspbsred) {
        document.getElementById('windrazn').textContent = windastrsred - windspbsred + ' км/ч';
      } else if (windastrsred < windspbsred){
        document.getElementById('windrazn').textContent = windspbsred - windastrsred + ' км/ч';
      } else {
        document.getElementById('windrazn').textContent = 0 + ' км/ч';
      }
    }
    if (humidityastr !== null && humidityspb !== null) {
      if(humidityastr > humidityspb) {
        document.getElementById('humidityrazn').textContent = humidityastr - humidityspb + ' мм';
      } else if (humidityastr < humidityspb){
        document.getElementById('humidityrazn').textContent = humidityspb - humidityastr + ' мм';
      } else {
        document.getElementById('humidityrazn').textContent = 0 + ' мм';
      }
    }
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
  }
};

fetchWeatherData("Saint Petersburg");
fetchWeatherData("Astrakhan");
