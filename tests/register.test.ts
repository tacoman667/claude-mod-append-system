import { expect, test } from 'claude-code/testing'

const BASE = [{ id: 'intro', text: 'core', scope: 'shared' }] as const

const setup = async ($: any, on: any, files: Record<string, string>) => {
  on('env.get', (_: unknown, e: { name: string }) => ({
    value: e.name === 'HOME' ? '/home/u' : undefined,
  }))
  on('session.root', () => ({ value: '/proj' }))
  on('fs.exists', (_: unknown, e: { path: string }) => ({ value: e.path in files }))
  on('fs.read', (_: unknown, e: { path: string }) => ({ value: files[e.path] }))
  on('session.start', (_: unknown, e: { cwd: string }) => ({ cwd: e.cwd }))
  on('prompt.compose', () => ({ sections: BASE }))
  await $.session.start({ cwd: '/proj', surface: 'terminal', isInteractive: true })
  return (await $.prompt.compose({ model: 'm', promptModel: 'm', surfaces: [], tools: [], outputStyle: null, traits: [] })).sections
}

test('global then project, appended last', async ($, on) => {
  const sections = await setup($, on, {
    '/home/u/.claude/APPEND_SYSTEM.md': 'GLOBAL\n',
    '/proj/.claude/APPEND_SYSTEM.md': 'PROJECT\n',
  })
  expect(sections.at(-1)).toEqual({
    id: 'append-system:append', text: 'GLOBAL\n\nPROJECT', scope: 'session',
  })
})

test('.claude pair merged before .agents pair', async ($, on) => {
  const sections = await setup($, on, {
    '/home/u/.claude/APPEND_SYSTEM.md': 'GC',
    '/proj/.claude/APPEND_SYSTEM.md': 'PC',
    '/home/u/.agents/APPEND_SYSTEM.md': 'GA',
    '/proj/.agents/APPEND_SYSTEM.md': 'PA',
  })
  expect(sections.at(-1)?.text).toBe('GC\n\nPC\n\nGA\n\nPA')
})

test('project only', async ($, on) => {
  const sections = await setup($, on, { '/proj/.claude/APPEND_SYSTEM.md': 'PROJECT' })
  expect(sections.at(-1)?.text).toBe('PROJECT')
})

test('no files leaves the prompt alone', async ($, on) => {
  const sections = await setup($, on, {})
  expect(sections).toEqual(BASE)
})
