/**
 * Resolve inbound/outbound channel access for a request user.
 * GCC roles always have full access.
 */
export const resolveChannelAccess = (user) => {
  const role = user?.role
  if (role === 'gcc_admin' || role === 'gcc_reviewer') {
    return { canInbound: true, canOutbound: true }
  }

  const profile = user?.profile || {}
  const canInbound =
    user?.canInbound !== undefined
      ? Boolean(user.canInbound)
      : profile.can_inbound !== false
  const canOutbound =
    user?.canOutbound !== undefined
      ? Boolean(user.canOutbound)
      : profile.can_outbound !== false

  // Safety: never lock a user out of both channels
  if (!canInbound && !canOutbound) {
    return { canInbound: true, canOutbound: true }
  }

  return { canInbound, canOutbound }
}

export const normalizeChannelFlags = (body = {}) => {
  const hasInbound = body.can_inbound !== undefined
  const hasOutbound = body.can_outbound !== undefined

  let canInbound = hasInbound ? Boolean(body.can_inbound) : true
  let canOutbound = hasOutbound ? Boolean(body.can_outbound) : true

  if (!canInbound && !canOutbound) {
    const err = new Error('Select at least one channel: Inbound or Outbound')
    err.status = 400
    err.code = 'VALIDATION'
    throw err
  }

  return { can_inbound: canInbound, can_outbound: canOutbound }
}

export const filterCallLogsByChannel = (logs, { canInbound, canOutbound }) => {
  if (canInbound && canOutbound) return logs || []
  return (logs || []).filter((row) => {
    const raw = String(row?.call_type ?? row?.call_direction ?? '').toLowerCase()
    const isOutbound = raw.includes('outbound')
    const isInbound = raw.includes('inbound')
    if (isOutbound) return canOutbound
    if (isInbound) return canInbound
    // Unknown direction: show only if user has both (already handled) or inbound
    return canInbound
  })
}

export const filterAgentsByChannel = (agents, { canInbound, canOutbound }) => {
  if (canInbound && canOutbound) return agents || []
  return (agents || []).filter((agent) => {
    const type = String(agent?.agent_type || '').toLowerCase()
    if (type === 'outbound') return canOutbound
    if (type === 'inbound') return canInbound
    // Legacy / unspecified types: treat as inbound-facing
    return canInbound
  })
}
