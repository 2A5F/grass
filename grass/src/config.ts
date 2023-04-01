import { Runtime } from '@makegrass/grass-runner'
import { Schema } from 'koishi'

export interface Config {
  enable: {
    verifier: {
      read: boolean
      friend: boolean
      guild: boolean
    }
    choose: boolean
    random: boolean
    setu: boolean
    life: boolean
    runner: {
      self: boolean
    }
  }
  runner: {
    shortcuts: { name: string; runtime: string }[]
    cpus?: number
    memory?: number | string
    memorySwap?: number | string
    timeout?: number
  }
}

const RunnerRuntime: Schema<Runtime> = Schema.union([Schema.const('node' as const), Schema.const('node-eval' as const)])

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    enable: Schema.object({
      verifier: Schema.object({
        read: Schema.boolean().default(false).description('是否启用自动已读所有消息'),
        friend: Schema.boolean().default(false).description('是否启用自动通过好友申请'),
        guild: Schema.boolean().default(false).description('是否启用自动通过入群邀请'),
      }),
    }),
  }).description('验证器'),
  Schema.object({
    enable: Schema.object({
      runner: Schema.object({
        self: Schema.boolean().default(false).description('是否启用代码运行器'),
      }),
    }),
    runner: Schema.object({
      shortcuts: Schema.array(
        Schema.object({
          name: Schema.string(),
          runtime: RunnerRuntime,
        })
      )
        .default([
          { name: 'js', runtime: 'node-eval' },
          { name: 'node', runtime: 'node' },
        ])
        .description('别名设置'),
      cpus: Schema.number().default(1).description('cpu 限制'),
      memory: Schema.string().default('128m').description('内存限制'),
      memorySwap: Schema.string().default('512m').description('总内存(内存+虚拟内存)限制'),
      timeout: Schema.number().default(60).description('超时时间，单位秒'),
    }),
  }).description('代码运行器'),
  Schema.object({
    enable: Schema.object({
      choose: Schema.boolean().default(false).description('是否启用怎么选'),
      random: Schema.boolean().default(false).description('是否启用随机数'),
      setu: Schema.boolean().default(false).description('是否启用涩图'),
      life: Schema.boolean().default(false).description('是否启用生活'),
    }),
  }).description('娱乐功能'),
])
