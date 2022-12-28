import * as sinkStatic from '@adonisjs/sink'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import fs from 'fs'


export default async function instructions(projectRoot: string, app: ApplicationContract, { logger }: typeof sinkStatic) {
  logger.action('Root').succeeded(projectRoot)
  const adonisrcPath = `${app.appRoot}/.adonisrc.json`
  const adonisrc = JSON.parse(String(fs.readFileSync(adonisrcPath, 'utf8')))
  const commands = adonisrc.commands as string[]
  const commandsToInsert = [
    '@djpfs/adonisjs-service/build/commands/CreateService.js',
    '@djpfs/adonisjs-service/build/commands/RemoveService.js',
  ]
  commandsToInsert.forEach((command) => {
    if (commands.includes(command)) {
      logger.action('add').skipped(command, 'Command already exists in .adonisrc.json')
    } else {
      commands.push(command)
      logger.action('add').succeeded(`${command} to .adonisrc.json`)
    }
  })
  adonisrc.commands = commands
  fs.writeFileSync(adonisrcPath, JSON.stringify(adonisrc, null, 2))
  logger.action('add').succeeded(`Commands added to .adonisrc.json`)

  // run node ace generate:manifest
  await app.container.use('Adonis/Core/Manifest').generate()

  logger.action('create').succeeded('Commands registered')
}
