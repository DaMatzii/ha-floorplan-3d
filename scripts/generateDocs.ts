import * as z from "../apps/client/node_modules/zod/v4/index.js";
import { BuildingSchema, SceneSchema, myRegistry } from "../apps/client/src/types/types.ts";


console.log(JSON.stringify(z.toJSONSchema(BuildingSchema)))
