import { ModsInstallInterface } from "./mods-install.factory";
import { DockerService } from "../services/docker.service";
import { extractFileName } from "../utils/file";

export class JarInstall implements ModsInstallInterface {
	async install(
		url: string,
		containerName: string,
		dockerService: DockerService
	): Promise<void> {
		const fileName = extractFileName(url);
		await dockerService.execCommand(containerName, [
			"/bin/sh",
			"-c",
			`cd /downloads && wget -O "${fileName}" "${url}"`,
		]);
	}
}
