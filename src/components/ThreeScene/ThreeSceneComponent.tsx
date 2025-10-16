// import { useRef, useEffect } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, Box, Sphere } from "@react-three/drei";
// import { Box as MuiBox } from "@mui/material";
// import * as THREE from "three";

// interface ThreeSceneProps {
// 	data: any;
// }

// // Animated mesh component
// function AnimatedBox() {
// 	const meshRef = useRef<THREE.Mesh>(null);

// 	useFrame((state) => {
// 		if (meshRef.current) {
// 			meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
// 			meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
// 		}
// 	});

// 	return (
// 		<Box ref={meshRef} args={[1, 1, 1]} position={[2, 0, 0]}>
// 			<meshStandardMaterial color="orange" />
// 		</Box>
// 	);
// }

// // 3D terrain representation
// function Terrain({ mapData }: { mapData: any }) {
// 	const meshRef = useRef<THREE.Mesh>(null);

// 	useEffect(() => {
// 		if (meshRef.current && mapData) {
// 			// Scale based on map zoom level
// 			const scale = mapData.zoom ? mapData.zoom / 10 : 1;
// 			meshRef.current.scale.set(scale, scale, scale);
// 		}
// 	}, [mapData]);

// 	return (
// 		<mesh
// 			ref={meshRef}
// 			position={[0, -1, 0]}
// 			rotation={[-Math.PI / 2, 0, 0]}
// 		>
// 			<planeGeometry args={[10, 10, 32, 32]} />
// 			<meshStandardMaterial
// 				color="#2d5a27"
// 				wireframe={false}
// 				transparent
// 				opacity={0.8}
// 			/>
// 		</mesh>
// 	);
// }

// const ThreeScene: React.FC<ThreeSceneProps> = ({ data }) => {
// 	return (
// 		<MuiBox sx={{ width: "100%", height: "100%", bgcolor: "#121212" }}>
// 			<Canvas
// 				camera={{ position: [5, 5, 5], fov: 60 }}
// 				style={{ width: "100%", height: "100%" }}
// 			>
// 				{/* Lighting */}
// 				<ambientLight intensity={0.6} />
// 				<directionalLight
// 					position={[10, 10, 5]}
// 					intensity={1}
// 				/>
// 				<pointLight position={[-10, 10, -10]} intensity={0.5} />

// 				{/* 3D Objects */}
// 				<Sphere args={[0.5]} position={[-2, 1, 0]}>
// 					<meshStandardMaterial color="hotpink" />
// 				</Sphere>

// 				<AnimatedBox />

// 				<Terrain mapData={data} />

// 				{/* Grid helper */}
// 				<gridHelper args={[20, 20, "#444444", "#444444"]} />

// 				{/* Controls */}
// 				<OrbitControls
// 					enablePan={true}
// 					enableZoom={true}
// 					enableRotate={true}
// 					minDistance={3}
// 					maxDistance={20}
// 				/>
// 			</Canvas>
// 		</MuiBox>
// 	);
// };

// export default ThreeScene;

import { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { Box as MuiBox, Typography } from "@mui/material";
import * as THREE from "three";

interface ThreeSceneProps {
	data: any;
}

// Enhanced terrain with elevation data
function ElevationTerrain({ mapData }: { mapData: any }) {
	const meshRef = useRef<THREE.Mesh>(null);

	// Generate height map based on map data
	const geometry = useMemo(() => {
		const geo = new THREE.PlaneGeometry(20, 20, 64, 64);
		const vertices = geo.attributes.position.array as Float32Array;

		// Simulate elevation data for Newfoundland terrain
		for (let i = 0; i < vertices.length; i += 3) {
			const x = vertices[i];
			const y = vertices[i + 1];

			// Create mountainous terrain pattern
			const elevation =
				Math.sin(x * 0.3) * Math.cos(y * 0.3) * 3 +
				Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2;
			vertices[i + 2] = elevation;
		}

		geo.computeVertexNormals();
		return geo;
	}, []);

	useEffect(() => {
		if (meshRef.current && mapData) {
			const scale = mapData.zoom ? mapData.zoom / 8 : 1;
			meshRef.current.scale.set(scale, scale, scale * 0.5);
		}
	}, [mapData]);

	return (
		<mesh
			ref={meshRef}
			geometry={geometry}
			position={[0, -2, 0]}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<meshStandardMaterial
				color="#8B4513"
				wireframe={false}
				vertexColors={false}
			/>
		</mesh>
	);
}

// Weather overlay visualization
function WeatherOverlay({ weatherData }: { weatherData: any }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (meshRef.current && meshRef.current.material) {
			// Type assertion to tell TypeScript this is a MeshBasicMaterial
			const material = meshRef.current
				.material as THREE.MeshBasicMaterial;

			// Use weather data to influence the animation
			const baseOpacity = weatherData?.opacity || 0.3;
			const weatherIntensity = weatherData?.visible ? 1 : 0.5;

			// Animate weather patterns based on actual weather data
			material.opacity =
				baseOpacity +
				Math.sin(state.clock.elapsedTime * weatherIntensity) *
					0.1;
		}
	});

	// Determine weather color based on data
	const getWeatherColor = () => {
		if (!weatherData) return "#87CEEB"; // Default sky blue

		// You can expand this based on actual weather types
		if (weatherData.type === "rain") return "#4682B4";
		if (weatherData.type === "snow") return "#F0F8FF";
		if (weatherData.type === "fog") return "#708090";
		if (weatherData.temperature < 0) return "#B0E0E6"; // Cold blue

		return "#87CEEB"; // Default
	};

	// Don't render if weather data indicates no weather overlay
	if (weatherData && weatherData.visible === false) {
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
function DataDisplay({ mapData }: { mapData: any }) {
	if (!mapData) return null;

	return (
		<Text
			position={[-8, 8, 0]}
			fontSize={0.8}
			color="white"
			anchorX="left"
			anchorY="top"
		>
			{`Zoom: ${mapData.zoom?.toFixed(1) || "N/A"}\nLat: ${
				mapData.center?.latitude?.toFixed(3) || "N/A"
			}\nLon: ${mapData.center?.longitude?.toFixed(3) || "N/A"}`}
		</Text>
	);
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ data }) => {
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
					Elevation + Weather Visualization
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

				{/* 3D Terrain */}
				<ElevationTerrain mapData={data} />

				{/* Weather overlay */}
				<WeatherOverlay weatherData={data?.weather} />

				{/* Data display */}
				<DataDisplay mapData={data} />

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
