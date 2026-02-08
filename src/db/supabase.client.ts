import { createClient, SupabaseClient } from "@supabase/supabase-js";

class SupabaseSingleton {
	private static instance: SupabaseClient | null = null;

	static getInstance(): SupabaseClient {
		if (!SupabaseSingleton.instance) {
			const supabaseUrl = process.env.SUPABASE_URL;
			const supabaseKey = process.env.SUPABASE_SECRET_KEY;

			if (!supabaseUrl || !supabaseKey) {
				throw new Error(
					"Missing Supabase credentials: SUPABASE_URL and SUPABASE_SECRET_KEY must be set"
				);
			}

			SupabaseSingleton.instance = createClient(supabaseUrl, supabaseKey);
		}

		return SupabaseSingleton.instance;
	}

	static reset(): void {
		SupabaseSingleton.instance = null;
	}
}

export const getSupabaseClient = () => SupabaseSingleton.getInstance();
