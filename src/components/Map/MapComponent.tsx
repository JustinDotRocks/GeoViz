import { useEffect, useRef, useCallback } from "react";
import { Box } from "@mui/material";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import ObjectSymbol3DLayer from "@arcgis/core/symbols/ObjectSymbol3DLayer";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";
import { ElevationService } from "../../utils/elevationService";
import type { ElevationData } from "../../utils/elevationService";

interface MapComponentProps {
	onDataChange: (data: any) => void;
	weatherData?: any;
	selectedData?: string[];
	showTerrain?: boolean;
	showWeather?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
	onDataChange,
	weatherData,
	selectedData,
	showTerrain,
	showWeather,
}) => {
	const mapDiv = useRef<HTMLDivElement>(null);
	const mapRef = useRef<SceneView | null>(null);
	const elevationDataRef = useRef<ElevationData | null>(null);
	const isLoadingRef = useRef<boolean>(false);
	const weatherLayerRef = useRef<GraphicsLayer | null>(null);

	// Log the received props for debugging
	console.log("MapComponent received:", {
		weatherData,
		selectedData,
		showTerrain,
		showWeather,
	});

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
		[onDataChange]
	);

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
		[sendDataUpdate]
	);

	// ADD: Function to create 3D weather graphics
	const createWeatherGraphics = useCallback((weatherData: any) => {
		console.log("createWeatherGraphics called with:", weatherData);

		if (!weatherData || !weatherData.coordinates) {
			console.log("No weather data or coordinates:", {
				weatherData,
				coordinates: weatherData?.coordinates,
			});
			return [];
		}

		const [longitude, latitude] = weatherData.coordinates;
		console.log("Using coordinates:", { longitude, latitude });

		// Log the actual temperature value being used
		console.log(
			"Temperature value for rendering:",
			weatherData.temperature
		);
		console.log(
			"Raw temperature type:",
			typeof weatherData.temperature
		);

		const precipitationValue = weatherData.precipitation || 0;
		const actualTemp = weatherData.temperature || 0;

		// Log the actual temperature value being used// Base height of 2000, then add scaled precipitation amount
		const basePrecipitationHeight = 2000; // Minimum visible height
		const precipitationScaling = 10000; // Scale factor for precipitation
		const precipitationHeight =
			basePrecipitationHeight +
			precipitationValue * precipitationScaling;

		const temperatureSize = Math.max(2000, Math.abs(actualTemp) * 200); // Increased scaling

		// Create offset coordinates to prevent overlap
		const offsetDistance = 0.05; // Degrees offset for separation
		const precipitationLon = longitude - offsetDistance; // West of center
		const temperatureLon = longitude + offsetDistance; // East of center

		// Create precipitation bar (cylinder)
		const precipitationGraphic = new Graphic({
			geometry: new Point({
				longitude: precipitationLon, //Offset to west
				latitude: latitude,
				z: precipitationHeight / 2, // Position at half height
			}),
			symbol: new PointSymbol3D({
				symbolLayers: [
					new ObjectSymbol3DLayer({
						resource: { primitive: "cylinder" },
						material: { color: [70, 130, 180, 0.8] }, // Steel blue for precipitation
						height: precipitationHeight,
						width: Math.max(
							8000,
							precipitationHeight / 1.5
						), //  Updates the base side of the shape
						depth: Math.max(
							8000,
							precipitationHeight / 1.5
						),
					}),
				],
			}),
			attributes: {
				type: "precipitation",
				value: precipitationValue,
				station: weatherData.station || "Unknown",
			},
			popupTemplate: {
				title: "Precipitation Data",
				content: `
                    <b>Station:</b> {station}<br>
                    <b>Precipitation:</b> {value} mm<br>
                    <b>Height represents precipitation amount</b>
                `,
			},
		});

		// Log calculated values
		console.log("Calculated values:", {
			precipitationHeight,
			temperatureSize,
			actualTemp: weatherData.temperature,
		});

		const tempColor =
			actualTemp < 0
				? [135, 206, 235] // Light blue for cold
				: actualTemp > 15
				? [255, 107, 53] // Orange for warm
				: [70, 130, 180]; // Default blue

		const temperatureGraphic = new Graphic({
			geometry: new Point({
				longitude: temperatureLon, //  Offset to east
				latitude: latitude,
				z: temperatureSize, // Position based on its own size, not stacked
			}),
			symbol: new PointSymbol3D({
				symbolLayers: [
					new ObjectSymbol3DLayer({
						resource: { primitive: "sphere" },
						material: { color: [...tempColor, 0.9] },
						width: temperatureSize * 4, // INCREASED: Double the size
						height: temperatureSize * 4,
						depth: temperatureSize * 4,
					}),
				],
			}),
			attributes: {
				type: "temperature",
				value: actualTemp,
				station: weatherData.station || "Unknown",
			},
			popupTemplate: {
				title: "Temperature Data",
				content: `
                    <b>Station:</b> {station}<br>
                    <b>Temperature:</b> {value}°C<br>
                    <b>Color and size represent temperature</b>
                `,
			},
		});

		console.log(
			"Created temperature graphic with attributes:",
			temperatureGraphic.attributes
		);

		return [precipitationGraphic, temperatureGraphic];
	}, []);

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
	}, [fetchElevationData, sendDataUpdate]);

	//  Effect to handle weather data changes
	useEffect(() => {
		if (
			mapRef.current &&
			weatherLayerRef.current &&
			weatherData &&
			showWeather
		) {
			console.log(
				"Adding weather visualization to map:",
				weatherData
			);

			// Clear existing weather graphics
			weatherLayerRef.current.removeAll();

			// Create and add new weather graphics
			const weatherGraphics = createWeatherGraphics(weatherData);
			weatherLayerRef.current.addMany(weatherGraphics);

			console.log(
				`Added ${weatherGraphics.length} weather graphics to map`
			);
		} else if (weatherLayerRef.current && !showWeather) {
			// Clear weather graphics when toggled off
			weatherLayerRef.current.removeAll();
		}
	}, [weatherData, showWeather, createWeatherGraphics]);

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
