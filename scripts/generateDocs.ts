import * as z from "../apps/client/node_modules/zod/v4/index.js";
import { BuildingSchema, SceneSchema, myRegistry } from "../apps/client/src/types/types.ts";


// console.log(RoomCardSchema.shape)

for (const [key, schema] of Object.entries(BuildingSchema.shape)) {
	console.log(key + ": ")
	if (schema.def.type === 'array') {
		// console.log(key)
		console.log(Object.keys(schema.def?.element.def?.shape))
	}
}

