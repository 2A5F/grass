import { Context, Schema } from 'koishi'
import '@koishijs/plugin-adapter-onebot'
import { base } from './base'
import { choose } from './choose'
import { random } from './random'
import { setu } from './setu'

export const name = 'grass'

export interface Config {}

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  base(ctx)
  choose(ctx)
  random(ctx)
  setu(ctx)
}
