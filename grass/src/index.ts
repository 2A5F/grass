import { Context } from 'koishi'
import '@koishijs/plugin-adapter-onebot'
import { base } from './base'
import { choose } from './choose'
import { random } from './random'
import { setu } from './setu'
import { Config } from './config'
import { life } from './life'
import { runner } from './runner'
export * from './config'

export const name = 'grass'

export function apply(ctx: Context, config: Config) {
  ctx.i18n.define('zh', require('./locales/zh'))
  base(ctx, config)
  if (config.enable.choose) {
    choose(ctx)
  }
  if (config.enable.random) {
    random(ctx)
  }
  if (config.enable.setu) {
    setu(ctx, config)
  }
  if (config.enable.life) {
    life(ctx, config)
  }
  if (config.enable.runner) {
    runner(ctx, config)
  }
}
