import { useRef, useMemo } from "react";
import * as THREE from "three";
import type { ElevationData } from "../../utils/elevationService";

interface ElevationTerrainProps {
	elevationData: ElevationData | null;
	visible?: boolean;
	wireframe?: boolean;
	color?: string;
}

const ElevationTerrain: React.FC<ElevationTerrainProps> = ({
	elevationData,
	visible = true,
	wireframe = false,
	color = "#4a5d23",
}) => {
	const meshRef = useRef<THREE.Mesh>(null);

	// Generate geometry from real elevation data
	const geometry = useMemo(() => {
		if (!elevationData) {
			console.log("No elevation data available");
			return new THREE.PlaneGeometry(20, 20, 32, 32);
		}

		// Use the REAL elevation data from your service
		const { points, width, height } = elevationData;
		console.log("Using real elevation data:", {
			width,
			height,
			pointsCount: points.length,
		});

		// Debug: log the actual elevation values we're getting
		const elevations = points.map((p) => p.elevation);
		const minElevation = Math.min(...elevations);
		const maxElevation = Math.max(...elevations);
		const avgElevation =
			elevations.reduce((a, b) => a + b, 0) / elevations.length;

		console.log("Real elevation stats:", {
			min: minElevation.toFixed(1),
			max: maxElevation.toFixed(1),
			avg: avgElevation.toFixed(1),
			range: (maxElevation - minElevation).toFixed(1),
		});

		// Create the terrain geometry
		const geo = new THREE.PlaneGeometry(20, 20, width - 1, height - 1);
		const vertices = geo.attributes.position.array as Float32Array;

		// Correctly map elevation data to vertices
		// The key issue: PlaneGeometry vertices are arranged differently than our points array
		for (let row = 0; row < height; row++) {
			for (let col = 0; col < width; col++) {
				// Calculate indices correctly
				const pointIndex = row * width + col;
				const vertexIndex =
					((height - 1 - row) * width + col) * 3; // Flip Y for correct orientation

				if (
					pointIndex < points.length &&
					vertexIndex + 2 < vertices.length
				) {
					const point = points[pointIndex];

					// Scale the real elevation data for 3D visualization
					// Your elevation service gives values in meters, scale appropriately
					const scaledElevation = point.elevation / 100; // Scale 800m max to 8 units max

					vertices[vertexIndex + 2] = scaledElevation;

					// Log a few examples
					if (pointIndex < 10) {
						console.log(
							`Point [${row},${col}]: ${point.elevation}m → ${scaledElevation} units`
						);
					}
				}
			}
		}

		console.log("Applied real elevation data to terrain geometry");
		geo.computeVertexNormals();
		return geo;
	}, [elevationData]);

	// Use the real elevation data for color mapping
	const getTerrainColor = useMemo(() => {
		if (!elevationData) return color;

		const elevations = elevationData.points.map((p) => p.elevation);
		const maxElevation = Math.max(...elevations);

		// Color based on REAL elevation values
		if (maxElevation > 400) return "#8B4513"; // Brown for mountains (400m+)
		if (maxElevation > 200) return "#4a5d23"; // Dark green for hills (200-400m)
		if (maxElevation > 100) return "#6B8E23"; // Olive for rolling terrain (100-200m)
		return "#228B22"; // Green for low areas (<100m)
	}, [elevationData, color]);

	if (!visible) return null;

	return (
		<mesh
			ref={meshRef}
			geometry={geometry}
			position={[0, -2, 0]}
			rotation={[-Math.PI / 2, 0, 0]}
		>
			<meshStandardMaterial
				color={getTerrainColor}
				wireframe={wireframe}
				vertexColors={false}
				side={THREE.DoubleSide}
				roughness={0.8}
				metalness={0.1}
			/>
		</mesh>
	);
};

export default ElevationTerrain;
