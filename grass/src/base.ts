import { Context } from 'koishi'
import { Config } from './config'

export function base(ctx: Context, config: Config) {
  if (config.enable.verifier.read) {
    ctx.on('message', async session => {
      if (session.platform == 'onebot') {
        const onebot = session.onebot!
        await onebot.markMsgAsRead(session.messageId!)
      }
    })
  }
  if (config.enable.verifier.friend) {
    ctx.on('friend-request', async session => {
      const bot = session.bot
      await bot.handleFriendRequest(session.messageId!, true)
    })
  }
  if (config.enable.verifier.guild) {
    ctx.on('guild-request', async session => {
      const bot = session.bot
      await bot.handleGuildRequest(session.messageId!, true)
    })
  }
}
