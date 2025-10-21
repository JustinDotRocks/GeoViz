import { useCallback, useRef } from "react";
import type SceneView from "@arcgis/core/views/SceneView";
import type { ElevationData } from "../utils/elevationService";

// Hook to manage map data updates and notify parent component
export const useMapDataUpdate = (onDataChange: (data: any) => void) => {
	const elevationDataRef = useRef<ElevationData | null>(null);
	const isLoadingRef = useRef<boolean>(false);
	// Function to send current data to parent
	const sendDataUpdate = useCallback(
		(view: SceneView, elevData?: ElevationData) => {
			const currentElevData = elevData || elevationDataRef.current;

			onDataChange({
				center: view.center,
				zoom: view.zoom,
				extent: view.extent,
				elevation: {
					visible: true,
					data: currentElevData,
					loading: isLoadingRef.current,
				},
				weather: {
					visible: true,
					opacity: 0.7,
					type: "clear",
					temperature: 15,
					intensity: 0.5,
				},
			});
		},
		[onDataChange, elevationDataRef, isLoadingRef]
	);
	return { sendDataUpdate, elevationDataRef, isLoadingRef };
};
