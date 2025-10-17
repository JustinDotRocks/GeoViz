// import { useEffect, useRef, useState } from "react";
// import { Box } from "@mui/material";
// import Map from "@arcgis/core/Map";
// import MapView from "@arcgis/core/views/MapView";
// import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
// import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
// import { ElevationService } from "../../utils/elevationService";
// import type { ElevationData } from "../../utils/elevationService";

// interface MapComponentProps {
// 	onDataChange: (data: any) => void;
// }

// const MapComponent: React.FC<MapComponentProps> = ({ onDataChange }) => {
// 	const mapDiv = useRef<HTMLDivElement>(null);
// 	const mapRef = useRef<MapView | null>(null);
// 	const [elevationData, setElevationData] = useState<ElevationData | null>(
// 		null
// 	);
// 	const [isLoadingElevation, setIsLoadingElevation] = useState(false);

// 	// Function to fetch elevation data for current extent
// 	const fetchElevationData = async (view: MapView) => {
// 		if (!view.extent) return;

// 		setIsLoadingElevation(true);
// 		try {
// 			const elevData = await ElevationService.getElevationData(
// 				view.extent,
// 				64
// 			);
// 			setElevationData(elevData);

// 			// Pass elevation data to parent
// 			onDataChange({
// 				center: view.center,
// 				zoom: view.zoom,
// 				extent: view.extent,
// 				elevation: {
// 					visible: true,
// 					data: elevData,
// 					loading: false,
// 				},
// 				weather: {
// 					visible: true,
// 					opacity: 0.7,
// 					type: "mixed",
// 					temperature: Math.random() * 20 - 10,
// 					intensity: Math.random(),
// 				},
// 			});
// 		} catch (error) {
// 			console.error("Error fetching elevation:", error);
// 		} finally {
// 			setIsLoadingElevation(false);
// 		}
// 	};

// 	useEffect(() => {
// 		if (mapDiv.current && !mapRef.current) {
// 			// Create the map with terrain basemap
// 			const map = new Map({
// 				basemap: "terrain",
// 				ground: "world-elevation",
// 			});

// 			// Create the map view
// 			const view = new MapView({
// 				container: mapDiv.current,
// 				map: map,
// 				center: [-56.5, 47.5], // Newfoundland center
// 				zoom: 7,
// 			});

// 			mapRef.current = view;

// 			// Add elevation layer for detailed terrain
// 			const elevationLayer = new ElevationLayer({
// 				url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
// 			});
// 			map.ground.layers.add(elevationLayer);

// 			// Add weather imagery layer
// 			const weatherLayer = new ImageryTileLayer({
// 				url: "https://services.arcgisonline.com/arcgis/rest/services/Specialty/World_Weather_Service/MapServer",
// 				title: "Weather Data",
// 				opacity: 0.7,
// 			});
// 			map.add(weatherLayer);

// 			// Initial elevation data fetch
// 			view.when(() => {
// 				fetchElevationData(view);

// 				// Listen for extent changes and fetch new elevation data
// 				let timeoutId: number;
// 				view.watch("extent", () => {
// 					// Debounce elevation fetching to avoid too many requests
// 					clearTimeout(timeoutId);
// 					timeoutId = setTimeout(() => {
// 						fetchElevationData(view);
// 					}, 1000);
// 				});

// 				// Also listen for zoom changes
// 				view.watch("zoom", () => {
// 					onDataChange({
// 						center: view.center,
// 						zoom: view.zoom,
// 						extent: view.extent,
// 						elevation: {
// 							visible: true,
// 							data: elevationData,
// 							loading: isLoadingElevation,
// 						},
// 						weather: {
// 							visible: weatherLayer.visible,
// 							opacity: weatherLayer.opacity,
// 							type: "mixed",
// 							temperature: Math.random() * 20 - 10,
// 							intensity: Math.random(),
// 						},
// 					});
// 				});
// 			});

// 			return () => {
// 				if (mapRef.current) {
// 					mapRef.current.destroy();
// 					mapRef.current = null;
// 				}
// 			};
// 		}
// 	}, [elevationData, isLoadingElevation, onDataChange]);

// 	return (
// 		<Box sx={{ width: "100%", height: "100%", position: "relative" }}>
// 			{isLoadingElevation && (
// 				<Box
// 					sx={{
// 						position: "absolute",
// 						top: 16,
// 						right: 16,
// 						zIndex: 1000,
// 						bgcolor: "rgba(0, 0, 0, 0.7)",
// 						color: "white",
// 						p: 1,
// 						borderRadius: 1,
// 					}}
// 				>
// 					Loading elevation data...
// 				</Box>
// 			)}
// 			<div
// 				ref={mapDiv}
// 				style={{
// 					width: "100%",
// 					height: "100%",
// 				}}
// 			/>
// 		</Box>
// 	);
// };

// export default MapComponent;
import { useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import { ElevationService } from "../../utils/elevationService";
import type { ElevationData } from "../../utils/elevationService";

interface MapComponentProps {
	onDataChange: (data: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onDataChange }) => {
	const mapDiv = useRef<HTMLDivElement>(null);
	const mapRef = useRef<MapView | null>(null);
	const elevationDataRef = useRef<ElevationData | null>(null);
	const isLoadingRef = useRef<boolean>(false);

	// Function to send current data to parent
	const sendDataUpdate = useCallback(
		(view: MapView, elevData?: ElevationData) => {
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
		[onDataChange]
	);

	// Function to fetch elevation data for current extent
	const fetchElevationData = useCallback(
		async (view: MapView) => {
			if (!view.extent) return;

			isLoadingRef.current = true;

			try {
				console.log(
					"Fetching elevation data for extent:",
					view.extent
				);
				// CHANGE: Create a proper MapExtent object that matches the interface
				const extentForService = {
					xmin: view.extent.xmin,
					ymin: view.extent.ymin,
					xmax: view.extent.xmax,
					ymax: view.extent.ymax,
					spatialReference: {
						wkid:
							view.extent.spatialReference?.wkid ||
							3857, // CHANGE: Handle undefined wkid
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
		[sendDataUpdate]
	);

	useEffect(() => {
		if (mapDiv.current && !mapRef.current) {
			// Create simple map without problematic services
			const map = new Map({
				basemap: "terrain",
			});

			// Create the map view
			const view = new MapView({
				container: mapDiv.current,
				map: map,
				center: [-56.5, 47.5], // Newfoundland center
				zoom: 7,
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
	}, [fetchElevationData, sendDataUpdate]);

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
