import { useEffect } from 'react'
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { useLoader } from './useLoader'

/**
 * Hook that automatically shows/hides global loader based on TanStack Query state
 * 
 * @param query - The query or mutation result from TanStack Query
 * @param loadingMessage - Message to display while loading
 * @param showLoader - Whether to show the global loader (default: true)
 */
export function useQueryWithLoader<TData, TError>(
  query: UseQueryResult<TData, TError>,
  loadingMessage?: string,
  showLoader: boolean = true
) {
  const { showLoader: show, hideLoader } = useLoader()

  useEffect(() => {
    if (!showLoader) return

    if (query.isLoading || query.isFetching) {
      show(loadingMessage || 'Loading...')
    } else {
      hideLoader()
    }

    // Cleanup on unmount
    return () => {
      hideLoader()
    }
  }, [query.isLoading, query.isFetching, show, hideLoader, loadingMessage, showLoader])

  return query
}

/**
 * Hook that automatically shows/hides global loader for mutations
 */
export function useMutationWithLoader<TData, TError, TVariables, TContext>(
  mutation: UseMutationResult<TData, TError, TVariables, TContext>,
  loadingMessage?: string,
  showLoader: boolean = true
) {
  const { showLoader: show, hideLoader } = useLoader()

  useEffect(() => {
    if (!showLoader) return

    if (mutation.isPending) {
      show(loadingMessage || 'Processing...')
    } else {
      hideLoader()
    }

    // Cleanup on unmount
    return () => {
      hideLoader()
    }
  }, [mutation.isPending, show, hideLoader, loadingMessage, showLoader])

  return mutation
}

/**
 * Manual loader control for complex API operations
 */
export function useApiLoader() {
  const { showLoader, hideLoader } = useLoader()

  const withLoader = async <T>(
    apiCall: () => Promise<T>,
    message: string = 'Processing...'
  ): Promise<T> => {
    showLoader(message)
    try {
      const result = await apiCall()
      return result
    } finally {
      hideLoader()
    }
  }

  return {
    withLoader,
    showLoader,
    hideLoader,
  }
}