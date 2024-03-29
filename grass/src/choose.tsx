import { Context } from 'koishi'

export function choose(ctx: Context) {
  ctx
    .command('怎么选 [...items]', '选择困难症？帮你选')
    .example('怎么选 肯德基 金拱门')
    .alias('choose')
    .action(({session}, ...items) =>
      items.length == 0 ? (
        session.text('.none')
      ) : (
        <random>{items.map(m => `${session.text('.choose')} ${m}`)}</random>
      )
    )
}
