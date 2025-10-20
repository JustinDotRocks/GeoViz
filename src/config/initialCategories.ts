import {
	WbSunny,
	Terrain,
	Waves,
	People,
	WaterDrop,
	Thermostat,
} from "@mui/icons-material";
import { createElement } from "react";
import type { DataCategory } from "../types";

// Define data categories and sources
export const initialCategories: DataCategory[] = [
	{
		id: "weather",
		title: "🌤️ Weather & Climate",
		icon: createElement(WbSunny),
		expanded: true,
		sources: [
			{
				id: "environment-canada",
				label: "Environment Canada",
				icon: createElement(WbSunny),
				description: "Real-time weather, forecasts, alerts",
				enabled: true,
				subSources: [
					{
						id: "temperature",
						label: "Temperature",
						icon: createElement(Thermostat),
						description: "Temperature spheres",
						enabled: true,
						parentId: "environment-canada",
					},
					{
						id: "precipitation",
						label: "Precipitation",
						icon: createElement(WaterDrop),
						description: "Precipitation cylinders",
						enabled: true,
						parentId: "environment-canada",
					},
				],
			},
			{
				id: "openweathermap",
				label: "OpenWeatherMap",
				icon: createElement(WbSunny),
				description: "Current weather, forecasts (free tier)",
				enabled: false,
			},
		],
	},
	{
		id: "geographic",
		title: "🌍 Geographic Data",
		icon: createElement(Terrain),
		expanded: true,
		sources: [
			{
				id: "nrcan-elevation",
				label: "NRCan Elevation",
				icon: createElement(Terrain),
				description: "Elevation, topography, geology",
				enabled: true,
			},
			{
				id: "nasa-earthdata",
				label: "NASA EarthData",
				icon: createElement(Terrain),
				description: "Satellite imagery, land cover",
				enabled: false,
			},
		],
	},
	{
		id: "marine",
		title: "🌊 Marine & Coastal",
		icon: createElement(Waves),
		expanded: false,
		sources: [
			{
				id: "fisheries-oceans",
				label: "Fisheries & Oceans Canada",
				icon: createElement(Waves),
				description: "Ocean conditions, tides",
				enabled: false,
			},
		],
	},
	{
		id: "demographics",
		title: "🏘️ Demographics",
		icon: createElement(People),
		expanded: false,
		sources: [
			{
				id: "stats-canada",
				label: "Statistics Canada",
				icon: createElement(People),
				description: "Population, census data",
				enabled: false,
			},
		],
	},
];
