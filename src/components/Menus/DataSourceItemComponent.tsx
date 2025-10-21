import React from "react";
import {
	ListItem,
	ListItemIcon,
	ListItemText,
	Switch,
	Typography,
	Box,
	Chip,
	Collapse,
	List,
} from "@mui/material";
import type { DataSourceItemProps } from "../../types";

// Component to render a single data source item with its sub-sources
const DataSourceItemComponent: React.FC<DataSourceItemProps> = ({
	source,
	categoryExpanded,
	selectedData,
	onDataToggle,
	isParentEnabled,
	isSubSourceEnabled,
}) => {
	const isEnabled = selectedData.includes(source.id);
	const hasSubSources = source.subSources && source.subSources.length > 0;
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
						"& .MuiSwitch-switchBase.Mui-checked": {
							color: isEnabled
								? "primary.main"
								: "default",
						},
					}}
				/>
			</ListItem>

			{/* Render Sub-Sources if they exist and parent is enabled */}
			{hasSubSources && isEnabled && (
				<Collapse in={isEnabled} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						{source.subSources!.map((subSource) => {
							const subEnabled = isSubSourceEnabled(
								subSource.id,
								source.id
							);

							return (
								<ListItem
									key={subSource.id}
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
						})}
					</List>
				</Collapse>
			)}
		</React.Fragment>
	);
};

export default DataSourceItemComponent;
