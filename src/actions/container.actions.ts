import { DockerService } from "../services/docker.service";

const dockerService = new DockerService();

interface ContainerAction {
	execute(containerName: string): Promise<void>;
}

class RestartAction implements ContainerAction {
	async execute(containerName: string) {
		await dockerService.restartContainer(containerName);
	}
}

class StopAction implements ContainerAction {
	async execute(containerName: string) {
		throw new Error("Not implemented");
	}
}

class StartAction implements ContainerAction {
	async execute(containerName: string) {
		throw new Error("Not implemented");
	}
}

export enum ActionEnum {
	Restart = "restart",
	Stop = "stop",
	Start = "start",
}

export const actionMap: Record<ActionEnum, ContainerAction> = {
	[ActionEnum.Restart]: new RestartAction(),
	[ActionEnum.Stop]: new StopAction(),
	[ActionEnum.Start]: new StartAction(),
};
