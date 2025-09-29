import { useMemo } from 'react'
import useCountDownTimer from './use-count-down'

import useLoading from './use-loading'

const REG_PHONE =
  /^[1](([3][0-9])|([4][01456789])|([5][012356789])|([6][2567])|([7][0-8])|([8][0-9])|([9][012356789]))[0-9]{8}$/

export function useCaptcha() {
  const { endLoading, loading, startLoading } = useLoading()
  const { count, isCounting, start } = useCountDownTimer(60)

  const label = useMemo(() => {
    let text = '获取验证码'

    const countingLabel = `${count}s`

    if (loading) {
      text = ''
    }

    if (isCounting) {
      text = countingLabel
    }

    return text
  }, [count])

  function isPhoneValid(phone: string) {
    if (!phone || phone.trim() === '') {
      return false
    }

    if (!REG_PHONE.test(phone)) {
      return false
    }

    return true
  }
  async function getCaptcha(phone: string, errorCallback?: () => void) {
    const valid = isPhoneValid(phone)

    if (!valid || loading) {
      errorCallback?.()
      return
    }

    start()

    endLoading()
  }

  return {
    getCaptcha,
    isCounting,
    label,
    loading
  }
}
