export interface Building {
    /**
     * The name of the floorplan SVG file.
     */
    floorplan_name: string;
    rooms:          Room;
    /**
     * The title of the floorplan configuration.
     */
    title: string;
}

/**
 * Schema for a single room definition, including entities and actions.
 */
export interface Room {
    /**
     * An alias or friendly name for the room.
     */
    alias?:             string;
    double_tap_action?: Action;
    /**
     * A list of entities within the room.
     */
    entities?: Entity[];
    /**
     * The Home Assistant area ID associated with the room.
     */
    hassId?: string;
    /**
     * A unique identifier for the room.
     */
    id:          string;
    tap_action?: Action;
}

/**
 * Schema for Home Assistant actions (e.g., tap, double-tap).
 */
export interface Action {
    /**
     * For example call-serive or more-info
     */
    action: string;
    /**
     * Home assistant or custom service
     */
    service?: string;
    /**
     * Data passed to service
     */
    target?: { [key: string]: any };
    [property: string]: any;
}

/**
 * A single entity configuration within a room.
 */
export interface Entity {
    double_tap_action?: Action;
    /**
     * The Home Assistant entity ID.
     */
    entity_id?:  string;
    position?:   Position;
    tap_action?: Action;
    /**
     * The type of the entity (e.g., light, temperatureDisplay).
     */
    type: string;
    [property: string]: any;
}

/**
 * The x, y, z position of the entity on the floorplan.
 */
export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface HomeConfig {
    /**
     * List of building files to be loaded
     */
    buildings: string[];
    /**
     * Your site name
     */
    name: string;
}
