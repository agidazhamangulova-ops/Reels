import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Buddy, Mood } from '../types'

/**
 * Mini-Claude: a tiny buddy in a pane beside the chat (and a line in the
 * status bar) that shows what Claude is doing right now.
 */

const PANE = 'klodik'
const ORANGE = '#D97757'

const buddy = atom(
  { plugin: 'klodik', key: 'buddy' } as const,
  { mood: 'idle', tool: '', frame: 0, doneCount: 0 } as Buddy,
  { shape: 'buddy-1' },
)

// Two frames per mood: the second one is a blink / wiggle.
const FACES: Record<Mood, [string[], string[]]> = {
  idle: [
    ['  ▗▄▄▄▖  ', ' ▐ ◕ ◕ ▌ ', ' ▐  ‿  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
    ['  ▗▄▄▄▖  ', ' ▐ − − ▌ ', ' ▐  ‿  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
  ],
  thinking: [
    ['  ▗▄▄▄▖ ∘', ' ▐ ◔ ◔ ▌°', ' ▐  ~  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
    ['  ▗▄▄▄▖° ', ' ▐ ◑ ◑ ▌ ∘', ' ▐  ~  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
  ],
  working: [
    ['  ▗▄▄▄▖  ', ' ▐ ● ● ▌ ', ' ▐  ▿  ▌╯', '  ▝▀▀▀▘  ', '  ▘   ▝  '],
    ['  ▗▄▄▄▖  ', ' ▐ ● ● ▌ ', '╰▐  ▿  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
  ],
  done: [
    [' ✦▗▄▄▄▖  ', ' ▐ ^ ^ ▌ ', ' ▐  ◡  ▌ ', '  ▝▀▀▀▘ ✦', '   ▘ ▝   '],
    ['  ▗▄▄▄▖✦ ', ' ▐ ^ ^ ▌ ', ' ▐  ◡  ▌ ', ' ✦▝▀▀▀▘  ', '   ▘ ▝   '],
  ],
  oops: [
    ['  ▗▄▄▄▖  ', ' ▐ × × ▌ ', ' ▐  ︵  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
    ['  ▗▄▄▄▖  ', ' ▐ ; ; ▌ ', ' ▐  ︵  ▌ ', '  ▝▀▀▀▘  ', '   ▘ ▝   '],
  ],
}

// What each tool looks like to a person.
const TOOL_WORDS: Record<string, string> = {
  Bash: 'запускает команду',
  Read: 'читает файл',
  Write: 'пишет файл',
  Edit: 'правит файл',
  Grep: 'ищет в коде',
  Glob: 'ищет файлы',
  WebSearch: 'ищет в интернете',
  Agent: 'зовёт помощника',
  Skill: 'берёт навык',
}

const label = (b: Buddy): string => {
  switch (b.mood) {
    case 'idle':
      return 'жду тебя'
    case 'thinking':
      return 'думаю…'
    case 'working':
      return TOOL_WORDS[b.tool] ?? (b.tool.startsWith('mcp__') ? 'работает с сервисом' : `работаю: ${b.tool}`)
    case 'done':
      return 'готово!'
    case 'oops':
      return 'упс, что-то пошло не так'
  }
}

const setMood = async ($: EngineInterface, mood: Mood, tool = '') => {
  await update($, buddy, b => ({ ...b, mood, tool, doneCount: mood === 'done' ? b.doneCount + 1 : b.doneCount }))
  const b = await read($, buddy)
  void $.ui.status(`✻ Клодик: ${label(b)}`)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'klodik', description: 'Показать мини-Клодика рядом с чатом' })
    void $.ui.open({ id: PANE, title: 'Мини-Клодик' })
    await update($, buddy, b => ({ ...b, mood: 'idle' as Mood, tool: '' }))
    void $.ui.status('✻ Клодик: жду тебя')
    // Gentle animation: flip the frame twice a second.
    $.clock.every(500, () => update($, buddy, b => ({ ...b, frame: (b.frame + 1) % 2 })))
    return next(e)
  })

  on('command.run', { command: 'klodik' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Мини-Клодик' })
    return { text: 'Мини-Клодик рядом 👋' }
  })

  on('turn.start', async ($, e, next) => {
    await setMood($, 'thinking')
    return next(e)
  })

  // The buddy is decoration: it must never get in the way of a tool call.
  on('tool.call', async ($, e, next) => {
    await setMood($, 'working', e.tool).catch(() => undefined)
    const result = await next(e)
    await setMood($, 'thinking').catch(() => undefined)
    return result
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    await setMood($, e.reason === 'answer' ? 'done' : e.reason === 'aborted' ? 'idle' : 'oops')
    // After a few seconds of being happy, go back to waiting.
    $.clock.after(6000, async () => {
      const b = await read($, buddy)
      if (b.mood === 'done' || b.mood === 'oops') await setMood($, 'idle')
    })
    return done
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const b = await read($, buddy)
    const face = FACES[b.mood][b.frame % 2] ?? FACES.idle[0]
    return (
      <Box flexDirection="column" alignItems="center">
        {face.map(line => (
          <Text color={ORANGE}>{line}</Text>
        ))}
        <Text bold>{label(b)}</Text>
        {b.doneCount > 0 && <Text dimColor>сделано задач: {b.doneCount}</Text>}
      </Box>
    )
  })
}
