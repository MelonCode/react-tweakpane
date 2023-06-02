import { Bindable } from '@tweakpane/core'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Pane } from 'tweakpane'
import { PaneConfig } from 'tweakpane/dist/types/pane/pane-config'

export interface PaneInstance<T extends Bindable> {
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

  useEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    pane.title = paneConfig.title
    pane.expanded = paneConfig.expanded ?? true
    pane.refresh()
  }, [paneConfig.expanded, paneConfig.title])

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
