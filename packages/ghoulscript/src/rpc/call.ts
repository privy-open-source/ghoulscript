import * as core from '../core'

export type Core = typeof core

export type Commands = keyof Core & string

export type CommandArgs<C extends Commands> = Parameters<Core[C]>

export type CommandResult<C extends Commands> = ReturnType<Core[C]>

export async function callRPC<C extends Commands> (name: C, args: CommandArgs<C>): Promise<CommandResult<C>> {
  if (typeof core[name] !== 'function')
    throw new TypeError(`Invalid action: "${name}"`)

  return await (core[name] as (...args: any[]) => Promise<any>)(...args)
}
