import { BaseBladeParams, TpChangeEvent } from '@tweakpane/core'
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { SliderBladeApi } from 'tweakpane'
import { FolderInstance } from './usePaneFolder'

interface UseSliderBladeParams extends BaseBladeParams {
  max: number
  min: number
  view?: 'slider'
  format?: (value: number) => string
  label?: string
  value?: number
}

type BladeRef = RefObject<SliderBladeApi>

export function useSliderBlade<T extends Object, V>(
  paneRef: RefObject<FolderInstance<T>>,
  bladeParams: UseSliderBladeParams
): [number, (value: number) => void, BladeRef]

export function useSliderBlade<T extends Object, V>(
  paneRef: RefObject<FolderInstance<T>>,
  bladeParams: UseSliderBladeParams,
  onChange: (event: TpChangeEvent<number>) => void
): [never, (value: number) => void, BladeRef]

export function useSliderBlade<T extends Object>(
  paneRef: RefObject<FolderInstance<T>>,
  params: UseSliderBladeParams,
  onChange?: (event: TpChangeEvent<number>) => void
) {
  const [value, set] = useState<number>(params.value || 0)

  const bladeRef = useRef<SliderBladeApi>(null!)

  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  useEffect(() => {
    const blade = bladeRef.current
    if (blade == null) return
    blade.disabled = Boolean(params.disabled)
    blade.hidden = Boolean(params.hidden)
    blade.label = params.label
    blade.max = params.max
    blade.min = params.min
    blade.value = params.value || 0
  }, [
    params.disabled,
    params.hidden,
    params.label,
    params.value,
    params.max,
    params.min,
  ])

  const setValue = useCallback((value: number) => {
    bladeRef.current.value = value
  }, [])

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    params.view = params.view || 'slider'
    const blade = pane.addBlade(params) as SliderBladeApi

    const handler: (ev: TpChangeEvent<number>) => void = onChange
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
