import { Home, Building } from "@/types/";

import { parse } from "yaml";
import { XMLParser } from "fast-xml-parser";

import { Building } from "lucide-react";
import { title } from "process";
const parseBuilding = (buildings): Building => {
	const rooms = parse(buildings.raw_rooms);

	const build: Building = {
		title: buildings.title,
		floorplan_name: buildings.floorplan,
		rooms: rooms
	}
	console.log(build)

	return build

}


export const loadHome = async () => {
	const [home, buildings] = await Promise.all([
		fetch("./api/home").then((r) => r.json()),
		fetch("./api/building/0").then((r) => r.json()),
	]);

	const building = parseBuilding(buildings);

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: "",
	});
	const floorplan = parser.parse(buildings.floorplan_building)?.home;

	return {
		home: home,
		_buildings: [building],
		floorplans: {
			[buildings.floorplan]: floorplan
		}
	}
};


