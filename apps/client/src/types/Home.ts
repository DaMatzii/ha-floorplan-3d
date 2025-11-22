export interface Floorplan {
	camera: string;
	compass: Compass;
	dimensionLine: any[];
	doorOrWindow: any[];
	environment: Environment;
	furnitureSortedProperty: string;
	furnitureVisibleProperty: { name: string }[];
	label: Label;
	light: any[];
	name: string;
	observerCamera: any[];
	pieceOfFurniture: any[];
	property: Property[];
	room: any[];
	version: string;
	wall: any[];
	wallHeight: string;
}

export interface Home {
	name: string;
	Buildings: any[];
}

interface Compass {
	x: string;
	y: string;
	diameter: string;
	northDirection: string;
	longitude: string;
	[key: string]: any;
}

interface Environment {
	groundColor: string;
	skyColor: string;
	lightColor: string;
	ceillingLightColor: string;
	photoWidth: string;
	[key: string]: any;
}

interface Label {
	textStyle: {
		fontSize: string;
		[key: string]: any;
	};
	text: string;
	id: string;
	x: string;
	y: string;
	[key: string]: any;
}

interface Property {
	name: string;
	value: string;
}


