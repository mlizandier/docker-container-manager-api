import { ApiKeyRepository, ApiKey } from '../repositories/api-key.repository'

export class AuthService {
	private apiKeyRepository: ApiKeyRepository

	constructor(apiKeyRepository?: ApiKeyRepository) {
		this.apiKeyRepository = apiKeyRepository || new ApiKeyRepository()
	}

	async validateApiKey(apiKey: string): Promise<{ valid: boolean; key?: ApiKey; error?: string }> {
		if (!apiKey) {
			return { valid: false, error: 'Missing API key' }
		}

		try {
			const key = await this.apiKeyRepository.findByKey(apiKey)

			if (!key) {
				return { valid: false, error: 'Invalid API key' }
			}

			return { valid: true, key }
		} catch (error) {
			console.error('Error validating API key:', error)
			return { valid: false, error: 'Internal server error during authentication' }
		}
	}
}
