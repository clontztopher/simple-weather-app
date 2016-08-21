(function weatherApp($){

  var $body = $('body');
  var $city = $body.find('.content-box__city');
  var $weather = $body.find('.info-box__weather');
  var $tempBox = $body.find('.info-box__temp');
  var $time = $body.find('.info-box__time');
  var $temp = $tempBox.find('#temp');
  var $units = $tempBox.find('#units');

  var state = {};

  function getLocation(){
    $.getJSON('http://ipinfo.io', function(data){
        state.city = data.city;
        getWeather(data.loc);
    });
  };

function getWeather(loc){
  loc = loc.split(',');
  var lat = loc[0];
  var lon = loc[1];
  $.get('http://api.openweathermap.org/data/2.5/weather?' + 
    'lat=' + lat + '&lon=' + lon + 
    '&APPID=04b61ca2e80658639ac4ae6279c22d26', 
    function(weather){
      state.temp = tempConverter(
        'kelvin', 
        'fahrenheit', 
        weather.main.temp
      );
      state.description = weather.weather[0].description;
      state.main = weather.weather[0].main;
      init();
    });
  };

  function tempConverter(unit, target, temp){
  var newTemp;
    switch (unit) {
      case 'kelvin':
        (target == 'celsius') ? 
          newTemp = temp - 273 : 
          newTemp = (temp - 273) * 1.8 + 32;
        break;
      case 'celsius':
        (target == 'kelvin') ?
          newTemp = temp + 273 :
          newTemp = temp * 1.8 + 32;
        break;
      case 'fahrenheit':
        (target == 'celsius') ?
          newTemp = (temp - 32) / 1.8 :
          newTemp = (temp - 32) / 1.8 + 273;
        break;
      default:
        alert('something went wrong with converter, check; unit: ' + unit + ', target: ' + target + ', temp: ' + temp);
    }
    return Number(newTemp.toFixed());
  };

  function updateTemp(){
    var temp;
    if ($units.text() == 'F'){
      temp = tempConverter('fahrenheit', 'celsius', state.temp);
      state.temp = temp;
      $temp.text(temp);
      $units.text('C');
    } else {
      temp = tempConverter('celsius', 'fahrenheit', state.temp);
      state.temp = temp;
      $temp.text(temp);
      $units.text('F');
    }
  };

  function updateBG(description){
    var url;
    switch (description){
      case 'Clouds':
        url = 'weather-img/clouds.jpg';
        break;
      case 'Rain':
        url = 'weather-img/rain.jpg';
        break;
      case 'Thunderstorm':
        url = 'weather-img/lightning.jpg';
        break;
      case 'Snow':
        url = 'weather-img/snow.jpg';
        break;
      case 'Mist':
        url = 'weather-img/mist.jpg';
        break;
      case 'Clear':
      default:
        url = 'weather-img/clear.jpg';
    }
    var settings = {
      'background': 'url(' + url + ')',
      'background-size': 'cover',
      'background-repeat': 'no-repeat',
      'height': '100vh'
    };
    $body.css(settings).fadeIn();
  };

  function init(){
    var d = new Date();
    var time = d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});
    $time.text(time);
    $city.text(state.city);
    $weather.text(state.main);
    $temp.text(state.temp);
    updateBG(state.main);
  };

  $tempBox.on('click', updateTemp);
  getLocation();

})(jQuery);