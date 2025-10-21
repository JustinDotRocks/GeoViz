import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import ObjectSymbol3DLayer from "@arcgis/core/symbols/ObjectSymbol3DLayer";
import PointSymbol3D from "@arcgis/core/symbols/PointSymbol3D";

// Function to create 3D weather graphics
const createWeatherGraphics = (weatherData: any) => {
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
	console.log("Temperature value for rendering:", weatherData.temperature);
	console.log("Raw temperature type:", typeof weatherData.temperature);

	const precipitationValue = weatherData.precipitation || 0;
	const actualTemp = weatherData.temperature || 0;

	// Check individual visibility flags
	const showTemperature = weatherData.showTemperature;
	const showPrecipitation = weatherData.showPrecipitation;

	console.log("Individual toggles:", {
		showTemperature,
		showPrecipitation,
		temperature: actualTemp,
		precipitation: precipitationValue,
	});

	const graphics = [];

	// Only create precipitation graphic if enabled AND has data
	if (showPrecipitation) {
		const basePrecipitationHeight = 2000;
		const precipitationScaling = 10000;
		const precipitationHeight =
			basePrecipitationHeight +
			precipitationValue * precipitationScaling;
		const offsetDistance = 0.05;
		const precipitationLon = longitude - offsetDistance;

		const precipitationGraphic = new Graphic({
			geometry: new Point({
				longitude: precipitationLon,
				latitude: latitude,
				z: precipitationHeight / 2,
			}),
			symbol: new PointSymbol3D({
				symbolLayers: [
					new ObjectSymbol3DLayer({
						resource: { primitive: "cylinder" },
						material: {
							color:
								precipitationValue > 0
									? [70, 130, 180, 0.8] // Blue for actual precipitation
									: [128, 128, 128, 0.5], // Gray for no data
						},
						height: precipitationHeight,
						width: Math.max(
							3000,
							precipitationHeight / 1.5
						),
						depth: Math.max(
							200,
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
                <b>Precipitation:</b> ${
				precipitationValue > 0
					? precipitationValue + " mm"
					: "No data"
			}<br>
                <b>Height:</b> ${precipitationHeight.toFixed(0)} units<br>
                <b>Status:</b> ${
				precipitationValue > 0
					? "Active precipitation"
					: "No precipitation recorded"
			}
            `,
			},
		});
		graphics.push(precipitationGraphic);
		console.log(
			`Created precipitation cylinder - enabled: ${showPrecipitation}, value: ${precipitationValue}`
		);
	} else {
		console.log(
			`Skipped precipitation - enabled: ${showPrecipitation}, value: ${precipitationValue}`
		);
	}

	// Only create temperature graphic if enabled
	if (showTemperature) {
		const temperatureSize = Math.max(8000, Math.abs(actualTemp) * 800);
		const offsetDistance = 0.05;
		const temperatureLon = longitude + offsetDistance;

		const tempColor =
			actualTemp < 0
				? [135, 206, 235] // Light blue for cold
				: actualTemp > 15
				? [255, 107, 53] // Orange for warm
				: [70, 130, 180]; // Default blue

		const temperatureGraphic = new Graphic({
			geometry: new Point({
				longitude: temperatureLon,
				latitude: latitude,
				z: temperatureSize,
			}),
			symbol: new PointSymbol3D({
				symbolLayers: [
					new ObjectSymbol3DLayer({
						resource: { primitive: "sphere" },
						material: {
							color: [...tempColor, 0.9],
						},
						width: temperatureSize,
						height: temperatureSize,
						depth: temperatureSize,
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
                    <b>Size:</b> ${temperatureSize.toFixed(0)} units<br>
                    <b>Color and size represent temperature</b>
                `,
			},
		});
		graphics.push(temperatureGraphic);
		console.log(
			`Created temperature sphere - enabled: ${showTemperature}, value: ${actualTemp}°C`
		);
	} else {
		console.log(
			`Skipped temperature - enabled: ${showTemperature}, value: ${actualTemp}°C`
		);
	}

	console.log(
		"Final graphics array:",
		graphics.map((g) => ({
			type: g.attributes.type,
			value: g.attributes.value,
		}))
	);
	return graphics;
};
export default createWeatherGraphics;
