import type { ReactElement } from "react";
import type { ReactNode } from "react";

export interface MainContentProps {
	sidebarOpen: boolean;
	children: ReactNode;
}

export interface MenuToggleButtonProps {
	sidebarOpen: boolean;
	onToggle: () => void;
}

export interface WeatherData {
	type?: string;
	temperature?: number;
	precipitation?: number;
	station?: string;
	date?: string;
	coordinates?: [number, number];
	visible?: boolean;
	// Individual visibility controls
	showTemperature?: boolean;
	showPrecipitation?: boolean;
}

export interface SubSource {
	id: string;
	label: string;
	icon: ReactElement;
	description: string;
	enabled: boolean;
	parentId: string;
}

export interface DataSource {
	id: string;
	label: string;
	icon: ReactElement;
	description: string;
	enabled: boolean;
	subSources?: SubSource[];
}

export interface DataCategory {
	id: string;
	title: string;
	icon: ReactElement;
	expanded: boolean;
	sources: DataSource[];
}
