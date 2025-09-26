interface Compass {
	x: string;
	y: string;
	diameter: string;
	northDirection: string;
	longitude: string;
	[key: string]: any; // for other unknown fields
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
type Building = {
	entities: any[]
	floorlan: Floorlan[]
}
type Home = {
	buildings: Building[]
};
export default Home

interface Floorlan {
	camera: string;
	compass: Compass;
	dimensionLine: any[]; // array of dimension line objects
	doorOrWindow: any[]; // array of doors or windows
	environment: Environment;
	furnitureSortedProperty: string;
	furnitureVisibleProperty: { name: string }[];
	label: Label;
	light: any[]; // array of light objects
	name: string;
	observerCamera: any[]; // array of observer camera objects
	pieceOfFurniture: any[]; // array of furniture objects
	property: Property[];
	room: any[]; // array of room objects
	version: string;
	wall: any[]; // array of wall objects
	wallHeight: string;
}
