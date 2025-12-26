import * as z from "zod"


export const myRegistry = z.registry<{ description: string }>();

const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number(),
});

const PathTargetSchema = z.object({
	path: z.string().optional(),
	bottomSheetY: z.number().optional(),
});
const ActionEntityTargetSchema = z.object({
	entity_id: z.string(),
});

// const MoreInfoActionSchema = z.object({
// 	action: z.literal("more-info"),
// 	target: z.discriminatedUnion("type", [
// 		z.object({ type: z.literal("path"), path: z.string() }),
// 		z.object({ type: z.literal("cards"), cards: z.string(), bottomSheetY: z.number() })
// 	])
//
// })
const MoreInfoActionSchema = z.object({
	action: "more-info",
	target: z.union([
		z.object({ path: z.string() }),
		z.object({
			cards: z.string(),
			bottomSheet: z.string()
		}),
	]),
})
// cards: z.string().optional(),
// path: z.string().optional(),
// })

const MoreInfoHass = z.object({
	action: z.literal("hass-more-info"),
	target: ActionEntityTargetSchema

});

const CallServiceActionSchema = z.object({
	action: z.literal("call-service"),
	service: z.string(),
	target: ActionEntityTargetSchema.optional(),
});

const ActionSchema = z.discriminatedUnion("action", [
	MoreInfoActionSchema,
	CallServiceActionSchema,
	MoreInfoHass
]);


const LightEntitySchema = z.object({
	type: z.literal("light"),
	entity_id: z.string(),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	position: PositionSchema.optional(),
});

const TemperatureDisplayEntitySchema = z.object({
	type: z.literal("temperature_display"),
	font_size: z.number().optional(),
	top_sensor_id: z.string(),
	bottom_sensor_id: z.string(),
	position: PositionSchema.optional(),
});

const EntitySchema = z.discriminatedUnion("type", [
	LightEntitySchema,
	TemperatureDisplayEntitySchema,
]);

const RoomSchema = z.object({
	id: z.string(),
	alias: z.string().optional(),
	// ha_id: z.string().optional(),
	tap_action: ActionSchema.optional(),
	double_tap_action: ActionSchema.optional(),
	entities: z.array(EntitySchema).optional(),
});

const HomeConfigSchema = z.object({
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
	tap_action: ActionSchema,
}).strict();

const EntityCard = z.object({
	entity_id: z.string(),
	size: z.enum(["md", "sm"]),
	tap_action: ActionSchema.optional()
})

export const RoomCardSchema = z.object({
	type: z.literal("room"), title: z.string().min(1).meta({ description: "testi3ng" }),
	scenes: z.array(SceneSchema).min(1),
	// entities: z.array(EntityCard).min(1),
}).strict().register(myRegistry, { description: "xd" });


// export const ConfigSchema = z.object({
// 	bottomSheetY: z.number().min(0).max(1),
// 	cards: z.array(RoomCardSchema).min(1)
// }).strict();


export type Building = z.infer<typeof BuildingSchema>;
export type Entity = z.infer<typeof EntitySchema>
export type Room = z.infer<typeof RoomSchema>
export type Action = z.infer<typeof ActionSchema>
export type Position = z.infer<typeof PositionSchema>
export type HomeConfig = z.infer<typeof HomeConfigSchema>
export type Light = z.infer<typeof LightEntitySchema>
export type SceneIcon = z.infer<typeof SceneSchema>
export type RoomCard = z.infer<typeof RoomCardSchema>
export type EntityCard = z.infer<typeof EntityCard>
export type MoreInfoAction = z.infer<typeof MoreInfoActionSchema>






