import { Hono } from "hono";
import { apiKeyAuth } from "./middleware/auth";
import { DockerService } from "./services/docker.service";
import { containerNameAuthorization } from "./middleware/container-auth";
import { zValidator } from "@hono/zod-validator";
import { actionTypeSchema, curseforgeDownloadUrlSchema } from "./schemas";
import { ModsService } from "./services/mods.service";
import * as z from "zod";
import { actionMap } from "./actions/container.actions";

const app = new Hono();
const dockerService = new DockerService();
const modsService = new ModsService();

app.use("*", apiKeyAuth());
app.use(
	"/api/v1/hytale/container/:containerName",
	containerNameAuthorization()
);

app.get("/api/v1/hytale/container/:containerName", async (c) => {
	const { containerName } = c.req.param();
	try {
		const container =
			await dockerService.getContainerFormattedOutput(containerName);
		return c.json(container);
	} catch (error) {
		return c.json(
			{
				error:
					error instanceof Error ? error.message : "Failed to find container",
			},
			500
		);
	}
});

app.post(
	"/api/v1/hytale/container/:containerName",
	zValidator("json", actionTypeSchema),
	async (c) => {
		const { containerName } = c.req.param();
		const { action } = c.req.valid("json");

		const actionHandler = actionMap[action];
		if (!actionHandler) {
			return c.json({ error: "Invalid action" }, 400);
		}

		try {
			await actionHandler.execute(containerName);
			return c.json({
				message: `Container ${containerName} ${action}ed successfully`,
			});
		} catch (error) {
			return c.json(
				{
					error:
						error instanceof Error
							? error.message
							: `Failed to ${action} container`,
				},
				500
			);
		}
	}
);

app.post(
	"/api/v1/hytale/container/:containerName/mods",
	zValidator("json", z.array(curseforgeDownloadUrlSchema)),
	async (c) => {
		const { containerName } = c.req.param();
		const body = c.req.valid("json");
		const uniqueUrls = Array.from(new Set(body.map((item) => item.url)));

		try {
			const modsToDownload = await modsService.filterModsToActivate(
				uniqueUrls,
				containerName
			);

			for (const url of modsToDownload) {
				await dockerService.execCommand(containerName, [
					"/bin/sh",
					"-c",
					`cd downloads && wget "${url}"`,
				]);
			}

			await modsService.activateMods(modsToDownload, containerName);

			return c.json({
				message: `Processing ${modsToDownload.length} mod(s) to download and activate`,
				mods: modsToDownload,
			});
		} catch (error) {
			return c.json(
				{
					error:
						error instanceof Error
							? error.message
							: "Failed to process mod downloads",
				},
				500
			);
		}
	}
);

app.get("/api/v1/hytale/container/:containerName/mods/active", async (c) => {
	const { containerName } = c.req.param();
	const mods = await modsService.getMods(containerName);
	return c.json(mods);
});

export default app;
