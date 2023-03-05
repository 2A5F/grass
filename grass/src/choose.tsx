import { Context } from 'koishi'

export function choose(ctx: Context) {
  ctx
    .command('怎么选 [...items]', '选择困难症？帮你选')
    .example('怎么选 肯德基 金拱门')
    .alias('choose')
    .action((_, ...items) =>
      items.length == 0 ? (
        <random>
          <template>选尼玛</template>
          <template>选空气</template>
        </random>
      ) : (
        <random>{items.map(m => `选 ${m}`)}</random>
      )
    )
}
