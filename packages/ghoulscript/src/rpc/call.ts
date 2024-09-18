import * as core from '../core'

export type Core = typeof core

export type Commands = keyof Core & string

export type CommandArgs<C extends Commands> = Parameters<Core[C]>

export type CommandResult<C extends Commands> = ReturnType<Core[C]>

export async function callRPC<C extends Commands> (method: C, params: CommandArgs<C>): Promise<CommandResult<C>> {
  if (!Object.prototype.hasOwnProperty.call(core, method) || typeof core[method] !== 'function')
    throw new TypeError(`Invalid action: "${method}"`)

  return await (core[method] as (...args: any[]) => Promise<any>)(...params)
}
