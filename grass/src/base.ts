import { Context } from 'koishi'

export function base(ctx: Context) {
  ctx.on('message', async session => {
    if (session.platform == 'onebot') {
      const onebot = session.onebot!
      await onebot.markMsgAsRead(session.messageId!)
    }
  })
  ctx.on('friend-request', async session => {
    const bot = session.bot
    await bot.handleFriendRequest(session.messageId!, true)
  })
  ctx.on('guild-request', async session => {
    const bot = session.bot
    await bot.handleGuildRequest(session.messageId!, true)
  })
}
