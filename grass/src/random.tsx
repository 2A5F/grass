import { Context } from 'koishi'
import { Seq, seq } from 'libsugar'

const getRange = /(?<min>\d+)?\.\.(?<max>\d+)?/
const getCount = /[xX]?(?<n>\d+)/

const 用法 = '随机数 [min]..[max] [x数量]'

export function random(ctx: Context) {
  ctx
    .command('随机数 [...opt]', '生成随机数（默认生成一个 0 到 99 的随机数)')
    .usage(用法)
    .example('随机数 5..10 x3')
    .option('float', '-f')
    .alias('random')
    .action(({ options }, ...opts) => {
      let min = 0,
        max = 99,
        n = 1
      if (opts.length > 0) {
        for (const opt of seq(opts).take(2)) {
          let g = getRange.exec(opt)
          if ((g != null && ('min' in g.groups || 'max' in g.groups))) {
            if ('min' in g.groups) {
              min = +g.groups.min
            }
            if ('max' in g.groups) {
              max = +g.groups.max
            }
            continue
          }
          g = getCount.exec(opt)
          if (g != null && 'n' in g.groups) {
            n = +g.groups.n
            continue
          }
          return `用法错误, ${用法}`
        }
      }
      return Seq.range(0, Math.max(Math.floor(n), 1))
        .map(_ => {
          let v: number
          if (options.float) v = Math.random() * (max - min) + min
          else v = Math.floor(Math.random() * (max - min + 1) + min)
          return `${v}`
        })
        .join(', ')
    })
}
