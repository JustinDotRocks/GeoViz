import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Box as MuiBox, Typography } from "@mui/material";
import ElevationTerrain from "./ElevationTerrain";
import TerrainDebugInfo from "./TerrainDebugInfo";

interface ThreeSceneProps {
	data: any;
	selectedData?: string[];
	showTerrain: boolean;
	weatherData: any;
}

function WeatherOverlay({
	weatherData,
	visible = true,
}: {
	weatherData: any;
	visible?: boolean;
}) {
	if (!visible || !weatherData) return null;

	console.log("WeatherOverlay rendering with data:", weatherData);

	return (
		<group position={[0, 5, 0]}>
			{/* Display weather data as text */}
			<Text
				position={[0, 0, 0]}
				fontSize={1}
				color="cyan"
				anchorX="center"
				anchorY="middle"
			>
				{`Environment Canada Weather
Station: ${weatherData.station || "N/A"}
Date: ${weatherData.date ? weatherData.date.split(" ")[0] : "N/A"}
Temperature: ${weatherData.temperature ?? "N/A"}°C
Precipitation: ${weatherData.precipitation ?? "N/A"}mm`}
			</Text>

			{/* Optional: Visual weather effect */}
			{weatherData.temperature !== null &&
				weatherData.temperature < 0 && (
					<mesh
						position={[0, -1, 0]}
						rotation={[-Math.PI / 2, 0, 0]}
					>
						<planeGeometry args={[15, 15]} />
						<meshBasicMaterial
							color="#B0E0E6"
							transparent
							opacity={0.2}
						/>
					</mesh>
				)}

			{weatherData.precipitation !== null &&
				weatherData.precipitation > 0 && (
					<mesh
						position={[0, -1.1, 0]}
						rotation={[-Math.PI / 2, 0, 0]}
					>
						<planeGeometry args={[15, 15]} />
						<meshBasicMaterial
							color="#4682B4"
							transparent
							opacity={0.3}
						/>
					</mesh>
				)}
		</group>
	);
}

// Data display component
function DataDisplay({
	mapData,
	selectedData,
}: {
	mapData: any;
	selectedData?: string[];
}) {
	if (!mapData) return null;

	const elevationInfo = mapData.elevation?.data
		? `Points: ${mapData.elevation.data.points.length}`
		: "Mock Data";

	const activeDataSources =
		selectedData && selectedData.length > 0
			? selectedData.join(", ")
			: "None";

	return (
		<Text
			position={[-8, 8, 0]}
			fontSize={0.6}
			color="white"
			anchorX="left"
			anchorY="top"
		>
			{`Zoom: ${mapData.zoom?.toFixed(1) || "N/A"}
Lat: ${mapData.center?.latitude?.toFixed(3) || "N/A"}
Lon: ${mapData.center?.longitude?.toFixed(3) || "N/A"}
Elevation: ${elevationInfo}
Active Data: ${activeDataSources || "None"}
${mapData.elevation?.loading ? "Loading..." : ""}`}
		</Text>
	);
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
	data,
	showTerrain,
	selectedData = [],
	weatherData,
}) => {
	// Determine what to show based on selected data
	// const showElevation = selectedData.includes("nrcan-elevation");
	const showWeather = selectedData.includes("environment-canada");

	console.log("ThreeScene weatherData:", weatherData);
	console.log("ThreeScene showWeather:", showWeather);

	return (
		<MuiBox
			sx={{
				width: "100%",
				height: "100%",
				bgcolor: "#1a1a1a",
				position: "relative",
			}}
		>
			{/* Data overlay */}
			<MuiBox
				sx={{
					position: "absolute",
					top: 16,
					right: 16,
					zIndex: 1000,
					color: "white",
				}}
			>
				<Typography variant="h6" gutterBottom>
					Newfoundland Terrain
				</Typography>
				<Typography variant="body2">
					{data?.elevation?.data
						? "Real Elevation Data"
						: "Mock Elevation Data"}
				</Typography>
				<Typography variant="caption" sx={{ display: "block" }}>
					Active Layers: {selectedData.length}
				</Typography>
			</MuiBox>

			<Canvas
				camera={{ position: [15, 15, 15], fov: 60 }}
				style={{ width: "100%", height: "100%" }}
			>
				{/* Enhanced Lighting for terrain */}
				<ambientLight intensity={0.4} />
				<directionalLight
					position={[10, 10, 5]}
					intensity={1}
					castShadow
				/>
				<pointLight position={[-10, 10, -10]} intensity={0.3} />

				{/* Only render terrain if showTerrain is true */}
				{showTerrain && (
					<ElevationTerrain
						elevationData={data?.elevationData}
						visible={true}
						// ...other props...
					/>
				)}

				{/* Weather overlay: use weatherData prop and showWeather toggle */}
				{weatherData && showWeather && (
					<WeatherOverlay
						weatherData={weatherData}
						visible={true}
					/>
				)}

				{/* Debug info - extracted component */}
				<TerrainDebugInfo
					elevationData={data?.elevation?.data}
				/>

				{/* Data display */}
				<DataDisplay
					mapData={data}
					selectedData={selectedData}
				/>

				{/* Grid for reference */}
				<gridHelper args={[30, 30, "#333333", "#333333"]} />

				{/* Enhanced controls */}
				<OrbitControls
					enablePan={true}
					enableZoom={true}
					enableRotate={true}
					minDistance={5}
					maxDistance={50}
					maxPolarAngle={Math.PI / 2}
				/>
			</Canvas>
		</MuiBox>
	);
};

export default ThreeScene;
