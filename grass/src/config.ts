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
      js: boolean
      node: boolean
    }
  }
}

export const Config: Schema<Config> = Schema.intersect([
  Schema.object({
    enable: Schema.object({
      verifier: Schema.object({
        read: Schema.boolean().default(false).description('是否启用自动已读所有消息'),
        friend: Schema.boolean().default(false).description('是否启用自动通过好友申请'),
        guild: Schema.boolean().default(false).description('是否启用自动通过入群邀请'),
      }).description('验证器'),
    }),
  }),
  Schema.object({
    enable: Schema.object({
      runner: Schema.object({
        self: Schema.boolean().default(false).description('是否启用代码运行器'),
        js: Schema.boolean().default(false).description('是否启用 js'),
        node: Schema.boolean().default(false).description('是否启用 node'),
      }).description('代码运行器'),
    }).description('工具功能'),
  }),
  Schema.object({
    enable: Schema.object({
      choose: Schema.boolean().default(false).description('是否启用怎么选'),
      random: Schema.boolean().default(false).description('是否启用随机数'),
      setu: Schema.boolean().default(false).description('是否启用涩图'),
      life: Schema.boolean().default(false).description('是否启用生活'),
    }).description('娱乐功能'),
  }),
])
