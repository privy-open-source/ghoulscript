import type { CommandArgs, Commands } from './call'

export async function callLocalRPC<C extends Commands, A extends CommandArgs<C>> (name: C, args: A) {
  // eslint-disable-next-line unicorn/no-await-expression-member
  return (await import('./call')).callRPC(name, args)
}
