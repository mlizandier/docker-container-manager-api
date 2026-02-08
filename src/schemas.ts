import * as z from "zod";
import { ActionEnum } from "./actions/container.actions";

export const actionTypeSchema = z.object({
	action: z.enum(ActionEnum),
});

export const curseforgeDownloadUrlSchema = z.object({
	url: z.url({
		hostname: /^mediafilez\.forgecdn\.net$/,
		protocol: /^https$/,
	}),
});
