import { useState, useEffect } from "react";
import type { WeatherData } from "../types";
// import { useDataSources } from "./useDataSourcesHook";

// useEffect to fetch data for St. John's coordinates
export const useWeatherData = (
	selectedData: string[],
	isEnvironmentCanadaEnabled: () => boolean,
	isTemperatureEnabled: () => boolean,
	isPrecipitationEnabled: () => boolean
) => {
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	// Get the functions and state from useDataSources
	// const {
	// 	selectedData,
	// 	isEnvironmentCanadaEnabled,
	// 	isTemperatureEnabled,
	// 	isPrecipitationEnabled,
	// } = useDataSources();

	useEffect(() => {
		if (isEnvironmentCanadaEnabled()) {
			console.log("Fetching Environment Canada weather data...");

			// St. John's, Newfoundland coordinates
			const stJohnsLat = 47.5615;
			const stJohnsLon = -52.7126;
			const recentDate = new Date();
			recentDate.setDate(recentDate.getDate() - 1); // Yesterday's data
			const dateString = recentDate.toISOString().split("T")[0]; // YYYY-MM-DD format

			fetch(
				//  Switch from climate-daily to climate-hourly for recent data
				`https://api.weather.gc.ca/collections/climate-hourly/items?limit=1&datetime=${dateString}&STATION_NAME=ST%20JOHN%27S`
			)
				.then((res) => res.json())
				.then((data) => {
					console.log("Weather API response:", data);

					const feature = data.features?.[0];
					const props = feature?.properties || {};
					const coords = feature?.geometry?.coordinates || [
						stJohnsLon,
						stJohnsLat,
					];

					// Log all property names to see what's available
					console.log(
						"Available property names:",
						Object.keys(props)
					);
					console.log("All properties:", props);

					// Use different property names for hourly data
					setWeatherData({
						type: "environment-canada",
						temperature: props.TEMP,
						precipitation: props.PRECIP_AMOUNT,
						station:
							props.STATION_NAME ||
							"St. John's Area",
						date:
							props.LOCAL_DATE ||
							new Date().toISOString(),
						coordinates: [
							coords[0] || stJohnsLon,
							coords[1] || stJohnsLat,
						],
						visible: true,
						//  Include the individual toggle states
						showTemperature: isTemperatureEnabled(),
						showPrecipitation: isPrecipitationEnabled(),
					});

					console.log("Parsed CURRENT weather data:", {
						temperature: props.TEMP,
						precipitation: props.PRECIP_AMOUNT,
						station:
							props.STATION_NAME ||
							"St. John's Area",
						date: props.LOCAL_DATE,
						coordinates: [
							coords[0] || stJohnsLon,
							coords[1] || stJohnsLat,
						],
						tempValue: props.TEMP,
						precipValue: props.PRECIP_AMOUNT,
					});
				})
				.catch(() => {
					console.log(
						"Using fallback current weather data"
					);
					setWeatherData(null);
				});
		} else {
			setWeatherData(null);
		}
	}, [
		selectedData,
		isEnvironmentCanadaEnabled,
		isTemperatureEnabled,
		isPrecipitationEnabled,
	]);

	// CHANGE: Return weatherData with current toggle states
	const weatherDataWithToggles = weatherData
		? {
				...weatherData,
				showTemperature: isTemperatureEnabled(),
				showPrecipitation: isPrecipitationEnabled(),
		  }
		: null;

	return { weatherData: weatherDataWithToggles };
};
