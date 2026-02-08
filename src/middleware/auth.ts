import { Context, Next } from "hono";
import { AuthService } from "../services/auth.service";

export const apiKeyAuth = () => {
	const authService = new AuthService();

	return async (c: Context, next: Next) => {
		const apiKey = c.req.header("X-API-Key") || "";

		const validation = await authService.validateApiKey(apiKey);

		if (!validation.valid) {
			const statusCode =
				validation.error === "Internal server error during authentication"
					? 500
					: 401;
			return c.json({ error: `Unauthorized: ${validation.error}` }, statusCode);
		}

		await next();
	};
};
