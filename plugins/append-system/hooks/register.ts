import type { Register, EngineInterface } from 'claude-code'

const FILE = 'APPEND_SYSTEM.md'

// Merged text of the global then project files, read once per session start.
let appended = ''

const readIfPresent = async ($: EngineInterface, path: string) =>
  (await $.fs.exists(path)) ? (await $.fs.read(path)).trim() : ''

const load = async ($: EngineInterface) => {
  const home = await $.env.get('HOME')
  const configDir = (await $.env.get('CLAUDE_CONFIG_DIR')) ?? `${home}/.claude`
  const root = await $.session.root()

  // .claude files merged first, then the harness-neutral .agents ones;
  // a file whose text matches an earlier one (same path, a copy or a
  // symlink) is left out so it is not sent twice.
  const paths = [
    `${configDir}/${FILE}`,
    `${root}/.claude/${FILE}`,
    `${home}/.agents/${FILE}`,
    `${root}/.agents/${FILE}`,
  ]
  const parts = await Promise.all(paths.map(p => readIfPresent($, p)))
  return [...new Set(parts.filter(Boolean))].join('\n\n')
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    appended = await load($)
    return next(e)
  })

  on('prompt.compose', async ($, e, next) => {
    const composed = await next(e)
    if (!appended) return composed
    return {
      sections: [
        ...composed.sections,
        { id: `${$.plugin.name}:append`, text: appended, scope: 'session' },
      ],
    }
  })
}
