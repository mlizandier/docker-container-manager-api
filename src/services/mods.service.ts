import {
	ModsRepository,
	Mod,
	ModResponse,
} from "../repositories/mods.repository";

export class ModsService {
	private modsRepository: ModsRepository;

	constructor(modsRepository?: ModsRepository) {
		this.modsRepository = modsRepository || new ModsRepository();
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

	async activateMods(urls: string[], containerName: string): Promise<Mod[]> {
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
}
