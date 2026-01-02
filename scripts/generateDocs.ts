import { zod2md } from 'zod2md';
import fs from "fs"

const markdown = zod2md({
	entry: 'apps/client/src/types/types.ts',
	title: 'Models reference',
});


markdown.then((m) => fs.write())


