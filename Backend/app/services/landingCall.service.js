import axios from 'axios'

export const triggerLandingPageCall = async ({ name, phone, source = 'landing_page' }) => {
  const baseUrl = process.env.REACT_APP_WEBHOOK_BASE_URL || ''
  const path =
    process.env.REACT_APP_WEBHOOK_LANDING_PAGE_CALL || '/webhook/landing_page_call'
  const webhookUrl = `${baseUrl}${path}`

  const payload = {
    name,
    phone,
    source,
    requested_at: new Date().toISOString(),
  }

  console.log('[triggerLandingPageCall] Calling webhook:', webhookUrl)
  console.log('[triggerLandingPageCall] Payload:', payload)

  const { data } = await axios.post(webhookUrl, payload)
  return data
}
