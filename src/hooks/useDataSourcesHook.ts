import { useState, useCallback } from "react";
import { initialCategories } from "../config/initialCategories";

export const useDataSources = () => {
	const [selectedData, setSelectedData] = useState([
		"environment-canada",
		"temperature",
		"precipitation",
		"nrcan-elevation",
	]);
	const [categories, setCategories] = useState(initialCategories);

	// Helper functions
	const isEnvironmentCanadaEnabled = useCallback(
		() => selectedData.includes("environment-canada"),
		[selectedData]
	);

	const isTemperatureEnabled = useCallback(
		() =>
			selectedData.includes("temperature") &&
			isEnvironmentCanadaEnabled(),
		[selectedData, isEnvironmentCanadaEnabled]
	);

	const isPrecipitationEnabled = useCallback(
		() =>
			selectedData.includes("precipitation") &&
			isEnvironmentCanadaEnabled(),
		[selectedData, isEnvironmentCanadaEnabled]
	);

	// Enhanced data toggle handler for nested controls
	const handleDataToggle = (dataId: string) => {
		if (dataId === "environment-canada") {
			// If toggling Environment Canada off, remove all weather sub-items
			if (selectedData.includes("environment-canada")) {
				setSelectedData((prev) =>
					prev.filter(
						(id) =>
							![
								"environment-canada",
								"temperature",
								"precipitation",
							].includes(id)
					)
				);
			} else {
				// If toggling Environment Canada on, add it but don't auto-enable sub-items
				setSelectedData((prev) => [
					...prev,
					"environment-canada",
				]);
			}
		} else if (["temperature", "precipitation"].includes(dataId)) {
			// Individual weather data toggles
			if (isEnvironmentCanadaEnabled()) {
				setSelectedData((prev) =>
					prev.includes(dataId)
						? prev.filter((id) => id !== dataId)
						: [...prev, dataId]
				);
			}
		} else {
			// Regular toggle for other data sources
			setSelectedData((prev) =>
				prev.includes(dataId)
					? prev.filter((id) => id !== dataId)
					: [...prev, dataId]
			);
		}
	};

	const handleCategoryToggle = (categoryId: string) => {
		setCategories((prev) =>
			prev.map((cat) =>
				cat.id === categoryId
					? { ...cat, expanded: !cat.expanded }
					: cat
			)
		);
	};

	return {
		selectedData,
		setSelectedData,
		categories,
		setCategories,
		isEnvironmentCanadaEnabled,
		isTemperatureEnabled,
		isPrecipitationEnabled,
		handleDataToggle,
		handleCategoryToggle,
	};
};
