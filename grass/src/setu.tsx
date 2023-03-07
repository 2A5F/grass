import { Context } from 'koishi'
import { seq } from 'libsugar'
import { Config } from './config'
import { logger } from './logger'

const 图源 = 'https://api.lolicon.app/setu/v2'

type SetuRes = {
  /** 错误信息 */
  error: string
  /* *色图数组 */
  data: Setu[]
}

type Setu = {
  /** 作品 pid */
  pid: number
  /** 作品所在页 */
  p: number
  /** 作者 uid */
  uid: number
  /** 作品标题 */
  title: string
  /** 作者名（入库时，并过滤掉 @ 及其后内容） */
  author: string
  /** 是否 R18（在库中的分类，不等同于作品本身的 R18 标识） */
  r18: boolean
  /** 原图宽度 px */
  width: number
  /** 原图高度 px */
  height: number
  /** 作品标签，包含标签的中文翻译（有的话） */
  tags: string[]
  /** 图片扩展名 */
  ext: string
  /** 是否是 AI 作品，0 未知（旧画作或字段未更新），1 不是，2 是 */
  aiType: number
  /** 作品上传日期；时间戳，单位为毫秒 */
  uploadDate: number
  /** 包含了所有指定size的图片地址 */
  urls: Urls
}

type Urls = {
  original: string
}

export function setu(ctx: Context, config: Config) {
  ctx
    .command('涩图 [...tag]')
    .option('r18', '-r <string>', { fallback: 'mixed' })
    .option('num', '-n <number>', { fallback: 1 })
    .option('keyword', '-k <string>', {})
    .option('noAi', '-A', { fallback: true })
    .action(async ({ session, options: { r18, num, keyword, noAi } }, ...tag) => {
      if (num <= 0) return session.text('.need-gt0')
      else if (num > 20) return session.text('.need-le20')

      // map r18
      if (session.platform == 'onebot') r18 = 0
      else if (r18 == 'false' || r18 == '0') r18 = 0
      else if (r18 == 'mixed' || r18 == 'mix' || r18 == 'm' || r18 == '2') r18 = 2
      else r18 = 1

      if (session.platform == 'onebot' && r18 != 0) {
        r18 = 0
        session.send(session.text('.no-setu'))
      }

      try {
        const r: SetuRes = await ctx.http('post', 图源, {
          data: { r18, num, keyword, tag, excludeAI: noAi, size: 'original' },
        })
        logger.info(`[涩图][平台 ${session.platform}]：${JSON.stringify(r)}`)
        if (r.error) {
          session.send(session.text('.err'))
          session.send(r.error)
          return
        } else if (r.data == null || r.data.length <= 0) {
          session.send(session.text('.notfound'))
          return
        } else {
          if (session.platform == 'onebot') {
            const msg = (
              <figure>
                {seq(r.data)
                  .map(s => (
                    <message user-id={session.userId} nickname={session.author?.nickname || session.username}>
                      <author user-id={session.userId} nickname={session.author?.nickname || session.username}></author>
                      <image url={s.urls.original}></image>
                    </message>
                  ))
                  .toArray()}
              </figure>
            )
            session.send(msg)
          } else {
            const msg = (
              <figure>
                <message user-id={session.userId} nickname={session.author?.nickname || session.username}>
                  <author user-id={session.userId} nickname={session.author?.nickname || session.username}></author>
                  {seq(r.data)
                    .map(s => <image url={s.urls.original}></image>)
                    .toArray()}
                </message>
              </figure>
            )
            session.send(msg)
          }
        }
      } catch (e) {
        session.send(session.text('.err'))
        throw e
      }
    })
}
