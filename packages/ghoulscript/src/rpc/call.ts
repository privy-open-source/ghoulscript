import * as core from '../core'

export type Core = typeof core

export type Commands = keyof Core & string

export type CommandArgs<C extends Commands> = Parameters<Core[C]>

export type CommandResult<C extends Commands> = ReturnType<Core[C]>

const $core = new Map(Object.entries(core))

export async function callRPC<C extends Commands> (method: C, params: CommandArgs<C>): Promise<CommandResult<C>> {
  const command: ((...args: any[]) => Promise<any>) | undefined = $core.get(method)

  if (typeof command !== 'function')
    throw new TypeError(`Invalid action: "${method}"`)

  return await command(...params)
}
