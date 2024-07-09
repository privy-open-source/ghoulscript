import { defu } from 'defu'
import { withBase } from 'ufo'
import meta from '@privyid/ghostscript/meta'
import { name, version } from '../package.json'

export interface Config {
  /**
   * Enable worker
   * @default true
   */
  useWorker: boolean,
  /**
   * Enable CDN
   * @default true
   */
  useCDN: boolean,
  /**
   * CDN BaseURL
   * @default 'https://unpkg.com/'
   */
  cdnURL: string,
}

let config: Config = {
  useWorker: typeof window !== 'undefined',
  useCDN   : true,
  cdnURL   : 'https://unpkg.com/',
}

export function useConfig () {
  return config
}

export function configureGS (config_: Partial<Config>) {
  config = defu(config_, config)
}

export function getWorkerURL () {
  return withBase(`${name as string}@${version as string}/dist/rpc.worker.mjs`, config.cdnURL)
}

export function getFileURL (url: string) {
  return withBase(`${meta.name}@${meta.version}/dist/${url}`, config.cdnURL)
}
