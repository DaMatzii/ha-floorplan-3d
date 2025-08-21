// Core parser types
interface ComponentProps {
	[key: string]: string | number | boolean;
}

interface XMLNode {
	tagName: string;
	attributes: ComponentProps;
	children: XMLNode[];
}

interface ComponentParser<T = any> {
	parse: (node: XMLNode) => React.ReactElement<T>;
	validate?: (node: XMLNode) => boolean;
}

// Registry system
class ComponentRegistry {
	private parsers = new Map<string, ComponentParser>();

	register<T>(tagName: string, parser: ComponentParser<T>): void {
		this.parsers.set(tagName.toLowerCase(), parser);
	}

	getParser(tagName: string): ComponentParser | undefined {
		return this.parsers.get(tagName.toLowerCase());
	}

	hasParser(tagName: string): boolean {
		return this.parsers.has(tagName.toLowerCase());
	}
}

// Main parser class
class XMLToThreeJSParser {
	constructor(private registry: ComponentRegistry) { }

	parse(xmlString: string): React.ReactElement[] {
		const doc = this.parseXML(xmlString);
		return this.processNodes(doc.children);
	}

	private parseXML(xmlString: string): XMLNode {
		const parser = new DOMParser();
		const doc = parser.parseFromString(xmlString, 'text/xml');
		return this.domToXMLNode(doc.documentElement);
	}

	private domToXMLNode(element: Element): XMLNode {
		const attributes: ComponentProps = {};

		// Extract attributes
		for (let i = 0; i < element.attributes.length; i++) {
			const attr = element.attributes[i];
			attributes[attr.name] = this.parseAttributeValue(attr.value);
		}

		// Process children
		const children: XMLNode[] = [];
		for (const child of element.children) {
			children.push(this.domToXMLNode(child));
		}

		return {
			tagName: element.tagName,
			attributes,
			children
		};
	}

	private parseAttributeValue(value: string): string | number | boolean {
		// Handle boolean
		if (value === 'true') return true;
		if (value === 'false') return false;

		// Handle numbers
		const num = Number(value);
		if (!isNaN(num) && value.trim() !== '') return num;

		// Default to string
		return value;
	}

	private processNodes(nodes: XMLNode[]) {
		nodes.forEach((node) => {
			console.log(node)
		})
	}
}

console.log("lol")
