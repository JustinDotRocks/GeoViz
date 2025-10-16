import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";

interface MapComponentProps {
	onDataChange: (data: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onDataChange }) => {
	const mapDiv = useRef<HTMLDivElement>(null);
	const mapRef = useRef<MapView | null>(null);

	useEffect(() => {
		if (mapDiv.current && !mapRef.current) {
			// Create the map with terrain basemap
			const map = new Map({
				basemap: "terrain",
				ground: "world-elevation",
			});

			// Create the map view
			const view = new MapView({
				container: mapDiv.current,
				map: map,
				center: [-54.595, 48.955], //Gander Newfoundland, Canada
				zoom: 6,
			});

			mapRef.current = view;

			// Add elevation layer for detailed terrain
			const elevationLayer = new ElevationLayer({
				url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
			});
			map.ground.layers.add(elevationLayer);

			// Add weather imagery layer
			const weatherLayer = new ImageryTileLayer({
				url: "https://services.arcgisonline.com/arcgis/rest/services/Specialty/World_Weather_Service/MapServer",
				title: "Weather Data",
				opacity: 0.7,
			});
			map.add(weatherLayer);

			// Add Newfoundland specific elevation data if available
			const nfldElevation = new FeatureLayer({
				url: "https://services1.arcgis.com/vdNDkVykv9vEWFX4/arcgis/rest/services/CanadianTopography/FeatureServer/0",
				title: "Canadian Elevation",
				visible: true,
			});
			map.add(nfldElevation);

			// Add a sample feature layer

			// const featureLayer = new FeatureLayer({
			// 	url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
			// });

			// map.add(featureLayer);

			// Listen for view updates and pass data to parent
			view.when(() => {
				view.watch(["extent", "zoom", "center"], () => {
					onDataChange({
						center: view.center,
						zoom: view.zoom,
						extent: view.extent,
						elevation: {
							visible: true,
							layer: elevationLayer,
						},
						weather: {
							visible: weatherLayer.visible,
							opacity: weatherLayer.opacity,
						},
					});
				});
			});

			return () => {
				if (mapRef.current) {
					mapRef.current.destroy();
					mapRef.current = null;
				}
			};
		}
	}, [onDataChange]);

	return (
		<Box sx={{ width: "100%", height: "100%", position: "relative" }}>
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
