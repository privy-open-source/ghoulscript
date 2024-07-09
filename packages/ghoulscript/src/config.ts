import { defu } from 'defu'

export interface Config {
  /**
   * Enable worker
   * @default true
   */
  useWorker: boolean,
}

const config: Config = { useWorker: typeof window !== 'undefined' }

export function useConfig () {
  return config
}

export function configureGS (config_: Partial<Config>) {
  Object.assign(config, defu(config_, config))
}
