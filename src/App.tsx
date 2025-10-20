import { useState, useEffect } from "react";
import {
	Box,
	CssBaseline,
	ThemeProvider,
	createTheme,
	IconButton,
} from "@mui/material";
import {
	Menu as MenuIcon,
	WbSunny,
	Terrain,
	Waves,
	People,
	WaterDrop,
	Thermostat,
} from "@mui/icons-material";
import Map from "./components/Map/MapComponent";
import SidebarMenuComponent from "./components/Menus/SidebarMenuComponent";

const theme = createTheme({
	palette: {
		mode: "dark",
	},
});

interface WeatherData {
	type?: string;
	temperature?: number;
	precipitation?: number;
	station?: string;
	date?: string;
	coordinates?: [number, number];
	visible?: boolean;
	// Individual visibility controls
	showTemperature?: boolean;
	showPrecipitation?: boolean;
}

// Define data categories and sources
const initialCategories = [
	{
		id: "weather",
		title: "🌤️ Weather & Climate",
		icon: <WbSunny />,
		expanded: true,
		sources: [
			{
				id: "environment-canada",
				label: "Environment Canada",
				icon: <WbSunny />,
				description: "Real-time weather, forecasts, alerts",
				enabled: true,
				// ADD: Nested weather data types
				subSources: [
					{
						id: "temperature",
						label: "Temperature",
						icon: <Thermostat />,
						description: "Temperature spheres",
						enabled: true,
						parentId: "environment-canada",
					},
					{
						id: "precipitation",
						label: "Precipitation",
						icon: <WaterDrop />,
						description: "Precipitation cylinders",
						enabled: true,
						parentId: "environment-canada",
					},
				],
			},
			{
				id: "openweathermap",
				label: "OpenWeatherMap",
				icon: <WbSunny />,
				description: "Current weather, forecasts (free tier)",
				enabled: false,
			},
		],
	},
	{
		id: "geographic",
		title: "🌍 Geographic Data",
		icon: <Terrain />,
		expanded: true,
		sources: [
			{
				id: "nrcan-elevation",
				label: "NRCan Elevation",
				icon: <Terrain />,
				description: "Elevation, topography, geology",
				enabled: true,
			},
			{
				id: "nasa-earthdata",
				label: "NASA EarthData",
				icon: <Terrain />,
				description: "Satellite imagery, land cover",
				enabled: false,
			},
		],
	},
	{
		id: "marine",
		title: "🌊 Marine & Coastal",
		icon: <Waves />,
		expanded: false,
		sources: [
			{
				id: "fisheries-oceans",
				label: "Fisheries & Oceans Canada",
				icon: <Waves />,
				description: "Ocean conditions, tides",
				enabled: false,
			},
		],
	},
	{
		id: "demographics",
		title: "🏘️ Demographics",
		icon: <People />,
		expanded: false,
		sources: [
			{
				id: "stats-canada",
				label: "Statistics Canada",
				icon: <People />,
				description: "Population, census data",
				enabled: false,
			},
		],
	},
];

function App() {
	const [mapData, setMapData] = useState(null);
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [categories, setCategories] = useState(initialCategories);
	const [selectedData, setSelectedData] = useState([
		"environment-canada",
		"temperature", // Individual temperature toggle
		"precipitation", // Individual precipitation toggle
		"nrcan-elevation",
	]);

	// Add helper functions to check individual weather toggles
	const isEnvironmentCanadaEnabled = () =>
		selectedData.includes("environment-canada");
	const isTemperatureEnabled = () =>
		selectedData.includes("temperature") &&
		isEnvironmentCanadaEnabled();
	const isPrecipitationEnabled = () =>
		selectedData.includes("precipitation") &&
		isEnvironmentCanadaEnabled();

	// useEffect to fetch data for St. John's coordinates
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
	}, [selectedData]);

	// Enhanced data toggle handler for nested controls
	const handleDataToggle = (dataId: string) => {
		if (dataId === "environment-canada") {
			// If toggling Environment Canada off, remove all weather sub-items
			if (selectedData.includes("environment-canada")) {
				setSelectedData((prev) =>
					prev.filter(
						(id) =>
							![
								"environment-canada",
								"temperature",
								"precipitation",
							].includes(id)
					)
				);
			} else {
				// If toggling Environment Canada on, add it but don't auto-enable sub-items
				setSelectedData((prev) => [
					...prev,
					"environment-canada",
				]);
			}
		} else if (["temperature", "precipitation"].includes(dataId)) {
			// Individual weather data toggles
			if (isEnvironmentCanadaEnabled()) {
				setSelectedData((prev) =>
					prev.includes(dataId)
						? prev.filter((id) => id !== dataId)
						: [...prev, dataId]
				);
			}
		} else {
			// Regular toggle for other data sources
			setSelectedData((prev) =>
				prev.includes(dataId)
					? prev.filter((id) => id !== dataId)
					: [...prev, dataId]
			);
		}
	};

	const handleCategoryToggle = (categoryId: string) => {
		setCategories((prev) =>
			prev.map((cat) =>
				cat.id === categoryId
					? { ...cat, expanded: !cat.expanded }
					: cat
			)
		);
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />

			{/* Sidebar Menu */}
			<SidebarMenuComponent
				open={sidebarOpen}
				selectedData={selectedData}
				onDataToggle={handleDataToggle}
				onCategoryToggle={handleCategoryToggle}
				categories={categories}
			/>

			{/* Menu Toggle Button */}
			<IconButton
				onClick={() => setSidebarOpen(!sidebarOpen)}
				sx={{
					position: "fixed",
					top: 16,
					left: sidebarOpen ? 336 : 16,
					zIndex: 1300,
					bgcolor: "rgba(0, 0, 0, 0.7)",
					color: "white",
					"&:hover": { bgcolor: "rgba(0, 0, 0, 0.9)" },
				}}
			>
				<MenuIcon />
			</IconButton>

			{/* Main Content - Full Map with 3D Overlays */}
			<Box
				sx={{
					marginLeft: sidebarOpen ? "320px" : 0,
					height: "100vh",
					width: sidebarOpen
						? "calc(100vw - 320px)"
						: "100vw",
					position: "relative",
					transition: "all 0.3s ease-in-out",
				}}
			>
				{/* Full Map with 3D Visualizations */}
				<Map
					onDataChange={setMapData}
					weatherData={weatherData}
					selectedData={selectedData}
					showTerrain={selectedData.includes(
						"nrcan-elevation"
					)}
					showWeather={selectedData.includes(
						"environment-canada"
					)}
				/>
			</Box>
		</ThemeProvider>
	);
}

export default App;
