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

interface SubSource {
	id: string;
	label: string;
	icon: React.ReactElement;
	description: string;
	enabled: boolean;
	parentId: string;
}

interface DataSource {
	id: string;
	label: string;
	icon: React.ReactElement;
	description: string;
	enabled: boolean;
	subSources?: SubSource[]; //Optional sub-sources property
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
	const isParentEnabled = (parentId: string) =>
		selectedData.includes(parentId);
	const isSubSourceEnabled = (subSourceId: string, parentId: string) =>
		selectedData.includes(subSourceId) && isParentEnabled(parentId);

	const renderDataSource = (
		source: DataSource,
		categoryExpanded: boolean
	) => {
		const isEnabled = selectedData.includes(source.id);
		const hasSubSources =
			source.subSources && source.subSources.length > 0;

		return (
			<React.Fragment key={source.id}>
				{/* Main Data Source */}
				<ListItem
					sx={{
						pl: 2,
						pr: 1,
						opacity: categoryExpanded ? 1 : 0.7,
						transition: "opacity 0.2s",
					}}
				>
					<ListItemIcon sx={{ minWidth: 32 }}>
						{source.icon}
					</ListItemIcon>
					<ListItemText
						primary={
							<Box
								display="flex"
								alignItems="center"
								gap={1}
							>
								<Typography
									variant="body2"
									fontWeight="medium"
									sx={{
										fontSize: "0.9rem",
									}}
								>
									{source.label}
								</Typography>
								{!source.enabled && (
									<Chip
										label="Coming Soon"
										size="small"
										variant="outlined"
										sx={{
											fontSize: "0.6rem",
											height: 18,
											color: "text.secondary",
											borderColor:
												"text.secondary",
										}}
									/>
								)}
							</Box>
						}
						secondary={
							<Typography
								variant="caption"
								color="text.secondary"
								sx={{ fontSize: "0.7rem" }}
							>
								{source.description}
							</Typography>
						}
					/>
					<Switch
						edge="end"
						checked={isEnabled}
						onChange={() => onDataToggle(source.id)}
						disabled={!source.enabled}
						size="small"
						sx={{
							"& .MuiSwitch-switchBase.Mui-checked":
								{
									color: isEnabled
										? "primary.main"
										: "default",
								},
						}}
					/>
				</ListItem>

				{/* Render Sub-Sources if they exist and parent is enabled */}
				{hasSubSources && isEnabled && (
					<Collapse
						in={isEnabled}
						timeout="auto"
						unmountOnExit
					>
						<List component="div" disablePadding>
							{source.subSources!.map(
								(subSource) => {
									const subEnabled =
										isSubSourceEnabled(
											subSource.id,
											source.id
										);

									return (
										<ListItem
											key={
												subSource.id
											}
											sx={{
												pl: 2,
												pr: 1,
												py: 0.5,
												borderLeft:
													"2px solid",
												borderColor:
													subEnabled
														? "primary.main"
														: "divider",
												ml: 1,
												opacity: categoryExpanded
													? 1
													: 0.7,
												transition:
													"all 0.2s",
												display: "block",
												position: "relative",
											}}
										>
											<Box
												sx={{
													display: "flex",
													alignItems:
														"center",
													justifyContent:
														"space-between",
													width: "100%",
													gap: 0,
												}}
											>
												{/* Left side: Icon + Text */}
												<Box
													sx={{
														display: "flex",
														alignItems:
															"center",
														gap: 1,
														flex: 1,
														minWidth: 0,
													}}
												>
													<Box
														sx={{
															minWidth: 28,
															display: "flex",
															justifyContent:
																"center",
														}}
													>
														{
															subSource.icon
														}
													</Box>
													<Box
														sx={{
															minWidth: 0,
														}}
													>
														<Typography
															variant="body2"
															fontSize="0.85rem"
															sx={{
																lineHeight: 1.2,
																mb: 0.25,
															}}
														>
															{
																subSource.label
															}
														</Typography>
														<Typography
															variant="caption"
															color="text.secondary"
															sx={{
																fontSize: "0.7rem",
																lineHeight: 1,
															}}
														>
															{
																subSource.description
															}
														</Typography>
													</Box>
												</Box>

												{/* Right side: Switch */}
												<Switch
													checked={
														subEnabled
													}
													onChange={() =>
														onDataToggle(
															subSource.id
														)
													}
													disabled={
														!subSource.enabled ||
														!isParentEnabled(
															source.id
														)
													}
													size="small"
													sx={{
														"& .MuiSwitch-switchBase.Mui-checked":
															{
																color: subEnabled
																	? "secondary.main"
																	: "default",
															},
														"& .MuiSwitch-track":
															{
																backgroundColor:
																	subEnabled
																		? "secondary.light"
																		: "action.disabled",
															},
													}}
												/>
											</Box>
										</ListItem>
									);
								}
							)}
						</List>
					</Collapse>
				)}
			</React.Fragment>
		);
	};

	const renderCategory = (category: DataCategory) => (
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
					{category.sources.map((source) =>
						renderDataSource(source, category.expanded)
					)}
				</List>
			</Collapse>

			<Divider sx={{ my: 1, mx: 2 }} />
		</React.Fragment>
	);

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
				{categories.map(renderCategory)}
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
