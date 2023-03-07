import { Schema } from 'koishi'

export interface Config {
  setu: boolean
}

export const Config: Schema<Config> = Schema.object({
  setu: Schema.boolean().default(false).description('是否启用涩图'),
})
