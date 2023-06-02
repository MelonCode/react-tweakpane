import { Bindable, TpChangeEvent, normalizeListOptions } from '@tweakpane/core'
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ListApi, ListBladeParams } from 'tweakpane'
import { PaneInstance } from './useTweakpane'

export function useListBlade<T extends Bindable, V>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  bladeParams: ListBladeParams<V>
): [V, (value: V) => void, MutableRefObject<ListApi<V>>]

export function useListBlade<T extends Bindable, V>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  bladeParams: ListBladeParams<V>,
  onChange: (event: TpChangeEvent<V>) => void
): [never, (value: V) => void, MutableRefObject<ListApi<V>>]

export function useListBlade<T extends Bindable, V>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  bladeParams: ListBladeParams<V>,
  onChange?: (event: TpChangeEvent<V>) => void
) {
  const [value, set] = useState<V>(bladeParams.value)

  const bladeRef = useRef<ListApi<V>>(null!)

  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  const blade = bladeRef.current
  if (blade) {
    blade.disabled = Boolean(bladeParams.disabled)
    blade.hidden = Boolean(bladeParams.hidden)
    blade.label = bladeParams.label
    blade.value = bladeParams.value
  }

  useEffect(() => {
    const blade = bladeRef.current
    if (blade == null) return
    blade.options = normalizeListOptions(bladeParams.options)
  }, [JSON.stringify(bladeParams.options)])

  const setValue = useCallback((value: V) => {
    bladeRef.current.value = value
  }, [])

  const handler: (ev: TpChangeEvent<V>) => void = onChange
    ? (event) => callbackRef.current!(event)
    : (event) => set(event.value)

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    const blade = pane.addBlade(bladeParams) as ListApi<V>

    blade.on('change', handler)
    bladeRef.current = blade

    return () => {
      if (blade.element) blade.dispose()
    }
  }, [])

  return [onChange ? value : undefined, setValue, bladeRef] as const
}
