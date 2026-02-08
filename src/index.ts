import { Hono } from 'hono'
import { apiKeyAuth } from './middleware/auth'
import { DockerService } from './services/docker.service'
import { containerNameAuthorization } from './middleware/container-auth'

const app = new Hono()
const dockerService = new DockerService()

// Apply authentication to all routes
app.use('*', apiKeyAuth())
app.use("/api/v1/docker/containers/:containerName", containerNameAuthorization())

app.get('/api/v1/docker/containers/:containerName', async (c) => {
  const { containerName } = c.req.param()
  try {
    const container = await dockerService.getContainerInformation(containerName)
    return c.json(container)
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Failed to find container' }, 500)
  }
})

app.post('/api/v1/docker/containers/:containerName/restart', async (c) => {
  const { containerName } = c.req.param()
  try {
    await dockerService.restartContainer(containerName)
    return c.json({ message: `Container ${containerName} restarted successfully` })
  } catch (error) {
    return c.json({ error: error instanceof Error ? error.message : 'Failed to restart container' }, 500)
  }
})


export default app
