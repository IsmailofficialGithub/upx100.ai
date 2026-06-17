/**
 * Resolve which client org owns a call log when organization_id was not set on insert.
 */

export function effectiveCallLogOrganizationId(row) {
  if (!row || typeof row !== 'object') return null
  if (row.organization_id) return row.organization_id

  const agent = row.agents
  if (agent && typeof agent === 'object' && !Array.isArray(agent)) {
    return agent.organization_id ?? null
  }
  if (Array.isArray(agent) && agent[0]?.organization_id) {
    return agent[0].organization_id
  }
  return row.agent_organization_id ?? null
}

export function callLogBelongsToOrg(row, orgId) {
  if (!orgId) return false
  return effectiveCallLogOrganizationId(row) === orgId
}
