import Wall from './Components/Wall'
import Light from './Components/Light'
import Room from './Components/Room'
import TemperatureDisplay from './Components/TempDisplay'
import BoxWithLabel from './Components/BoxWithLabel'
import DoorOrWindow from './Components/DoorOrWindow'
import Furniture from './Components/Furniture'
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
registry.register("light", Light);
registry.register("room", Room);
registry.register("room-temperatureDisplay", TemperatureDisplay);
registry.register("room-boxWithLabel", BoxWithLabel);
registry.register("doorOrWindow", DoorOrWindow);
export default registry;


