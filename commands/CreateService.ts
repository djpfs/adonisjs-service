import { args, BaseCommand } from '@adonisjs/core/build/standalone'
import fs from 'fs'

export default class CreateService extends BaseCommand {
  public static commandName = 'make:service'

  @args.string({ description: 'Name of the service' })
  public name!: string

  public static description = 'Make a new service class'

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    this.logger.info('Generating service...')
    this.prepareName()
    this.generateService()
    this.generateInterface()
    this.generateProvider()
    this.addProviderToAdonisrc()
    this.logger.success('Done!')
  }

  private prepareName() {
    if (!this.name.toLocaleUpperCase().includes('SERVICE')) {
      this.name = `${this.name}Service`
    }
  }

  private pathExists(path: string) {
    return fs.existsSync(path)
  }

  private generateFile(path: string, data: string) {
    fs.writeFileSync(`${this.application.appRoot}/${path}`, data)
  }

  private pascalCase(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  private readTemplate(template: string) {
    return String(fs.readFileSync(`${this.application.appRoot}/templates/${template}.txt`, 'utf8'))
  }

  private prepareTemplate(template: string) {
    const data = this.readTemplate(template)
    return data.replace(/{{name}}/g, this.pascalCase(this.name))
  }

  private generateService() {
    const path = `app/Services/${this.name}.ts`
    const exists = this.pathExists(path)

    if (exists) {
      this.logger.action('create').skipped(path, 'Service already exists')
      return
    }

    const data = this.prepareTemplate('service')

    this.generateFile(path, data)

    this.logger.action('create').succeeded(path)
  }

  private generateInterface() {
    const path = `contracts/interfaces/${this.name}.ts`
    const exists = this.pathExists(path)

    if (exists) {
      this.logger.action('create').skipped(path, 'Interface already exists')
      return
    }

    const data = this.prepareTemplate('service-interface')

    this.generateFile(path, data)

    this.logger.action('create').succeeded(path)
  }

  private generateProvider() {
    const path = `providers/${this.name}Provider.ts`
    const exists = this.pathExists(path)

    if (exists) {
      this.logger.action('create').skipped(path, 'Provider already exists')
      return
    }

    const data = this.prepareTemplate('service-provider')

    this.generateFile(path, data)

    this.logger.action('create').succeeded(path)
  }

  private addProviderToAdonisrc() {
    const adonisrcPath = `${this.application.appRoot}/.adonisrc.json`
    const adonisrc = JSON.parse(String(fs.readFileSync(adonisrcPath, 'utf8')))
    const providers = adonisrc.providers as string[]
    const provider = `./providers/${this.name}Provider`
    if (providers.includes(provider)) {
      this.logger.action('add').skipped(provider, 'Provider already exists in .adonisrc.json')
      return
    }
    providers.push(provider)
    adonisrc.providers = providers
    fs.writeFileSync(adonisrcPath, JSON.stringify(adonisrc, null, 2))
    this.logger.action('add').succeeded(`${provider} to .adonisrc.json`)
  }
}
