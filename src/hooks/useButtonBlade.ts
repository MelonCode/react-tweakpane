import { BaseBladeParams } from '@tweakpane/core'
import { RefObject, useLayoutEffect, useRef } from 'react'
import { ButtonApi } from 'tweakpane'
import { FolderInstance } from './usePaneFolder'

interface UseButtonBladeParams extends BaseBladeParams {
  title: string
  label?: string
}

export function useButtonBlade<T extends Object>(
  paneRef: RefObject<FolderInstance<T>>,
  params: UseButtonBladeParams,
  onClick: () => void
): RefObject<ButtonApi> {
  const bladeRef = useRef<ButtonApi>(null!)

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    const blade = pane.addButton({
      title: params.title,
      label: params.label,
    }) as ButtonApi

    blade.on('click', onClick)
    bladeRef.current = blade

    return () => {
      if (blade.element) blade.dispose()
    }
  }, [])

  return bladeRef
}