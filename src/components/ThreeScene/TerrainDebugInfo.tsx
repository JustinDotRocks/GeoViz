import { Text } from "@react-three/drei";
import type { ElevationData } from "../../utils/elevationService";

interface TerrainDebugInfoProps {
	elevationData: ElevationData | null;
	position?: [number, number, number];
}

const TerrainDebugInfo: React.FC<TerrainDebugInfoProps> = ({
	elevationData,
	position = [5, 6, 0],
}) => {
	if (!elevationData) return null;

	const elevations = elevationData.points.map((p) => p.elevation);
	const minElev = Math.min(...elevations);
	const maxElev = Math.max(...elevations);
	const avgElev = elevations.reduce((a, b) => a + b, 0) / elevations.length;

	return (
		<Text
			position={position}
			fontSize={0.4}
			color="yellow"
			anchorX="left"
			anchorY="top"
		>
			{`Terrain Debug:
Min: ${minElev.toFixed(1)}m
Max: ${maxElev.toFixed(1)}m
Avg: ${avgElev.toFixed(1)}m
Points: ${elevations.length}`}
		</Text>
	);
};

export default TerrainDebugInfo;
