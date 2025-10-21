import { useEffect } from "react";
import createWeatherGraphics from "../utils/createWeatherGraphics";

export const useWeatherVisualization = (
	mapRef: React.RefObject<any>,
	weatherLayerRef: React.RefObject<any>,
	weatherData: any,
	showWeather: boolean
) => {
	//  Effect to handle weather data changes
	useEffect(() => {
		if (
			mapRef.current &&
			weatherLayerRef.current &&
			weatherData &&
			showWeather
		) {
			console.log(
				"Adding weather visualization to map:",
				weatherData
			);

			// Clear existing weather graphics
			weatherLayerRef.current.removeAll();

			// Create and add new weather graphics
			const weatherGraphics = createWeatherGraphics(weatherData);
			weatherLayerRef.current.addMany(weatherGraphics);

			console.log(
				`Added ${weatherGraphics.length} weather graphics to map`
			);
		} else if (weatherLayerRef.current && !showWeather) {
			// Clear weather graphics when toggled off
			weatherLayerRef.current.removeAll();
		}
	}, [weatherData, showWeather, mapRef, weatherLayerRef]);
};
