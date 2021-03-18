declare class Svelte {
  constructor(options: { target: Element; data?: any; store?: any })

  public get(name?: string): any
  public set(data: any): void

  public on(
    eventName: string,
    callback?: (event?: any) => any,
  ): () => { cancel: () => any }

  public fire(eventName: string, event?: any): void

  public observe(
    name: string,
    callback: (newValue?: any, oldValue?: any) => any,
    options?: { init?: boolean; defer?: boolean },
  ): () => { cancel: () => any }

  public oncreate(): void

  public ondestroy(): void

  public destroy(): void

  public refs: RefCollection
}

interface RefCollection {
  [name: string]: Svelte | HTMLElement
}
