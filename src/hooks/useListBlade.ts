import {
  BaseBladeParams,
  ListParamsOptions,
  TpChangeEvent,
  normalizeListOptions,
} from '@tweakpane/core'
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { ListBladeApi } from 'tweakpane'
import { PaneInstance } from './useTweakpane'

interface UseSliderBladeParams<T> extends BaseBladeParams {
  options: ListParamsOptions<T>
  value: T
  label?: string
  view?: 'list'
}

export function useListBlade<T extends Object, V>(
  paneRef: RefObject<PaneInstance<T>>,
  bladeParams: UseSliderBladeParams<V>
): [V, (value: V) => void, RefObject<ListBladeApi<V>>]

export function useListBlade<T extends Object, V>(
  paneRef: RefObject<PaneInstance<T>>,
  bladeParams: UseSliderBladeParams<V>,
  onChange: (event: TpChangeEvent<V>) => void
): [never, (value: V) => void, RefObject<ListBladeApi<V>>]

export function useListBlade<T extends Object, V>(
  paneRef: RefObject<PaneInstance<T>>,
  params: UseSliderBladeParams<V>,
  onChange?: (event: TpChangeEvent<V>) => void
) {
  const [value, set] = useState<V>(params.value)

  const bladeRef = useRef<ListBladeApi<V>>(null!)

  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  useEffect(() => {
    const blade = bladeRef.current
    if (blade) {
      blade.disabled = Boolean(params.disabled)
      blade.hidden = Boolean(params.hidden)
      blade.label = params.label
      blade.value = params.value
    }
  }, [params.disabled, params.hidden, params.label, params.value])

  useEffect(() => {
    const blade = bladeRef.current
    if (blade == null) return
    blade.options = normalizeListOptions(params.options)
  }, [JSON.stringify(params.options)])

  const setValue = useCallback((value: V) => {
    bladeRef.current.value = value
  }, [])

  const handler: (ev: TpChangeEvent<V>) => void = onChange
    ? (event) => callbackRef.current!(event)
    : (event) => set(event.value)

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    params.view = params.view || 'list'
    const blade = pane.addBlade(params) as ListBladeApi<V>

    blade.on('change', handler)
    bladeRef.current = blade

    return () => {
      if (blade.element) blade.dispose()
    }
  }, [])

  return [onChange ? undefined : value, setValue, bladeRef] as const
}
