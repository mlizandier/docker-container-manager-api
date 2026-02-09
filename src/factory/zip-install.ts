import { ModsInstallInterface } from "./mods-install.factory";
import { DockerService } from "../services/docker.service";
import { extractFileName } from "../utils/file";

export class ZipInstall implements ModsInstallInterface {
	async install(
		url: string,
		containerName: string,
		dockerService: DockerService
	): Promise<void> {
		const fileName = extractFileName(url);
		const baseName = fileName.replace(/\.zip$/i, "");
		if (!baseName || baseName.trim() === "") {
			throw new Error(`Unable to extract base name from filename: ${fileName}`);
		}

		await dockerService.execCommand(containerName, [
			"/bin/sh",
			"-c",
			`cd /server/mods && wget -O "${fileName}" "${url}" && unzip -o "${fileName}" -d "${baseName}"`,
		]);
	}
}
