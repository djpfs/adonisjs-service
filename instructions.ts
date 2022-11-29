import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default async function instructions(app: ApplicationContract, sink: typeof sinkStatic) {
  // run node ace generate:manifest
  await app.container.use('Adonis/Core/Manifest').generate()

  sink.logger.action('create').succeeded('Command register')
}
