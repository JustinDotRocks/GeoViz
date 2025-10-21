import React from "react";
import {
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
	Collapse,
	List,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import type { CategoryItemProps } from "../../types";
import DataSourceItem from "./DataSourceItemComponent";

// Component to render a single category item with its data sources
const CategoryItemComponent: React.FC<CategoryItemProps> = ({
	category,
	selectedData,
	onDataToggle,
	onCategoryToggle,
}) => {
	const isParentEnabled = (parentId: string) =>
		selectedData.includes(parentId);
	const isSubSourceEnabled = (subSourceId: string, parentId: string) =>
		selectedData.includes(subSourceId) && isParentEnabled(parentId);

	return (
		<React.Fragment key={category.id}>
			{/* Category Header */}
			<ListItemButton
				onClick={() => onCategoryToggle(category.id)}
				sx={{
					py: 1.5,
					borderRadius: 1,
					mx: 1,
					mb: 0.5,
					"&:hover": {
						backgroundColor: "action.hover",
					},
				}}
			>
				<ListItemIcon sx={{ minWidth: 40 }}>
					{category.icon}
				</ListItemIcon>
				<ListItemText
					primary={
						<Typography
							variant="h6"
							fontSize="1rem"
							fontWeight="bold"
						>
							{category.title}
						</Typography>
					}
				/>
				{category.expanded ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>

			{/* Category Content */}
			<Collapse in={category.expanded} timeout="auto" unmountOnExit>
				<List component="div" disablePadding sx={{ mb: 1 }}>
					{category.sources.map((source) => (
						<DataSourceItem
							key={source.id}
							source={source}
							categoryExpanded={category.expanded}
							selectedData={selectedData}
							onDataToggle={onDataToggle}
							isParentEnabled={isParentEnabled}
							isSubSourceEnabled={
								isSubSourceEnabled
							}
						/>
					))}
				</List>
			</Collapse>

			<Divider sx={{ my: 1, mx: 2 }} />
		</React.Fragment>
	);
};

export default CategoryItemComponent;
