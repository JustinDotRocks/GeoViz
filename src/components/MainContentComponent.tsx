import { Box } from "@mui/material";
import type { MainContentProps } from "../types";

const MainContent = ({ sidebarOpen, children }: MainContentProps) => {
	return (
		<Box
			sx={{
				marginLeft: sidebarOpen ? "320px" : 0,
				height: "100vh",
				width: sidebarOpen ? "calc(100vw - 320px)" : "100vw",
				position: "relative",
				transition: "all 0.3s ease-in-out",
			}}
		>
			{children}
		</Box>
	);
};

export default MainContent;
