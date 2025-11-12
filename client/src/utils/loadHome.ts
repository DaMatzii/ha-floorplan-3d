import { Home, Building } from "@/types/";

import { parse } from "yaml";
import { XMLParser } from "fast-xml-parser";

const parseBuilding = (buildings) => {

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	});
	const building = parser.parse(buildings.floorplan_building)?.home;
	const rooms = parse(buildings.raw_rooms);

	return {
		title: "",
		floorplan_building: building,
		rooms: rooms,
	} as Building;
};

export const loadHome = async () => {
	const [home, buildings] = await Promise.all([
		fetch("/api/home").then((r) => r.json()),
		fetch("/api/building/0/").then((r) => r.json()),
	]);

	const building = parseBuilding(buildings);

	return {
		home: home,
		buildings: [building],
	};
};


