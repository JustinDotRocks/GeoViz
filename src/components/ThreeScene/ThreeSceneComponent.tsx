import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Box as MuiBox, Typography } from "@mui/material";
import * as THREE from "three";
import ElevationTerrain from "./ElevationTerrain";
import TerrainDebugInfo from "./TerrainDebugInfo";

interface ThreeSceneProps {
	data: any;
	selectedData?: string[];
	showTerrain: boolean;
}

// Weather overlay visualization
function WeatherOverlay({
	weatherData,
	visible = true,
}: {
	weatherData: any;
	visible?: boolean;
}) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (meshRef.current && meshRef.current.material && visible) {
			const material = meshRef.current
				.material as THREE.MeshBasicMaterial;
			const baseOpacity = weatherData?.opacity || 0.3;
			const weatherIntensity = weatherData?.visible ? 1 : 0.5;
			material.opacity =
				baseOpacity +
				Math.sin(state.clock.elapsedTime * weatherIntensity) *
					0.1;
		}
	});

	const getWeatherColor = () => {
		if (!weatherData) return "#87CEEB";
		if (weatherData.type === "rain") return "#4682B4";
		if (weatherData.type === "snow") return "#F0F8FF";
		if (weatherData.type === "fog") return "#708090";
		if (weatherData.temperature < 0) return "#B0E0E6";
		return "#87CEEB";
	};

	if (!visible || (weatherData && weatherData.visible === false)) {
		return null;
	}

	return (
		<mesh
			ref={meshRef}
			position={[0, 2, 0]}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<planeGeometry args={[25, 25]} />
			<meshBasicMaterial
				color={getWeatherColor()}
				transparent
				opacity={weatherData?.opacity || 0.3}
			/>
		</mesh>
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
}) => {
	// Determine what to show based on selected data
	// const showElevation = selectedData.includes("nrcan-elevation");
	const showWeather = selectedData.includes("environment-canada");

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

				{/* Real 3D Terrain - extracted component */}
				{/* <ElevationTerrain
					elevationData={data?.elevation?.data || null}
					visible={
						showElevation || selectedData.length === 0
					}
					wireframe={false}
				/> */}
				{/* Only render terrain if showTerrain is true */}
				{showTerrain && (
					<ElevationTerrain
						elevationData={data?.elevationData}
						visible={true}
						// ...other props...
					/>
				)}

				{/* Weather overlay */}
				<WeatherOverlay
					weatherData={data?.weather}
					visible={showWeather}
				/>

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
