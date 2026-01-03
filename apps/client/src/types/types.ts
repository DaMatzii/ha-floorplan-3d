import * as z from "zod"


export const myRegistry = z.registry<{ description: string }>();

export const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
});

export const MoreInfoActionSchema = z.object({
	action: z.literal("more-info"),
	target: z.union([
		z.object({ path: z.string() }),
		z.object({
			cards: z.string(),
			bottomSheet: z.string()
		}),
	]),
})

export const MoreInfoHass = z.object({
	action: z.literal("hass-more-info"),
	target: z.object({
		entity_id: z.string()
	})

});

export const CallServiceActionSchema = z.object({
	action: z.literal("call-service"),
	service: z.string(),
	target: z.object({
		entity_id: z.string()
	})
});

export const ActionSchema = z.discriminatedUnion("action", [
	MoreInfoActionSchema,
	CallServiceActionSchema,
	MoreInfoHass
]);


export const IconEntitySchema = z.object({
	type: z.literal("icon"),
	entity_id: z.string(),
	icon: z.string(),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	hold_action: ActionSchema.optional(),
	position: PositionSchema.optional(),
});

export const TemperatureDisplayEntitySchema = z.object({
	type: z.literal("temperature_display"),
	font_size: z.number().optional(),
	top_sensor_id: z.string(),
	bottom_sensor_id: z.string(),
	position: PositionSchema.optional(),
	tap_action: ActionSchema.optional(),
});

export const EntitySchema = z.discriminatedUnion("type", [
	IconEntitySchema,
	TemperatureDisplayEntitySchema,
]);

export const RoomSchema = z.object({
	id: z.string(),
	alias: z.string().optional(),
	// ha_id: z.string().optional(),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	entities: z.array(EntitySchema).optional(),
});

export const HomeConfigSchema = z.object({
	title: z.string(),
	buildings: z.array(z.string())
})

export const BuildingSchema = z.object({
	title: z.string(),
	floorplan_name: z.string().describe("Path where buildings floorplan is loaded"),
	rooms: z.array(RoomSchema),
});


export const SceneSchema = z.object({
	icon: z.string().min(1, "Scene icon is required."),
	title: z.string().min(1, "Scene title is required."),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	hold_action: ActionSchema.optional()

}).strict();

export const EntityCard = z.object({
	entity_id: z.string(),
	size: z.enum(["md", "sm", "wide"]),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	hold_action: ActionSchema.optional()
})

export const RoomCardSchema = z.object({
	type: z.literal("room"), title: z.string().min(1).meta({ description: "testi3ng" }),
	scenes: z.array(SceneSchema).min(1),
	entities: z.array(EntityCard).min(1),
}).strict().register(myRegistry, { description: "xd" });

export type IBuilding = z.infer<typeof BuildingSchema>;
export type IEntity = z.infer<typeof EntitySchema>
export type IRoom = z.infer<typeof RoomSchema>
export type IAction = z.infer<typeof ActionSchema>
export type IPosition = z.infer<typeof PositionSchema>
export type IHomeConfig = z.infer<typeof HomeConfigSchema>
export type IIcon = z.infer<typeof IconEntitySchema>
export type ISceneIcon = z.infer<typeof SceneSchema>
export type IRoomCard = z.infer<typeof RoomCardSchema>
export type IDeviceCard = z.infer<typeof EntityCard>
export type IMoreInfoAction = z.infer<typeof MoreInfoActionSchema>
export type ITemperatureDisplay = z.infer<typeof TemperatureDisplayEntitySchema>






