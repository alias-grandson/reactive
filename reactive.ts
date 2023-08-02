type ReactiveStateSetFunction<T> = (state: T) => void;

export class ReactiveState<T> {
  private state: T;
  private listeners: ReactiveStateSetFunction<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  public addListener(listener: ReactiveStateSetFunction<T>): void {
    this.listeners.push(listener);
  }

  public triggerUpdate(): void {
    for (let listener of this.listeners) {
      listener(this.state);
    }
  }

  public getState(): T {
    return this.state;
  }

  public setState(newState: T): void {
    this.state = newState;
    this.triggerUpdate();
  }
}

export function reactive<T extends object>(state: ReactiveState<T>): T {
  return new Proxy(state.getState(), {
    set: (target: T, prop: string | symbol, value: any): boolean => {
      if (typeof prop === 'string') {
        (target as any)[prop] = value;
        state.triggerUpdate();
      }
      return true;
    },
  }) as T;
}
