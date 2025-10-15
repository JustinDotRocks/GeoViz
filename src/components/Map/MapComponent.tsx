import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

interface MapComponentProps {
	onDataChange: (data: any) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ onDataChange }) => {
	const mapDiv = useRef<HTMLDivElement>(null);
	const mapRef = useRef<MapView | null>(null);

	useEffect(() => {
		if (mapDiv.current && !mapRef.current) {
			// Create the map
			const map = new Map({
				basemap: "dark-gray-vector",
			});

			// Create the map view
			const view = new MapView({
				container: mapDiv.current,
				map: map,
				center: [-118.244, 34.052], // Los Angeles
				zoom: 10,
			});

			mapRef.current = view;

			// Add a sample feature layer
			const featureLayer = new FeatureLayer({
				url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Landscape_Trees/FeatureServer/0",
			});

			map.add(featureLayer);

			// Listen for view updates and pass data to parent
			view.when(() => {
				view.watch("extent", () => {
					onDataChange({
						center: view.center,
						zoom: view.zoom,
						extent: view.extent,
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
