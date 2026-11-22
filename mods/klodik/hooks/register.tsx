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


// ---------------------------------------------------------------------------
// Pixel Klodik (SVG), drawn on surfaces that have Svg (desktop, mobile, web).
// A 24 x 18 grid; each cell is one "pixel".
// ---------------------------------------------------------------------------
const C_BODY = '#D97757'
const C_SHADE = '#B85F43'
const C_EYE = '#141414'
const C_LAPTOP = '#1E1E22'
const C_DECK = '#2C2C33'
const C_PIX = '#E8E8E8'

type Px = [number, number, number, number, string] // x, y, w, h, color

const pixelKlodik = (mood: Mood, frame: number): string => {
  const f = frame % 2
  const px: Px[] = []
  const r = (x: number, y: number, w: number, h: number, c: string) => px.push([x, y, w, h, c])

  // Klodik's own look: a rounded body, a sprout on top, rosy cheeks, two feet.
  r(8, 2, 8, 1, C_BODY)
  r(7, 3, 10, 1, C_BODY)
  r(6, 4, 12, 6, C_BODY)
  r(7, 10, 10, 1, C_BODY)
  r(12, 0, 1, 2, '#6FA35B') // sprout stem
  r(13, 0, 2, 1, '#8CC46F') // leaf
  r(7, 7, 2, 1, '#F0A0A0') // cheeks
  r(15, 7, 2, 1, '#F0A0A0')
  r(14, 11, 2, 1, C_SHADE) // feet
  r(17, 11, 2, 1, C_SHADE)

  // eyes
  if (mood === 'done') {
    for (const ex of [8, 14]) { r(ex - 1, 5, 1, 1, C_EYE); r(ex, 4, 1, 1, C_EYE); r(ex + 1, 5, 1, 1, C_EYE) }
  } else if (mood === 'oops') {
    for (const ex of [8, 14]) { r(ex - 1, 3, 1, 1, C_EYE); r(ex + 1, 3, 1, 1, C_EYE); r(ex, 4, 1, 1, C_EYE); r(ex - 1, 5, 1, 1, C_EYE); r(ex + 1, 5, 1, 1, C_EYE) }
  } else if (mood === 'idle' && f === 1) {
    r(8, 5, 1, 1, C_EYE); r(14, 5, 1, 1, C_EYE) // blink
  } else if (mood === 'thinking') {
    r(8 + f, 3, 1, 2, C_EYE); r(14 + f, 3, 1, 2, C_EYE) // looking up, side to side
  } else {
    r(8, 4, 1, 2, C_EYE); r(14, 4, 1, 2, C_EYE)
  }

  // laptop: screen (front-left) and deck
  r(2, 10, 10, 6, C_LAPTOP)
  r(3, 9, 8, 1, C_LAPTOP)
  r(11, 13, 5, 3, C_DECK)
  // screen pixels: change while working
  const screen = mood === 'working' && f === 1
    ? [[5, 12], [6, 13], [8, 12], [9, 13], [7, 14]]
    : [[5, 12], [6, 12], [7, 13], [8, 13], [6, 14]]
  for (const [x, y] of screen) r(x!, y!, 1, 1, C_PIX)

  // arms on the keyboard: tap while working
  const up = mood === 'working' ? f : 0
  r(7, 8 + up, 2, 3 - up, C_SHADE)
  r(12, 10 + (1 - up), 2, 3 - (1 - up), C_SHADE)

  // extras
  if (mood === 'thinking') {
    const dots = f === 0 ? [[18, 0], [20, 1]] : [[19, 0], [21, 1], [22, 0]]
    for (const [x, y] of dots) r(x!, y!, 1, 1, '#9A9A9A')
  }
  if (mood === 'done') {
    const s = f === 0 ? [[3, 1], [21, 3]] : [[2, 3], [21, 0]]
    for (const [x, y] of s) { r(x!, y!, 1, 1, '#F2B84B'); r(x! - 1, y! + 1, 3, 1, '#F2B84B'); r(x!, y! + 2, 1, 1, '#F2B84B') }
  }

  const cells = px.map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`).join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 18" shape-rendering="crispEdges">${cells}</svg>`
}

// One-line faces for the row above the prompt (terminal).
const MINI: Record<Mood, [string, string]> = {
  idle: ['(◕‿◕)', '(−‿−)'],
  thinking: ['(◔~◔)∘', '(◑~◑)°'],
  working: ['(●▿●)╯', '╰(●▿●)'],
  done: ['✦(^◡^)', '(^◡^)✦'],
  oops: ['(×︵×)', '(;︵;)'],
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

  // A message that mentions Klodik counts as the person asking: the pane is
  // then placed at any width (an unasked open waits on narrow screens).
  on('prompt.submit', async ($, e, next) => {
    if (/клодик|klodik/i.test(e.text)) {
      const opened = await $.ui.open({ id: PANE, title: 'Мини-Клодик' }).catch(() => undefined)
      if (opened && !opened.isPlaced) $.ui.log(`Клодик: панель не поместилась (${opened.reason})`)
      else $.ui.toast('Клодик тут 👋')
    }
    return next(e)
  })

  // Always-visible one-line Klodik above the prompt, on every screen width.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const b = await read($, buddy)
    if (e.surface !== 'terminal') {
      const { Box, Text, Svg } = $.ui.resolve(e)
      return (
        <Box flexDirection="row" alignItems="center">
          <Svg source={pixelKlodik(b.mood, b.frame)} alt={`Клодик: ${label(b)}`} width={40} height={30} />
          <Text> Клодик: {label(b)}</Text>
        </Box>
      )
    }
    const { Box, Text } = $.ui.resolve(e)
    return (
      <Box>
        <Text color={ORANGE}>{MINI[b.mood][b.frame % 2] ?? MINI.idle[0]} </Text>
        <Text>Клодик: {label(b)}</Text>
      </Box>
    )
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
    const b = await read($, buddy)
    if (e.surface !== 'terminal') {
      const { Box, Text, Svg } = $.ui.resolve(e)
      return (
        <Box flexDirection="column" alignItems="center">
          <Svg source={pixelKlodik(b.mood, b.frame)} alt={`Клодик: ${label(b)}`} width={192} height={144} />
          <Text bold>{label(b)}</Text>
          {b.doneCount > 0 && <Text dimColor>сделано задач: {b.doneCount}</Text>}
        </Box>
      )
    }
    const { Box, Text } = $.ui.resolve(e)
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
