import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { BaseBladeParams, TextBladeApi, TpChangeEvent } from 'tweakpane'
import { FolderInstance } from './usePaneFolder'

interface UseTextBladeParams<T> extends BaseBladeParams {
  parse: (text: string) => T | null
  value: T
  format: (value: T) => string
  label?: string
}

type BladeRef<V> = RefObject<TextBladeApi<V>>

export function useTextBlade<T extends Object, V>(
  paneRef: RefObject<FolderInstance<T>>,
  bladeParams: UseTextBladeParams<V>
): [V, (value: V) => void, BladeRef<T>]

export function useTextBlade<T extends Object, V>(
  paneRef: RefObject<FolderInstance<T>>,
  bladeParams: UseTextBladeParams<V>,
  onChange: (event: TpChangeEvent<V>) => void
): [never, (value: V) => void, BladeRef<T>]

export function useTextBlade<T extends Object, V>(
  paneRef: RefObject<FolderInstance<T>>,
  params: UseTextBladeParams<V>,
  onChange?: (event: TpChangeEvent<V>) => void
) {
  const [value, set] = useState<V>(params.value)

  const bladeRef = useRef<TextBladeApi<V>>(null!)

  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  useEffect(() => {
    const blade = bladeRef.current
    if (blade == null) return
    blade.disabled = Boolean(params.disabled)
    blade.hidden = Boolean(params.hidden)
    blade.label = params.label
    blade.value = params.value
    blade.formatter = params.format!
  }, [params.disabled, params.hidden, params.label, params.value])

  const setValue = useCallback((value: V) => {
    bladeRef.current.value = value
  }, [])

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    params.view = params.view || 'text'
    const blade = pane.addBlade(params) as TextBladeApi<V>

    const handler: (ev: TpChangeEvent<V>) => void = onChange
      ? (event) => callbackRef.current!(event)
      : (event) => set(event.value)

    blade.on('change', handler)
    bladeRef.current = blade

    return () => {
      if (blade.element) blade.dispose()
    }
  }, [])

  return [onChange ? undefined : value, setValue, bladeRef] as const
}
