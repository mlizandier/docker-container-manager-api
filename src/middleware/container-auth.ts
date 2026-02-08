import { Context, Next } from 'hono'
import { ContainerAuthService } from '../services/container-auth.service'
import { HTTPException } from 'hono/http-exception'

export const containerNameAuthorization = () => {
	const containerAuthorizationService = new ContainerAuthService()

	return async (c: Context, next: Next) => {
		if (!c.req.param("containerName")) {
			return next()
		}

		const isAuthorized = await containerAuthorizationService.isAuthorized(c.req.param("containerName"))
		if (!isAuthorized) {
			throw new HTTPException(403, { message: "Invalid container name" })
		}

		await next()
	}
}
