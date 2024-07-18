type OnChange<T> = (value: T) => void

type OffChange = () => void

interface Ref <T> {
  value: T,
  change: (fn: OnChange<T>) => OffChange,
  toBe: (expect: T) => Promise<void>,
}

/**
 * Reactive variable
 *
 * @param initialValue initial value
 * @example
 *
 * const isBusy = useRef(false)
 *
 * function onClick () {
 *    // Wait other tobe done
 *    if (isBusy.value)
 *      await isBusy.toBe(false)
 *
 *    isBusy.value = true
 *
 *    // Heavy async function
 *    setTimeout(() => {
 *      isBusy.value = false
 *    },5000)
 * }
 */
export function useRef<T = any> (): Ref<T | undefined>
export function useRef<T = any> (initialValue: T): Ref<T>
export function useRef<T> (initialValue?: T): Ref<T | undefined> {
  let value: T | undefined = initialValue

  const watcher = new Set<OnChange<T>>()

  return {
    /**
     * Get value
     */
    get value (): T | undefined {
      return value
    },

    /**
     * Set value
     */
    set value (newValue: T) {
      value = newValue

      // emit on-change
      for (const emit of watcher)
        emit(newValue)
    },

    /**
     * Add on change listener
     * @param fn on change handler
     */
    change (fn: OnChange<T>): OffChange {
      watcher.add(fn)

      return () => {
        watcher.delete(fn)
      }
    },

    /**
     * Wait until
     * @param expect expected value
     */
    // eslint-disable-next-line @typescript-eslint/promise-function-async
    toBe (expect: T | undefined) {
      return new Promise<void>((resolve) => {
        const stop = this.change((value) => {
          if (value === expect) {
            stop()
            resolve()
          }
        })
      })
    },
  }
}
