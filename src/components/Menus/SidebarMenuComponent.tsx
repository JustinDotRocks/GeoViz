import React from "react";
import {
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Switch,
	Typography,
	Divider,
	Box,
	Chip,
	Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface DataSource {
	id: string;
	label: string;
	icon: React.ReactElement;
	description: string;
	enabled: boolean;
}

interface DataCategory {
	id: string;
	title: string;
	icon: React.ReactElement;
	sources: DataSource[];
	expanded: boolean;
}

interface SidebarMenuComponentProps {
	open: boolean;
	selectedData: string[];
	onDataToggle: (dataId: string) => void;
	onCategoryToggle: (categoryId: string) => void;
	categories: DataCategory[];
}

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
					bgcolor: "rgba(18, 18, 18, 0.95)",
					backdropFilter: "blur(10px)",
					borderRight: "1px solid rgba(255, 255, 255, 0.1)",
				},
			}}
		>
			<Box sx={{ p: 2 }}>
				<Typography variant="h6" sx={{ color: "white", mb: 2 }}>
					📊 Data Layers
				</Typography>
				<Typography
					variant="body2"
					sx={{ color: "gray", mb: 2 }}
				>
					Select data to visualize on Newfoundland map
				</Typography>
			</Box>

			<Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }} />

			<List sx={{ pt: 0 }}>
				{categories.map((category) => (
					<React.Fragment key={category.id}>
						{/* Category Header */}
						<ListItemButton
							onClick={() =>
								onCategoryToggle(category.id)
							}
							sx={{
								bgcolor: "rgba(255, 255, 255, 0.05)",
								"&:hover": {
									bgcolor: "rgba(255, 255, 255, 0.1)",
								},
							}}
						>
							<ListItemIcon sx={{ color: "white" }}>
								{category.icon}
							</ListItemIcon>
							<ListItemText
								primary={category.title}
								sx={{
									"& .MuiTypography-root": {
										color: "white",
										fontWeight: 600,
									},
								}}
							/>
							{category.expanded ? (
								<ExpandLess />
							) : (
								<ExpandMore />
							)}
						</ListItemButton>

						{/* Category Items */}
						<Collapse
							in={category.expanded}
							timeout="auto"
							unmountOnExit
						>
							<List component="div" disablePadding>
								{category.sources.map(
									(source) => (
										<ListItem
											key={
												source.id
											}
											sx={{
												pl: 4,
												py: 1,
											}}
										>
											<ListItemIcon
												sx={{
													minWidth: 32,
													color: "lightgray",
												}}
											>
												{
													source.icon
												}
											</ListItemIcon>
											<Box
												sx={{
													flex: 1,
												}}
											>
												<Box
													sx={{
														display: "flex",
														alignItems:
															"center",
														gap: 1,
														mb: 0.5,
													}}
												>
													<Typography
														variant="body2"
														sx={{
															color: "white",
														}}
													>
														{
															source.label
														}
													</Typography>
													{selectedData.includes(
														source.id
													) && (
														<Chip
															label="Active"
															size="small"
															color="success"
														/>
													)}
												</Box>
												<Typography
													variant="caption"
													sx={{
														color: "gray",
													}}
												>
													{
														source.description
													}
												</Typography>
											</Box>
											<Switch
												edge="end"
												checked={selectedData.includes(
													source.id
												)}
												onChange={() =>
													onDataToggle(
														source.id
													)
												}
												color="primary"
											/>
										</ListItem>
									)
								)}
							</List>
						</Collapse>
					</React.Fragment>
				))}
			</List>
		</Drawer>
	);
};

export default SidebarMenuComponent;
