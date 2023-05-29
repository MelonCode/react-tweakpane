import {
  Bindable,
  InputBindingApi,
  InputParams,
  TpChangeEvent,
} from '@tweakpane/core'
import { useLayoutEffect } from 'react'
import { MutableRefObject, useCallback, useRef, useState } from 'react'
import { Pane } from 'tweakpane'
import { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'

interface PaneInstance<T extends Bindable> {
  instance: Pane | null
  params: T
}

export function useTweakpane<T extends Bindable>(
  params: T,
  paneConfig: PaneConfig = {}
) {
  const paneRef = useRef<PaneInstance<T>>({
    instance: null,
    params: params,
  })

  useLayoutEffect(() => {
    const pane = new Pane(paneConfig)
    paneRef.current.instance = pane
    return () => {
      paneRef.current.instance = null
      pane.dispose()
    }
  }, [])

  return paneRef!
}

/**
 * Does not return the value and doesn't trigger an update because onChange is specified
 */
export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  key: K,
  inputParams: InputParams | undefined,
  onChange: (event: TpChangeEvent<T[K]>) => void
): [never, (value: T[K]) => void]

// Skips inputParams
/** Does not return the value and doesn't trigger an update because onChange is specified */
export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  key: K,
  onChange: (event: TpChangeEvent<T[K]>) => void
): [never, (value: T[K]) => void]

/**
 * Returns the value and triggers an update
 */
export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  key: K,
  inputParams?: InputParams | undefined,
  onChange?: undefined
): [T[K], (value: T[K]) => void]

export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  key: K,
  inputParams?: InputParams | undefined,
  onChange?: undefined
): [T[K], (value: T[K]) => void]

export function usePaneInput<T extends Bindable, K extends keyof T>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  key: K,
  inputParamsArg:
    | InputParams
    | ((event: TpChangeEvent<T[K]>) => void)
    | undefined = {},
  onChange: ((event: TpChangeEvent<T[K]>) => void) | undefined = undefined
) {
  const [value, set] = useState(paneRef.current.params[key])

  const inputRef = useRef<InputBindingApi<unknown, T[K]>>(null!)

  const setValue = useCallback((value: T[K]) => {
    inputRef.current.controller_.binding.target.write(value)
    inputRef.current.refresh()
  }, [])

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    const handler = onChange
      ? onChange
      : (event: TpChangeEvent<T[K]>) => set(event.value)

    const inputParams =
      typeof inputParamsArg === 'function' ? {} : inputParamsArg

    const input = pane
      .addInput(paneRef.current.params, key, inputParams)
      .on('change', handler)

    inputRef.current = input

    return () => {
      if (input.element) input.dispose()
    }
  }, [key, onChange])

  return [onChange == null ? value : undefined, setValue]
}
