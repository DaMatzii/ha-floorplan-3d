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
	buildings: any[];
}
export interface Building {
	title: string;
	floorplan_path: string
	rooms: Room[]
	floorplan_building: Floorplan
}

export interface Room {
	alias?: string;
	hassId: string;
	id: string;
	tap_action?: Action;
	double_tap_action?: Action;
	entities?: Entity[];
	floorplan: Floorplan
}

type Action =
	| {
		action: "call-service";
		service: string;
		target: {
			entity_id: string;
		};
	}
	| {
		action: "more-info";
	};

interface Entity {
	type: string;
	entity_id?: string;
	position: {
		x: number;
		y: number;
		z: number;
	};
	tap_action?: Action;
	double_tap_action?: Action;
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


