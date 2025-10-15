import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere } from "@react-three/drei";
import { Box as MuiBox } from "@mui/material";
import * as THREE from "three";

interface ThreeSceneProps {
	data: any;
}

// Animated mesh component
function AnimatedBox() {
	const meshRef = useRef<THREE.Mesh>(null);

	useFrame((state) => {
		if (meshRef.current) {
			meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
			meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
		}
	});

	return (
		<Box ref={meshRef} args={[1, 1, 1]} position={[2, 0, 0]}>
			<meshStandardMaterial color="orange" />
		</Box>
	);
}

// 3D terrain representation
function Terrain({ mapData }: { mapData: any }) {
	const meshRef = useRef<THREE.Mesh>(null);

	useEffect(() => {
		if (meshRef.current && mapData) {
			// Scale based on map zoom level
			const scale = mapData.zoom ? mapData.zoom / 10 : 1;
			meshRef.current.scale.set(scale, scale, scale);
		}
	}, [mapData]);

	return (
		<mesh
			ref={meshRef}
			position={[0, -1, 0]}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<planeGeometry args={[10, 10, 32, 32]} />
			<meshStandardMaterial
				color="#2d5a27"
				wireframe={false}
				transparent
				opacity={0.8}
			/>
		</mesh>
	);
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ data }) => {
	return (
		<MuiBox sx={{ width: "100%", height: "100%", bgcolor: "#121212" }}>
			<Canvas
				camera={{ position: [5, 5, 5], fov: 60 }}
				style={{ width: "100%", height: "100%" }}
			>
				{/* Lighting */}
				<ambientLight intensity={0.6} />
				<directionalLight
					position={[10, 10, 5]}
					intensity={1}
				/>
				<pointLight position={[-10, 10, -10]} intensity={0.5} />

				{/* 3D Objects */}
				<Sphere args={[0.5]} position={[-2, 1, 0]}>
					<meshStandardMaterial color="hotpink" />
				</Sphere>

				<AnimatedBox />

				<Terrain mapData={data} />

				{/* Grid helper */}
				<gridHelper args={[20, 20, "#444444", "#444444"]} />

				{/* Controls */}
				<OrbitControls
					enablePan={true}
					enableZoom={true}
					enableRotate={true}
					minDistance={3}
					maxDistance={20}
				/>
			</Canvas>
		</MuiBox>
	);
};

export default ThreeScene;
