import { useCallback } from "react";
import type { RefObject } from "react";
import type SceneView from "@arcgis/core/views/SceneView";
import type { ElevationData } from "../utils/elevationService";
import { ElevationService } from "../utils/elevationService";

// Hook to manage elevation data fetching based on map extent
export const useElevationData = (
	elevationDataRef: RefObject<ElevationData | null>,
	isLoadingRef: RefObject<boolean>,
	sendDataUpdate: (view: SceneView, elevData?: ElevationData) => void
) => {
	// Function to fetch elevation data for current extent
	const fetchElevationData = useCallback(
		async (view: SceneView) => {
			if (!view.extent) return;

			isLoadingRef.current = true;

			try {
				console.log(
					"Fetching elevation data for extent:",
					view.extent
				);
				// Create a proper MapExtent object that matches the interface
				const extentForService = {
					xmin: view.extent.xmin,
					ymin: view.extent.ymin,
					xmax: view.extent.xmax,
					ymax: view.extent.ymax,
					spatialReference: {
						wkid:
							view.extent.spatialReference?.wkid ||
							3857, // Handle undefined wkid
					},
				};

				const elevData =
					await ElevationService.getElevationData(
						extentForService,
						32
					);
				console.log(
					"Successfully fetched elevation data:",
					elevData
				);

				// Store in ref for immediate access
				elevationDataRef.current = elevData;

				// Send update with new elevation data
				sendDataUpdate(view, elevData);
			} catch (error) {
				console.error("Error fetching elevation:", error);
			} finally {
				isLoadingRef.current = false;
			}
		},
		[sendDataUpdate, elevationDataRef, isLoadingRef]
	);
	return { fetchElevationData };
};
