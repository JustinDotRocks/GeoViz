// Define extent interface
export interface MapExtent {
	xmin: number;
	ymin: number;
	xmax: number;
	ymax: number;
	spatialReference?: {
		wkid?: number;
	};
}

export interface ElevationPoint {
	x: number;
	y: number;
	elevation: number;
}

export interface ElevationData {
	points: ElevationPoint[];
	width: number;
	height: number;
	extent: {
		xmin: number;
		ymin: number;
		xmax: number;
		ymax: number;
	};
}

export class ElevationService {
	private static readonly ELEVATION_SERVICE_URL =
		"https://elevation-api.arcgis.com/arcgis/rest/services/elevation-service/v1/elevation/at-many-points";

	static async getElevationData(
		extent: MapExtent,
		resolution: number = 32
	): Promise<ElevationData> {
		try {
			const { xmin, ymin, xmax, ymax } = extent;
			const points: ElevationPoint[] = [];
			const stepX = (xmax - xmin) / resolution;
			const stepY = (ymax - ymin) / resolution;

			// Prepare up to 100 locations for the API
			const locations: { latitude: number; longitude: number }[] =
				[];
			for (let i = 0; i <= resolution; i++) {
				for (let j = 0; j <= resolution; j++) {
					if (locations.length >= 100) break; // API limit
					const longitude = xmin + i * stepX;
					const latitude = ymin + j * stepY;
					locations.push({ latitude, longitude });
				}
				if (locations.length >= 100) break;
			}

			const API_KEY = import.meta.env.VITE_ARCGIS_ELEVATION_API_KEY;

			console.log("API_KEY:", API_KEY);
			// The API expects a POST with a JSON body
			const response = await fetch(
				this.ELEVATION_SERVICE_URL + `?apiKey=${API_KEY}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						points: locations,
						f: "json",
					}),
				}
			);

			const data = await response.json();

			if (data && data.elevations) {
				const elevations = data.elevations;
				for (let idx = 0; idx < elevations.length; idx++) {
					const { latitude, longitude } = locations[idx];
					const elevation = elevations[idx].elevation;
					points.push({
						x: longitude,
						y: latitude,
						elevation,
					});
				}
			} else {
				console.warn("No elevation data returned from API.");
			}

			return {
				points,
				width: resolution + 1,
				height: resolution + 1,
				extent: { xmin, ymin, xmax, ymax },
			};
		} catch (error) {
			console.error("Error fetching elevation from API:", error);
			return {
				points: [],
				width: resolution + 1,
				height: resolution + 1,
				extent: {
					xmin: extent.xmin,
					ymin: extent.ymin,
					xmax: extent.xmax,
					ymax: extent.ymax,
				},
			};
		}
	}
}
