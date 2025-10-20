import { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import { theme } from "./theme";

import MainContent from "./components/MainContentComponent";
import Map from "./components/Map/MapComponent";
import SidebarMenuComponent from "./components/Menus/SidebarMenuComponent";
import MenuToggleButton from "./components/Menus/MenuToggleButtonComponent";

import { useDataSources } from "./hooks/useDataSourcesHook";
import { useWeatherData } from "./hooks/useWeatherDataHook";

function App() {
	const [, setMapData] = useState(null);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	// Use the data sources hook
	const {
		selectedData,
		categories,
		handleDataToggle,
		handleCategoryToggle,
		isEnvironmentCanadaEnabled,
		isTemperatureEnabled,
		isPrecipitationEnabled,
	} = useDataSources();

	const { weatherData } = useWeatherData(
		selectedData,
		isEnvironmentCanadaEnabled,
		isTemperatureEnabled,
		isPrecipitationEnabled
	);

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
			<MenuToggleButton
				sidebarOpen={sidebarOpen}
				onToggle={() => setSidebarOpen(!sidebarOpen)}
			/>

			{/* Main Content - Full Map with 3D Overlays */}
			<MainContent sidebarOpen={sidebarOpen}>
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
			</MainContent>
		</ThemeProvider>
	);
}

export default App;
