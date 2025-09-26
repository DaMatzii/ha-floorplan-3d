import Wall from "@/components/scene/Wall";
// import Light from './components/scene/Light'
import Room from "@/components/scene/Room";
import TemperatureDisplay from "@/components/scene/TempDisplay";
import BoxWithLabel from "@/components/scene/BoxWithLabel";
import DoorOrWindow from "@/components/scene/DoorOrWindow";
import Furniture from "@/components/scene/Furniture";
import HassLight from "@/components/ui/HassLight";
import HassRoom from "@/components/ui/HassRoom";
export interface ComponentProps {
	[key: string]: string | number | boolean;
}

// Parser type: React component accepting ComponentProps
export type ComponentParser<T extends ComponentProps = ComponentProps> =
	React.ComponentType<T>;

export class ComponentRegistry {
	private parsers = new Map<string, ComponentParser<any>>();

	register<T extends ComponentProps>(
		tagName: string,
		parser: ComponentParser<T>,
	): void {
		this.parsers.set(tagName.toLowerCase(), parser);
	}

	getParser<T extends ComponentProps>(
		tagName: string,
	): ComponentParser<T> | undefined {
		return this.parsers.get(tagName.toLowerCase()) as
			| ComponentParser<T>
			| undefined;
	}
}

const registry = new ComponentRegistry();
registry.register("wall", Wall);
registry.register("pieceOfFurniture", Furniture);
// registry.register("light", Light);
registry.register("room", Room);
registry.register("room-temperatureDisplay", TemperatureDisplay);
registry.register("room-boxWithLabel", BoxWithLabel);
registry.register("doorOrWindow", DoorOrWindow);
registry.register("ui-hass-light", HassLight);
registry.register("ui-hass-room", HassRoom);
export default registry;
