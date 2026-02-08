import { getSupabaseClient } from '../db/supabase.client'

export interface ApiKey {
	id: string
	value: string
	name?: string
	created_at?: string
	updated_at?: string
	revoked_at?: string | null
}

export class ApiKeyRepository {
	private supabase = getSupabaseClient()

	async findByKey(key: string): Promise<ApiKey | null> {
		const { data, error } = await this.supabase
			.from('api_key')
			.select('*')
			.eq('value', key)
			.is('revoked_at', null)
			.single()

		if (error) {
			if (error.code === 'PGRST116') {
				// No rows returned
				return null
			}
			throw error
		}

		return data
	}
}
