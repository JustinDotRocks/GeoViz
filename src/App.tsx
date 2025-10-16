// filepath: src/App.tsx
import { useState } from "react";
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
} from "@mui/icons-material";
import Map from "./components/Map/MapComponent";
import ThreeScene from "./components/ThreeScene/ThreeSceneComponent";
import SidebarMenuComponent from "./components/Menus/SidebarMenuComponent";

const theme = createTheme({
	palette: {
		mode: "dark",
	},
});

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

	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [categories, setCategories] = useState(initialCategories);
	const [selectedData, setSelectedData] = useState([
		"environment-canada",
		"nrcan-elevation",
	]);

	const handleDataToggle = (dataId: string) => {
		setSelectedData((prev) =>
			prev.includes(dataId)
				? prev.filter((id) => id !== dataId)
				: [...prev, dataId]
		);
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

			{/* Main Content - Overlay Mode */}
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
				{/* Full Map Background */}
				<Map onDataChange={setMapData} />

				{/* 3D Scene Overlay (Bottom Right Corner) */}
				<Box
					sx={{
						position: "absolute",
						bottom: 16,
						right: 16,
						width: "40%",
						height: "40%",
						zIndex: 1000,
						borderRadius: 2,
						overflow: "hidden",
						boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
						border: "2px solid rgba(255, 255, 255, 0.1)",
					}}
				>
					<ThreeScene data={mapData} />
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default App;
