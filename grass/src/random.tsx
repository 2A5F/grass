import { Context } from 'koishi'
import { Seq, seq } from 'libsugar'

const getRange = /(?<min>\d+)?\.\.(?<max>\d+)?/
const getCount = /[xX]?(?<n>\d+)/

export function random(ctx: Context) {
  ctx
    .command('随机数 [...opt]')
    .example('随机数 5..10 x3')
    .option('float', '-f')
    .alias('random')
    .action(({ session, options }, ...opts) => {
      let min = 0,
        max = 99,
        n = 1
      if (opts.length > 0) {
        for (const opt of seq(opts).take(2)) {
          let g = getRange.exec(opt)
          if (g != null && ('min' in g.groups || 'max' in g.groups)) {
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
          return session.text('.usage_err')
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
