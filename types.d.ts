export interface Entities {
    /**
     * A list of all entities in the system.
     */
    entities: Entity[];
    [property: string]: any;
}

/**
 * Common properties for all entities.
 */
export interface Entity {
    /**
     * The Home Assistant entity ID.
     */
    entity_id: string;
    /**
     * The category of the entity.
     */
    type: EntityID;
}

export enum EntityID {
    Light = "light",
    TemperatureDisplay = "temperatureDisplay",
}
