/**
 * Weather service with OpenWeatherMap integration and fallback mock generation.
 */
export const getDestinationWeather = async (destination, apiKey) => {
  if (apiKey) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          destination
        )}&units=metric&cnt=40&appid=${apiKey}`
      );

      if (response.ok) {
        const data = await response.json();
        // OpenWeather returns 3-hour steps. Let's filter to get 1 per day (around noon)
        const dailyForecasts = [];
        const seenDates = new Set();

        for (const item of data.list) {
          const dateStr = item.dt_txt.split(' ')[0];
          // We want around 12:00:00, or just the first time we see a new date
          if (!seenDates.has(dateStr) && (item.dt_txt.includes('12:00:00') || seenDates.size < 5)) {
            seenDates.add(dateStr);
            dailyForecasts.push({
              date: dateStr,
              temp: Math.round(item.main.temp),
              feelsLike: Math.round(item.main.feels_like),
              humidity: item.main.humidity,
              description: item.weather[0].description,
              main: item.weather[0].main, // E.g., Clear, Clouds, Rain
              icon: item.weather[0].icon,
            });
            if (dailyForecasts.length >= 5) break;
          }
        }
        return dailyForecasts;
      }
      console.warn('OpenWeatherMap API returned error status:', response.status);
    } catch (error) {
      console.error('Error fetching OpenWeatherMap:', error.message);
    }
  }

  // Fallback Mock Weather Generation
  // Creates a realistic mock weather profile based on destination name
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const seed = hashString(destination);
  const baseTemp = 15 + (seed % 15); // Base temperature between 15C and 30C
  const weatherTypes = [
    { main: 'Clear', description: 'sunny and clear sky' },
    { main: 'Clouds', description: 'scattered clouds' },
    { main: 'Rain', description: 'light passing showers' },
    { main: 'Clouds', description: 'partly cloudy' },
  ];

  const forecasts = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const forecastDate = new Date();
    forecastDate.setDate(today.getDate() + i);

    const tempOffset = ((seed + i) % 5) - 2; // -2 to +2 variation
    const typeIdx = (seed + i) % weatherTypes.length;
    const weather = weatherTypes[typeIdx];

    forecasts.push({
      date: forecastDate.toISOString().split('T')[0],
      temp: Math.round(baseTemp + tempOffset),
      feelsLike: Math.round(baseTemp + tempOffset + (weather.main === 'Rain' ? -1 : 1)),
      humidity: 50 + ((seed + i) % 35),
      description: weather.description,
      main: weather.main,
      icon: weather.main === 'Clear' ? '01d' : weather.main === 'Rain' ? '10d' : '03d',
    });
  }

  return forecasts;
};
