import { useBoolean } from 'ahooks'

/**
 * Loading
 *
 * @param initValue Init value
 */
export default function useLoading(initValue = false) {
  const [loading, { setFalse: endLoading, setTrue: startLoading }] =
    useBoolean(initValue)

  return {
    endLoading,
    loading,
    startLoading
  }
}
