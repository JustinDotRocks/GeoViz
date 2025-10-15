// filepath: src/App.tsx
import { useState } from "react";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Map from "./components/Map/MapComponent";
import ThreeScene from "./components/ThreeScene/ThreeSceneComponent";

const theme = createTheme({
	palette: {
		mode: "dark",
	},
});

function App() {
	const [mapData, setMapData] = useState(null);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Box
				sx={{
					display: "flex",
					height: "100vh",
					width: "100vw",
				}}
			>
				<Box sx={{ flex: 1, height: "100%" }}>
					<Map onDataChange={setMapData} />
				</Box>
				<Box sx={{ flex: 1, height: "100%" }}>
					<ThreeScene data={mapData} />
				</Box>
			</Box>
		</ThemeProvider>
	);
}

export default App;
