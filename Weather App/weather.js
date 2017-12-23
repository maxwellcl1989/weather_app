$(document).ready(function(){
	// GET COORDS
	if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		console.log(position);

  		// CONVERT COORDS TO ADDRESS VIA GOOGLE MAPS API
			$.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + 
				"&key=AIzaSyD3xvHLBSdHQJRE3t1ZrhsQXOg-ljFBgP8", function(data){
				console.log(data); 

				// GOOGLE MAPS LOCATION PLUGS INTO YAHOO WEATHER API
				$.getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + 
					data.results[3].address_components[0].long_name + "%2C%20" + data.results[3].address_components[2].long_name + 
					"%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function(data){

					// YAHOO WEATHER DATA PLUGS INTO HTML
					console.log(data);
					var text = data.query.results.channel.item.condition.text;
					var temp = data.query.results.channel.item.condition.temp;
					var date = data.query.results.channel.item.condition.date;
					var city = data.query.results.channel.location.city;
					var region = data.query.results.channel.location.region;
					var forecastData = data.query.results.channel.item.forecast;
					var forecastDays = [$("#day-1"), $("#day-2"), $("#day-3"), $("#day-4"), $("#day-5"), $("#day-6"), $("#day-7")];	
					var forecastIcons = [$("#icon-1"), $("#icon-2"), $("#icon-3"), $("#icon-4"), $("#icon-5"), $("#icon-6"), $("#icon-7")];					
					var forecastHighs = [];
					var celsiusHighs= [];
					var forecastLows = [];
					var celsiusLows = [];
					var themes = [{
						text: "Sunny",
						icon: "wi wi-day-sunny",
						image: "http://www.youwall.com/wallpapers/201207/sunny-day-wallpaper-1440x900.jpg"},
						{text: "Mostly Sunny",
						icon: "wi wi-day-sunny",
						image: "http://www.youwall.com/wallpapers/201207/sunny-day-wallpaper-1440x900.jpg"},
						{text: "Clear",
						icon: "wi wi-day-sunny",
						image: "http://www.youwall.com/wallpapers/201207/sunny-day-wallpaper-1440x900.jpg"},
						{text: "Thunderstorms",
						icon: "wi wi-day-rain",
						image: "http://az616578.vo.msecnd.net/files/2015/10/09/635800070039847950197411784_rainy_day_free_wallpapers_9442466031.imgopt1000x70.jpg"},
						{text: "Scattered Thunderstorms",
						icon: "wi wi-day-rain",
						image: "http://az616578.vo.msecnd.net/files/2015/10/09/635800070039847950197411784_rainy_day_free_wallpapers_9442466031.imgopt1000x70.jpg"},
						{text: "Showers",
						icon: "wi wi-day-rain",
						image: "http://az616578.vo.msecnd.net/files/2015/10/09/635800070039847950197411784_rainy_day_free_wallpapers_9442466031.imgopt1000x70.jpg"},
						{text: "Drizzle",
						icon: "wi wi-day-rain",
						image: "http://az616578.vo.msecnd.net/files/2015/10/09/635800070039847950197411784_rainy_day_free_wallpapers_9442466031.imgopt1000x70.jpg"},
						{text: "Partly Cloudy",
						icon: "wi wi-cloud",
						image: "https://static.pexels.com/photos/1818/sky-clouds-cloudy-forest.jpg"},
						{text: "Cloudy",
						icon: "wi wi-cloud",
						image: "https://static.pexels.com/photos/1818/sky-clouds-cloudy-forest.jpg"},
						{text: "Mostly Cloudy",
						icon: "wi wi-cloud",
						image: "https://static.pexels.com/photos/1818/sky-clouds-cloudy-forest.jpg"}];
					$("#location").text(city + ", " + region);
					$("#date").text(date);
					$("#degrees").html(temp + "&#176;");
					$("#conditions").text(text);

					mainIcon();
					makeForecast(forecastHighs, forecastLows);

					// ADDS ICON TO TOP HEADING
					function mainIcon() {
						for (var i = 0; i < themes.length; i++) {
							if (text == themes[i].text) {
								$("#main-icon").html("<i class='" + themes[i].icon + "'</i>");
								$("body").css("background-image", "url('" + themes[i].image) + ")";
							}
						}
					}

					// ADDS FORECAST ICONS
					function forecastIcon(icon, num) {
						for (var i = 0; i < themes.length; i++) {
							if (forecastData[num].text == themes[i].text) {
								$(icon).html("<i class='" + themes[i].icon + "'</i>");
							}
						}
					}

					// MAKES TEMPERATURE CONVERSIONS AND PLUGS IN DATA FOR 7-DAY FORECAST
					function makeForecast(high, low){
						for (var i = 0; i < forecastDays.length; i++) {
						forecastHighs.push(forecastData[i].high);
						forecastLows.push(forecastData[i].low);
						celsiusHighs.push(Math.round((forecastHighs[i] - 32) / (9 / 5)));
						celsiusLows.push(Math.round((forecastLows[i] - 32) / (9 / 5)));
						$(forecastDays[i]).html("<br><strong>" + forecastData[i].day + " " + forecastData[i].date + "</strong>:<br>" + forecastData[i].text + 
						"<br> High: " + high[i] + "&#176; " + "<br>Low: " + low[i] + "&#176;");	
						forecastIcon(forecastIcons[i], i);					
						}
					}

					// TOGGLES BETWEEN FAHRENHEIT AND CELSIUS
					function toCelsius(){
						if ($("button").hasClass("selected")) {
							var tempCelsius = Math.round((data.query.results.channel.item.condition.temp - 32) / (9 / 5));
							$("#degrees").html(tempCelsius + "&#176;" + " ");
							makeForecast(celsiusHighs, celsiusLows);
						} else {
							$("#degrees").html(temp + "&#176;" + " ");
							makeForecast(forecastHighs, forecastLows);
							}						
						}

					// TOGGLE BUTTON FUNCTIONALITY 
					$("button").click(function(){
						$(this).toggleClass("selected");
						toCelsius();
						if ($("button").hasClass("selected")) {
							$(this).text("Toggle Fahrenheit");
						}
							else {
								$(this).text("Toggle Celsius")
							}
						});
				});
			})
	 	});
	}
});


