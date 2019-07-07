import { createContainer, Lifetime, InjectionMode, asValue, GlobWithOptions } from 'awilix'
import { logger } from './logger'

const modulesToLoad: Array<string | GlobWithOptions> = [
  ['**/*/*-service.{ts,js}', Lifetime.SCOPED],
  ['**/*/*-store.{ts,js}', Lifetime.SINGLETON]
]

export function configureContainer() {
  const opts = {
    injectionMode: InjectionMode.CLASSIC
  }
  return createContainer(opts)
    .loadModules(modulesToLoad, {
      cwd: `${__dirname}/..`,
      formatName: 'camelCase'
    })
    .register({
      logger: asValue(logger)
    })
}
