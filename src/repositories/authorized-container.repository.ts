import { getSupabaseClient } from '../db/supabase.client'

export interface AuthorizedContainer {
	id: string
	name: string
	created_at?: string
	updated_at?: string
}

export class AuthorizedContainerRepository {
	private supabase = getSupabaseClient()

	async findByName(name: string): Promise<AuthorizedContainer | null> {
		const { data, error } = await this.supabase
			.from('authorized_container_names')
			.select('*')
			.eq('name', name)
			.eq('is_active', true)
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
