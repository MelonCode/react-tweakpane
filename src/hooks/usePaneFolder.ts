import { Bindable, FolderApi, FolderParams } from '@tweakpane/core'
import { PaneInstance } from 'index'
import { MutableRefObject, useEffect, useLayoutEffect, useRef } from 'react'

export interface FolderInstance<T extends Bindable> {
  instance: FolderApi | null
  params: T
}

export function usePaneFolder<T extends Bindable>(
  paneRef: MutableRefObject<PaneInstance<T>>,
  folderParams: FolderParams
) {
  const folderRef = useRef<FolderInstance<T>>({
    instance: null,
    params: paneRef.current.params,
  })

  useEffect(() => {
    const folder = folderRef.current.instance
    if (folder == null) return
    folder.title = folderParams.title
    folder.expanded = folderParams.expanded ?? true
    folder.disabled = Boolean(folderParams.disabled)
    folder.hidden = Boolean(folderParams.hidden)
  }, [
    folderParams.disabled,
    folderParams.expanded,
    folderParams.title,
    folderParams.hidden,
  ])

  useLayoutEffect(() => {
    const pane = paneRef.current.instance
    if (pane == null) return

    const folder = pane.addFolder(folderParams)

    folderRef.current.instance = folder

    return () => {
      if (folder.element) folder.dispose()
    }
  }, [])

  return folderRef!
}
