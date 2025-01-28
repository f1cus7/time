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

const temp = (lat, long) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`;

  return fetch(url)
    .then(response => response.json())
    .then(data => {
      const temperature = data.current_weather.temperature;
      const weatherDescription = data.current_weather.weathercode;
      let weathernow = `${temperature}°C`;
      return weathernow;
    });
}

let tempspbrazn = 0;
let tempastrrazn = 0;

temp(latitude, longitude).then(weathernow => {
  document.getElementById('tempspb').textContent = weathernow;
  tempspbrazn = document.getElementById('tempspb').textContent;
});
temp(latitudeastr, longitudeastr).then(weathernow => {
  document.getElementById('tempastr').textContent = weathernow;
  tempastrrazn = document.getElementById('tempastr').textContent;
});



setTimeout(() => {if(tempspbrazn && tempastrrazn) {
  let s = Number(tempspbrazn.replace(/[^.\d]+/g,""));
  let a = Number(tempastrrazn.replace(/[^.\d]+/g,""));
  if(s > a){
    q = s - a
    document.getElementById('temprazn').textContent = `${Number(q.toFixed(1))}°C`
  } else if (a > s){
    q = a - s
    document.getElementById('temprazn').textContent = `${Number(q.toFixed(1))}°C`
  } else {
document.getElementById('temprazn').textContent = `0°C`
  }
}}, 1000)

