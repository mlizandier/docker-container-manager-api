import Docker from 'dockerode'
import {
	HTTPException
} from 'hono/http-exception'

export class DockerService {
	private docker: Docker

	constructor(socketPath: string = '/var/run/docker.sock') {
		this.docker = new Docker({ socketPath })
	}

	private async listContainers() {
		return await this.docker.listContainers()
	}

	async getContainer(containerName: string) {
		const containers = await this.listContainers()
		const container = containers.find(
			(container) => container.Names[0] === `/${containerName}`
		)

		if (!container) {
			throw new HTTPException(404, { message: `Container ${containerName} not found` })
		}

		return container
	}

	async getContainerInformation(containerName: string) {
		const container = await this.getContainer(containerName)

		return {
			name: container.Names[0],
			created: new Date(container.Created * 1000).toISOString(),
			state: container.State,
			status: container.Status
		}
	}

	async restartContainer(containerName: string) {
		const containerInfo = await this.getContainer(containerName)
		const container = this.docker.getContainer(containerInfo.Id)
		await container.restart()
		return container
	}
}
