import { useEffect, useRef, useState } from 'react'
import type { Result, ServiceErrorCode } from '../../../services/next/backendContracts'
import type { CompletionOperation } from './completionOperation'

export type CompletionState<T> = { status: 'idle' | 'submitting' }
  | { status: 'error'; error: ServiceErrorCode }
  | { status: 'confirmed'; receipt: T }

export function useCompletionOperation<T>(operation: CompletionOperation<T>, onConfirmed?: (receipt: T) => void) {
  const [state, setState] = useState<{ operation: CompletionOperation<T>; value: CompletionState<T> }>({ operation, value: { status: 'idle' } })
  const activeRef = useRef<CompletionOperation<T> | undefined>(operation)
  const callbackRef = useRef(onConfirmed)
  activeRef.current = operation
  callbackRef.current = onConfirmed
  useEffect(() => {
    activeRef.current = operation
    return () => { if (activeRef.current === operation) activeRef.current = undefined }
  }, [operation])
  const value = state.operation === operation ? state.value : { status: 'idle' as const }
  const submit = async () => {
    setState({ operation, value: { status: 'submitting' } })
    const result: Result<T> = await operation.run()
    if (activeRef.current !== operation) return
    setState({ operation, value: result.ok ? { status: 'confirmed', receipt: result.value } : { status: 'error', error: result.error } })
    if (result.ok) callbackRef.current?.(result.value)
  }
  return { state: value, submit }
}
