import {
  Bindable,
  InputBindingApi,
  InputParams,
  TpChangeEvent,
} from '@tweakpane/core'

import {
  MutableRefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { FolderInstance } from './usePaneFolder'

type InputRef<T> = MutableRefObject<InputBindingApi<unknown, T>>

/**
 * Does not return the value and doesn't trigger an update because onChange is specified
 */
export function usePaneInput<T extends Bindable, K extends keyof T>(
  ref: MutableRefObject<FolderInstance<T>>,
  key: K,
  inputParams: InputParams | undefined,
  onChange: (event: TpChangeEvent<T[K]>) => void
): [never, (value: T[K]) => void, InputRef<T[K]>]

// Skips inputParams
/** Does not return the value and doesn't trigger an update because onChange is specified */
export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<FolderInstance<T>>,
  key: K,
  onChange: (event: TpChangeEvent<T[K]>) => void
): [never, (value: T[K]) => void, InputRef<T[K]>]

/**
 * Returns the value and triggers an update
 */
export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<FolderInstance<T>>,
  key: K,
  inputParams?: InputParams | undefined,
  onChange?: undefined
): [T[K], (value: T[K]) => void, InputRef<T[K]>]

export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<FolderInstance<T>>,
  key: K,
  inputParams?: InputParams | undefined,
  onChange?: undefined
): [T[K], (value: T[K]) => void, InputRef<T[K]>]

export function usePaneInput<T extends Bindable, K extends keyof T>(
  parentRef: MutableRefObject<FolderInstance<T>>,
  key: K,
  inputParamsArg:
    | InputParams
    | ((event: TpChangeEvent<T[K]>) => void)
    | undefined = {},
  onChange: ((event: TpChangeEvent<T[K]>) => void) | undefined = undefined
) {
  const [value, set] = useState(parentRef.current.params[key])

  const inputRef = useRef<InputBindingApi<unknown, T[K]>>(null!)

  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  const setValue = useCallback((value: T[K]) => {
    inputRef.current.controller_.binding.target.write(value)
    inputRef.current.refresh()
  }, [])

  const inputParams = typeof inputParamsArg === 'function' ? {} : inputParamsArg

  if (inputRef.current) {
    inputRef.current.hidden = Boolean(inputParams.hidden)
    inputRef.current.disabled = Boolean(inputParams.disabled)
  }

  useLayoutEffect(() => {
    const pane = parentRef.current.instance
    if (pane == null) return

    const handler: (event: TpChangeEvent<T[K]>) => void = onChange
      ? (event) => callbackRef.current!(event)
      : (event) => set(event.value)

    const input = pane
      .addInput(parentRef.current.params, key, inputParams)
      .on('change', handler)

    inputRef.current = input

    return () => {
      if (input.element) input.dispose()
    }
  }, [key, onChange])

  return [onChange == null ? value : undefined, setValue, inputRef]
}
