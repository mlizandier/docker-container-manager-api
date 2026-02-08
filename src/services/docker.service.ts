import Docker from "dockerode";
import { HTTPException } from "hono/http-exception";

export class DockerService {
	private docker: Docker;

	constructor(socketPath: string = "/var/run/docker.sock") {
		this.docker = new Docker({ socketPath });
	}

	private async listContainers() {
		return await this.docker.listContainers();
	}

	async getContainerInformation(containerName: string) {
		const containers = await this.listContainers();
		const container = containers.find(
			(container) => container.Names[0] === `/${containerName}`
		);

		if (!container) {
			throw new HTTPException(404, {
				message: `Container ${containerName} not found`,
			});
		}

		return container;
	}

	async getContainerFormattedOutput(containerName: string) {
		const container = await this.getContainerInformation(containerName);

		return {
			name: container.Names[0],
			created: new Date(container.Created * 1000).toISOString(),
			state: container.State,
			status: container.Status,
		};
	}

	async getContainer(containerName: string) {
		const containerInfo = await this.getContainerInformation(containerName);
		const container = this.docker.getContainer(containerInfo.Id);
		return container;
	}

	private async createExecInstance(
		container: Docker.Container,
		command: string[]
	): Promise<Docker.Exec> {
		try {
			return await container.exec({
				AttachStdin: false,
				AttachStdout: true,
				AttachStderr: true,
				Cmd: command,
			});
		} catch (error) {
			throw new Error(
				`Failed to create exec instance: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	private async startExecStream(
		exec: Docker.Exec
	): Promise<NodeJS.ReadableStream> {
		try {
			return await exec.start({ Detach: false });
		} catch (error) {
			throw new Error(
				`Failed to start exec stream: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	private async readStream(stream: NodeJS.ReadableStream): Promise<string> {
		const chunks: Buffer[] = [];

		try {
			for await (const chunk of stream) {
				const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
				chunks.push(buffer);
			}
		} catch (error) {
			throw new Error(
				`Error reading exec stream: ${error instanceof Error ? error.message : String(error)}`
			);
		}

		return Buffer.concat(chunks).toString();
	}

	async execCommand(containerName: string, command: string[]): Promise<string> {
		try {
			const container = await this.getContainer(containerName);
			const exec = await this.createExecInstance(container, command);
			const stream = await this.startExecStream(exec);
			const output = await this.readStream(stream);

			console.log(output);
			return output;
		} catch (error) {
			if (error instanceof HTTPException) {
				throw error;
			}
			throw new Error(
				`Failed to execute command in container ${containerName}: ${error instanceof Error ? error.message : String(error)}`
			);
		}
	}

	async restartContainer(containerName: string) {
		const container = await this.getContainer(containerName);
		await container.restart();
		return container;
	}
}
