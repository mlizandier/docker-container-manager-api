import { JarInstall } from "./jar-install";
import { ZipInstall } from "./zip-install";
import { DockerService } from "../services/docker.service";

export interface ModsInstallInterface {
	install(
		url: string,
		containerName: string,
		dockerService: DockerService
	): Promise<void>;
}

export class ModsInstallFactory {
	async install(
		url: string,
		containerName: string,
		dockerService: DockerService
	): Promise<void> {
		const extension = url.split(".").pop()?.toLowerCase();
		switch (extension) {
			case "zip":
				return new ZipInstall().install(url, containerName, dockerService);
			case "jar":
				return new JarInstall().install(url, containerName, dockerService);
			default:
				throw new Error(`Unsupported file type: ${extension}`);
		}
	}
}
