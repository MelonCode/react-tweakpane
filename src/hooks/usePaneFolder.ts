import { RefObject, useEffect, useLayoutEffect, useRef } from 'react'
import { PaneInstance } from './useTweakpane'
import { FolderApi, FolderParams } from 'tweakpane'

export interface FolderInstance<T extends {}> {
  instance: FolderApi | null
  params: T
}

export function usePaneFolder<T extends {}>(
  paneRef: RefObject<PaneInstance<T>>,
  folderParams: FolderParams
): RefObject<FolderInstance<T>> {
  const folderRef = useRef<FolderInstance<T>>({
    instance: null,
    params: paneRef.current?.params || ({} as T),
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
    const pane = paneRef.current?.instance
    if (pane == null) return

    const folder = pane.addFolder(folderParams)

    folderRef.current.instance = folder
    folderRef.current.params = paneRef.current?.params || ({} as T)

    return () => {
      if (folder.element) folder.dispose()
    }
  }, [])

  return folderRef!
}
