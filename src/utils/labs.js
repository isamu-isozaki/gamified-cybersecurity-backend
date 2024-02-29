import fs from 'fs';
import path from 'path';
import { LABS_DIR } from '../config/index.js';
import YAML from 'yaml';
import { z } from 'zod';

export const labMetadataSchema = z.object({
	lab: z.object({
		name: z.string(),
		difficulty_rating: z.number().int().min(1).max(5),
		number_of_machines: z.number().int().positive(),
		flags: z.array(z.string()),
		submit_flags_in_order: z.boolean().optional().default(false)
	})
});

export const findLab = async (name) => {
	const files = await fs.promises.readdir(LABS_DIR);
    
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const stats = await fs.promises.lstat(path.join(LABS_DIR, file));
		if (stats.isDirectory()) {
			const metadata = await parseLabMetadataFile(file);

			if(metadata && metadata.name === name) {
				return {
					labdata: metadata,
					labpath: path.join(LABS_DIR, file)
				};
			}
		}
	}
	return null;
};

export const parseLabMetadataFile = async (file) => {
	try {
		const metadata = await fs.promises.readFile(path.join(LABS_DIR, file, '/metadata.yml'), 'utf8');
		const parsed = YAML.parse(metadata);

		const result = labMetadataSchema.safeParse(parsed);

		if(result.success) {
			return result.data.lab;
		}
	// eslint-disable-next-line no-empty
	} catch {}

	return null;
};