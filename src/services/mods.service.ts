import {
	ModsRepository,
	Mod,
	ModResponse,
} from "../repositories/mods.repository";
import { ModsInstallFactory } from "../factory/mods-install.factory";
import { DockerService } from "./docker.service";

export interface InstallModsResult {
	installed: number;
	activated: Mod[];
}

export class ModsService {
	private modsRepository: ModsRepository;
	private modsInstallFactory: ModsInstallFactory;
	private dockerService: DockerService;

	constructor(
		modsRepository?: ModsRepository,
		modsInstallFactory?: ModsInstallFactory,
		dockerService?: DockerService
	) {
		this.modsRepository = modsRepository || new ModsRepository();
		this.modsInstallFactory = modsInstallFactory || new ModsInstallFactory();
		this.dockerService = dockerService || new DockerService();
	}

	async getActiveMods(containerName: string): Promise<ModResponse[]> {
		return this.modsRepository.findByStatusAndContainer({
			isActive: true,
			containerName,
		});
	}

	async filterModsToActivate(
		urls: string[],
		containerName: string
	): Promise<string[]> {
		const activeMods = await this.getActiveMods(containerName);
		return urls.filter((url) => !activeMods.some((mod) => mod.url === url));
	}

	async activateMods(urls: string[], containerName: string) {
		return Promise.all(
			urls.map((url) => this.modsRepository.upsert(url, containerName))
		);
	}

	async getMods(containerName: string): Promise<ModResponse[]> {
		return this.modsRepository.findByStatusAndContainer({
			isActive: true,
			containerName,
		});
	}

	async installMods(
		urls: string[],
		containerName: string
	): Promise<InstallModsResult> {
		const modsToInstall = await this.filterModsToActivate(urls, containerName);

		await Promise.all(
			modsToInstall.map((url) =>
				this.modsInstallFactory.install(url, containerName, this.dockerService)
			)
		);

		const activatedMods = await this.activateMods(modsToInstall, containerName);

		return {
			installed: modsToInstall.length,
			activated: activatedMods.filter((mod): mod is Mod => mod !== null),
		};
	}
}
