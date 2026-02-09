import { getSupabaseClient } from "../db/supabase.client";

export interface Mod {
	id: string;
	url: string;
	container_name: string;
	is_active: boolean;
	created_at?: string;
	updated_at?: string;
}

export interface ModResponse {
	url: string;
	container_name: string;
	is_active: boolean;
}

export class ModsRepository {
	private supabase = getSupabaseClient();

	async findByStatusAndContainer({
		isActive,
		containerName,
	}: {
		isActive: boolean;
		containerName: string;
	}): Promise<ModResponse[]> {
		const { data, error } = await this.supabase
			.from("mods")
			.select("url, container_name, is_active")
			.eq("is_active", isActive)
			.eq("container_name", containerName);

		if (error) {
			throw error;
		}

		return data;
	}

	async findByUrlAnyStatusAndContainer(
		url: string,
		containerName: string
	): Promise<Mod | null> {
		const { data, error } = await this.supabase
			.from("mods")
			.select("*")
			.eq("url", url)
			.eq("container_name", containerName)
			.single();

		if (error) {
			if (error.code === "PGRST116") {
				// No rows returned
				return null;
			}
			throw error;
		}

		return data;
	}

	async create(url: string, containerName: string): Promise<Mod> {
		const { data, error } = await this.supabase
			.from("mods")
			.insert({ url, is_active: true, container_name: containerName })
			.select()
			.single();

		if (error) {
			throw error;
		}

		return data;
	}

	async update(
		id: string,
		updates: Partial<Mod>,
		containerName: string
	): Promise<Mod> {
		const { data, error } = await this.supabase
			.from("mods")
			.update(updates)
			.eq("id", id)
			.eq("container_name", containerName)
			.select()
			.single();

		if (error) {
			throw error;
		}

		return data;
	}

	async upsert(url: string, containerName: string): Promise<Mod> {
		const existing = await this.findByUrlAnyStatusAndContainer(
			url,
			containerName
		);

		if (existing) {
			return await this.update(
				existing.id,
				{ is_active: true, updated_at: new Date().toISOString() },
				containerName
			);
		}
		return await this.create(url, containerName);
	}
}
