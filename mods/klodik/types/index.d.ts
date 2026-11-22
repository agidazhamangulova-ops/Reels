export type Mood = 'idle' | 'thinking' | 'working' | 'done' | 'oops'
export type Buddy = { mood: Mood; tool: string; frame: number; doneCount: number }

declare module 'claude-code' {
  interface PluginState {
    'klodik': { buddy: Shaped<Buddy> }
  }
}
