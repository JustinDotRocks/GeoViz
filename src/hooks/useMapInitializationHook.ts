import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

export const useMapInitialization = (
	mapDiv: RefObject<HTMLDivElement | null>,
	fetchElevationData: (view: SceneView) => void,
	sendDataUpdate: (view: SceneView) => void
) => {
	const mapRef = useRef<SceneView | null>(null);
	const weatherLayerRef = useRef<GraphicsLayer | null>(null);

	useEffect(() => {
		if (mapDiv.current && !mapRef.current) {
			// Create simple map without problematic services
			const map = new Map({
				basemap: "terrain",
				ground: "world-elevation", //  Enable 3D terrain
			});

			//  Create weather graphics layer
			const weatherLayer = new GraphicsLayer({
				title: "Weather Data",
			});
			map.add(weatherLayer);
			weatherLayerRef.current = weatherLayer;

			//  Create SceneView instead of MapView
			const view = new SceneView({
				container: mapDiv.current,
				map: map,
				center: [-56.5, 47.5], // Newfoundland center
				zoom: 6,
				camera: {
					//  Set 3D camera position
					position: {
						longitude: -52.7126, // St. John's longitude
						latitude: 45.5615,
						z: 200000, // Height in meters
					},
					tilt: 45, // Angle for 3D view
				},
			});

			mapRef.current = view;

			// Initial elevation data fetch
			view.when(() => {
				console.log(
					"Map view ready, fetching initial elevation data"
				);
				fetchElevationData(view);

				// Listen for extent changes and fetch new elevation data
				let timeoutId: number;
				view.watch("extent", () => {
					console.log(
						"Extent changed, scheduling elevation fetch"
					);
					clearTimeout(timeoutId);
					timeoutId = setTimeout(() => {
						fetchElevationData(view);
					}, 1500);
				});

				// Listen for zoom changes and send current data
				view.watch("zoom", () => {
					console.log("Zoom changed, sending data update");
					sendDataUpdate(view);
				});
			});

			return () => {
				if (mapRef.current) {
					mapRef.current.destroy();
					mapRef.current = null;
				}
			};
		}
	}, [fetchElevationData, sendDataUpdate, mapDiv]);

	return { mapRef, weatherLayerRef };
};
