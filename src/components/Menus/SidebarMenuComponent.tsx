import React from "react";
import { Drawer, List, Typography, Box } from "@mui/material";
import CategoryItemComponent from "./CategoryItemComponent";
import type { SidebarMenuComponentProps } from "../../types";

const SidebarMenuComponent: React.FC<SidebarMenuComponentProps> = ({
	open,
	selectedData,
	onDataToggle,
	onCategoryToggle,
	categories,
}) => {
	return (
		<Drawer
			variant="persistent"
			anchor="left"
			open={open}
			sx={{
				width: 320,
				flexShrink: 0,
				"& .MuiDrawer-paper": {
					width: 320,
					boxSizing: "border-box",
					backgroundColor: "background.paper",
					borderRight: "1px solid",
					borderColor: "divider",
				},
			}}
		>
			{/* Header */}
			<Box
				sx={{
					p: 2,
					borderBottom: "1px solid",
					borderColor: "divider",
				}}
			>
				<Typography variant="h5" fontWeight="bold" gutterBottom>
					🗺️ Geo Viz
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Interactive geographic data visualization
				</Typography>
			</Box>

			{/* Data Sources List */}
			<List sx={{ flex: 1, overflow: "auto", pt: 1 }}>
				{categories.map((category) => (
					<CategoryItemComponent
						key={category.id}
						category={category}
						selectedData={selectedData}
						onDataToggle={onDataToggle}
						onCategoryToggle={onCategoryToggle}
					/>
				))}
			</List>

			{/* Footer */}
			<Box
				sx={{
					p: 2,
					borderTop: "1px solid",
					borderColor: "divider",
				}}
			>
				<Typography
					variant="caption"
					color="text.secondary"
					align="center"
				>
					Select data sources to visualize on the map
				</Typography>
			</Box>
		</Drawer>
	);
};

export default SidebarMenuComponent;
