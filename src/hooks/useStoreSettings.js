import { useEffect, useState } from 'react'
import {
  getSettings,
  getCachedStoreSettings,
  STORE_SETTINGS_EVENT,
} from '../services/api'

let fetchedOnce = false

export default function useStoreSettings() {
  const [store, setStore] = useState(getCachedStoreSettings)

  useEffect(() => {
    // Same tab: Settings page saved new details
    const onChange = (event) => setStore(event.detail)

    // Other browser tabs
    const onStorage = (event) => {
      if (event.key === 'mstore_settings') setStore(getCachedStoreSettings())
    }

    window.addEventListener(STORE_SETTINGS_EVENT, onChange)
    window.addEventListener('storage', onStorage)

    // Load the latest details from the backend once per app load
    if (!fetchedOnce) {
      fetchedOnce = true
      getSettings().catch((error) => {
        fetchedOnce = false
        console.error('Unable to load store settings:', error)
      })
    }

    return () => {
      window.removeEventListener(STORE_SETTINGS_EVENT, onChange)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return store
}