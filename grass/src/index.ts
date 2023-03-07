import { Context, Schema } from 'koishi'
import '@koishijs/plugin-adapter-onebot'
import { base } from './base'
import { choose } from './choose'
import { random } from './random'
import { setu } from './setu'
import { Config } from './config'
export * from './config'

export const name = 'grass'

export function apply(ctx: Context, config: Config) {
  base(ctx)
  choose(ctx)
  random(ctx)
  if (config.setu) {
    setu(ctx, config)
  }
}
