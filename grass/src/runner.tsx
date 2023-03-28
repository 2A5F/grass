import { Context, Session } from 'koishi'
import { Config } from './config'
import { run, hasRuntime } from '@makegrass/grass-runner'

export function runner(ctx: Context, config: Config) {
  ctx
    .command('执行 <code:text>')
    .option('runtime', '-r <rt:string>', { value: 'node-eval' })
    .action(({ session, options }, code) => runCode(session, options.runtime, code))
    .shortcut('js', { options: { runtime: 'node-eval' }, fuzzy: true })
    .shortcut('node', { options: { runtime: 'node' }, fuzzy: true })
}

async function runCode(session: Session<never, never>, rt: string, code: string) {
  if (!code?.trim()) {
    session.send(session.text('.no-code'))
    return
  }
  if (!hasRuntime(rt)) {
    session.send(session.text('.unknow-rt'))
    return
  }
  try {
    const r = await run(
      {
        runtime: rt,
        code,
      },
      msg => {
        session.send(<code>{msg}</code>)
      },
      err => {
        session.send(<code>{err}</code>)
      }
    )
    if (!r) {
      session.send(session.text('.noret'))
    }
  } catch (e) {
    session.send(<code>{e}</code>)
  }
}
