import { AuthorizedContainerRepository } from '../repositories/authorized-container.repository'

export class ContainerAuthService {
	private authorizedContainerRepository: AuthorizedContainerRepository

	constructor(authorizedContainerRepository?: AuthorizedContainerRepository) {
		this.authorizedContainerRepository = authorizedContainerRepository || new AuthorizedContainerRepository()
	}

	public async isAuthorized(name: string): Promise<boolean> {
		try {
			const container = await this.authorizedContainerRepository.findByName(name)
			return container !== null
		} catch (error) {
			console.error('Error checking container authorization:', error)
			return false
		}
	}
}
