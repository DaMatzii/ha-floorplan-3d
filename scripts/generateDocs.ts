import * as z from "../apps/client/node_modules/zod/v4/index.js";
import { BuildingSchema, SceneSchema, myRegistry } from "../apps/client/src/types/types.ts";
import { zod2md } from 'zod2md';


console.dir(z.toJSONSchema(BuildingSchema, { reused: "ref" }), { depth: 10 })



