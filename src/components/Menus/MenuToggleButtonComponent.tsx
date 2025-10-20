import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import type { MenuToggleButtonProps } from "../../types";

const MenuToggleButton = ({ sidebarOpen, onToggle }: MenuToggleButtonProps) => {
	return (
		<IconButton
			onClick={onToggle}
			sx={{
				position: "fixed",
				top: 16,
				left: sidebarOpen ? 336 : 16,
				zIndex: 1300,
				bgcolor: "rgba(0, 0, 0, 0.7)",
				color: "white",
				"&:hover": { bgcolor: "rgba(0, 0, 0, 0.9)" },
			}}
		>
			<MenuIcon />
		</IconButton>
	);
};

export default MenuToggleButton;
