import { InputBindingApi, BindingParams, TpChangeEvent } from '@tweakpane/core'

import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { FolderInstance } from './usePaneFolder'

type InputRef<T> = RefObject<InputBindingApi<unknown, T>>

/**
 * Does not return the value and doesn't trigger an update because onChange is specified
 */
export function usePaneInput<T extends Object, K extends keyof T>(
  ref: RefObject<FolderInstance<T>>,
  key: K,
  BindingParams: BindingParams | undefined,
  onChange: (event: TpChangeEvent<T[K]>) => void
): [never, (value: T[K]) => void, InputRef<T[K]>]

// Skips BindingParams
/** Does not return the value and doesn't trigger an update because onChange is specified */
export function usePaneInput<T extends Object, K extends keyof T>(
  paneRef: RefObject<FolderInstance<T>>,
  key: K,
  onChange: (event: TpChangeEvent<T[K]>) => void
): [never, (value: T[K]) => void, InputRef<T[K]>]

/**
 * Returns the value and triggers an update
 */
export function usePaneInput<T extends Object, K extends keyof T>(
  paneRef: RefObject<FolderInstance<T>>,
  key: K,
  BindingParams?: BindingParams | undefined,
  onChange?: undefined
): [T[K], (value: T[K]) => void, InputRef<T[K]>]

export function usePaneInput<T extends Object, K extends keyof T>(
  paneRef: RefObject<FolderInstance<T>>,
  key: K,
  BindingParams?: BindingParams | undefined,
  onChange?: undefined
): [T[K], (value: T[K]) => void, InputRef<T[K]>]

export function usePaneInput<T extends Object, K extends keyof T>(
  parentRef: RefObject<FolderInstance<T>>,
  key: K,
  inputParamsArg:
    | BindingParams
    | ((event: TpChangeEvent<T[K]>) => void)
    | undefined = {},
  onChangeArg: ((event: TpChangeEvent<T[K]>) => void) | undefined = undefined
) {
  const BindingParams = typeof inputParamsArg === 'function' ? {} : inputParamsArg
  const onChange =
    typeof inputParamsArg === 'function' ? inputParamsArg : onChangeArg

  const [value, set] = useState(parentRef.current!.params[key])

  const inputRef = useRef<InputBindingApi<unknown, T[K]>>(null!)

  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  const setValue = useCallback((value: T[K]) => {
    // inputRef.current.controller_.binding.target.write(value)
    inputRef.current.controller.value.binding.write(value)
    inputRef.current.refresh()
  }, [])

  if (inputRef.current) {
    inputRef.current.hidden = Boolean(BindingParams.hidden)
    inputRef.current.disabled = Boolean(BindingParams.disabled)
  }

  useLayoutEffect(() => {
    const pane = parentRef.current?.instance
    if (pane == null) return

    const handler: (event: TpChangeEvent<T[K]>) => void = onChange
      ? (event) => callbackRef.current!(event)
      : (event) => set(event.value)

    const input = pane
      .addBinding(parentRef.current!.params, key, BindingParams)
      .on('change', handler)
      
    inputRef.current = input as InputBindingApi<unknown, T[K]>
    // inputRef.current.controller.importState.arguments = input
    return () => {
      if (input.element) input.dispose()
    }
  }, [key, onChange])

  return [onChange == null ? value : undefined, setValue, inputRef]
}
