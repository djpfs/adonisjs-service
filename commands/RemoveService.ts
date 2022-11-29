import { BaseCommand, args } from '@adonisjs/core/build/standalone'
import fs from 'fs'

export default class RemoveService extends BaseCommand {
  public static commandName = 'remove:service'

  @args.string({ description: 'Name of the service' })
  public name!: string

  public static description = 'Remove a service class with its interface and provider'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    this.prepareName()
    this.logger.info(`Removing ${this.name}...`)
    this.removeFile(`providers/${this.name}Provider.ts`)
    this.logger.action('Removed').succeeded(`${this.name} provider`)
    this.removeFile(`app/Services/${this.name}.ts`)
    this.logger.action('Removed').succeeded(`${this.name} service`)
    this.removeFile(`contracts/interfaces/${this.name}.ts`)
    this.logger.action('Removed').succeeded(`${this.name} interface`)
    this.removeProviderFromAdonisrc()
    this.logger.action('Removed').succeeded(`${this.name} from .adonisrc.json providers`)
    this.logger.success('Done!')
  }

  private prepareName() {
    if (!this.name.toLocaleUpperCase().includes('SERVICE')) {
      this.name = `${this.name}Service`
    }
    this.name = this.pascalCase(this.name)
  }

  private pathExists(path: string) {
    return fs.existsSync(path)
  }

  private pascalCase(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  private removeFile(path: string) {
    if (this.pathExists(path)) {
      fs.unlinkSync(`${this.application.appRoot}/${path}`)
    }
  }

  private removeProviderFromAdonisrc() {
    const adonisrcPath = `${this.application.appRoot}/.adonisrc.json`
    const adonisrc = JSON.parse(String(fs.readFileSync(adonisrcPath, 'utf8')))
    const providers = adonisrc.providers as string[]
    const provider = `./providers/${this.name}Provider`
    if (!providers.includes(provider)) {
      return
    }
    const index = providers.indexOf(provider)
    providers.splice(index, 1)
    fs.writeFileSync(adonisrcPath, JSON.stringify(adonisrc, null, 2))
  }
}
