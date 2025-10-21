import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import type { MapComponentProps } from "../../types";
import { useMapDataUpdate } from "../../hooks/useMapDataUpdateHook";
import { useElevationData } from "../../hooks/useElevationDataHook";
import { useMapInitialization } from "../../hooks/useMapInitializationHook";
import { useWeatherVisualization } from "../../hooks/useWeatherVisualizationHook";

const MapComponent: React.FC<MapComponentProps> = ({
	onDataChange,
	weatherData,
	showTerrain,
	showWeather,
}) => {
	// Ref for the map container div
	const mapDiv = useRef<HTMLDivElement>(null);

	// Use custom hook for data updates
	const { sendDataUpdate, elevationDataRef, isLoadingRef } =
		useMapDataUpdate(onDataChange);

	// Use the elevation data hook
	const { fetchElevationData } = useElevationData(
		elevationDataRef,
		isLoadingRef,
		sendDataUpdate
	);

	const { mapRef, weatherLayerRef } = useMapInitialization(
		mapDiv,
		fetchElevationData,
		sendDataUpdate
	);
	useWeatherVisualization(
		mapRef,
		weatherLayerRef,
		weatherData,
		showWeather || false
	);

	// Effect to handle terrain data changes
	useEffect(() => {
		if (mapRef.current && showTerrain) {
			console.log("Adding terrain visualization to map");
			// TODO: Add additional terrain graphics if needed
		}
	}, [showTerrain]);

	return (
		<Box sx={{ width: "100%", height: "100%", position: "relative" }}>
			{isLoadingRef.current && (
				<Box
					sx={{
						position: "absolute",
						top: 16,
						right: 16,
						zIndex: 1000,
						bgcolor: "rgba(0, 0, 0, 0.7)",
						color: "white",
						p: 1,
						borderRadius: 1,
					}}
				>
					Loading elevation data...
				</Box>
			)}
			<div
				ref={mapDiv}
				style={{
					width: "100%",
					height: "100%",
				}}
			/>
		</Box>
	);
};

export default MapComponent;
