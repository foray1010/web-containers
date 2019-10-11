declare class Svelte {
  constructor(options: { target: Element; data?: any; store?: any })

  get(name?: string): any
  set(data: any): void

  on(
    eventName: string,
    callback?: (event?: any) => any,
  ): () => { cancel: () => any }

  fire(eventName: string, event?: any): void

  observe(
    name: string,
    //@ts-ignore
    callback: (newValue?, oldValue?) => any,
    options?: { init?: boolean; defer?: boolean },
  ): () => { cancel: () => any }

  oncreate(): void

  ondestroy(): void

  destroy(): void

  refs: RefCollection
}

interface RefCollection {
  [name: string]: Svelte | HTMLElement
}
