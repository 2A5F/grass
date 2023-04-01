import { Context, Session } from 'koishi'
import { Config } from './config'
import { run, hasRuntime } from '@makegrass/grass-runner'
import { logger } from './logger'

export function runner(ctx: Context, config: Config) {
  let cmd = ctx
    .command('执行 <code:text>')
    .option('runtime', '-r <rt:string>', { value: 'node-eval' })
    .action(({ session, options }, code) => runCode(session, options.runtime, code, config))
  for (const { name, runtime } of config.runner.shortcuts) {
    cmd = cmd.shortcut(name, { options: { runtime }, fuzzy: true })
  }
}

const ansi_escape = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

async function runCode(session: Session<never, never>, rt: string, code: string, config: Config) {
  if (!code?.trim()) {
    session.send(session.text('.no-code'))
    return
  }
  code = code.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&')
  if (!hasRuntime(rt)) {
    session.send(session.text('.unknow-rt'))
    return
  }
  try {
    logger.info('[执行环境] %s', rt)
    logger.info('[执行输入] %s', code)
    const r = await run(
      {
        runtime: rt,
        code,
        cpus: config.runner.cpus,
        memory: config.runner.memory,
        memorySwap: config.runner.memorySwap,
        timeout: config.runner.timeout,
      },
      msg => {
        logger.info('[执行输出] %s', `${msg}`)
        msg = msg.replace(ansi_escape, '')
        session.send(msg.trim() == '' ? session.text('.noret') : msg)
      },
      err => {
        logger.error('[执行输出] %s', `${err}`)
        err = err.replace(ansi_escape, '')
        session.send(err.trim() == '' ? session.text('.noret') : err)
      }
    )
    if (!r) {
      logger.info('[执行输出] 无返回或超时')
      session.send(session.text('.noret'))
    }
  } catch (e) {
    logger.error('%o', e)
    session.send(e)
  }
}
