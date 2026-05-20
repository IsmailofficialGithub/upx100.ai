import { StatusCodes } from 'http-status-codes';
import * as scriptAuditService from '../services/scriptAudit.service.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const getOrgAgentsForScript = async (req, res) => {
  const { orgId } = req.params;
  if (!UUID_RE.test(String(orgId))) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Invalid organization id' } });
  }

  try {
    const agents = await scriptAuditService.listAgentsForOrg(orgId);
    return res.json({ data: agents });
  } catch (error) {
    console.error('[orgScript] list agents', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: 'Failed to load agents' } });
  }
};

export const patchAgentScript = async (req, res) => {
  const { orgId, agentId } = req.params;
  if (!UUID_RE.test(String(orgId)) || !UUID_RE.test(String(agentId))) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Invalid id' } });
  }

  const script = req.body?.script;
  if (script == null || typeof script !== 'string') {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'script (string) is required' } });
  }

  try {
    const result = await scriptAuditService.updateAgentScriptDirect({
      organizationId: orgId,
      agentId,
      script,
      actorId: req.user.userId,
      campaignType: req.body?.campaign_type,
    });
    return res.json({
      message: 'Script saved',
      data: result.agent,
      audit: result.audit,
    });
  } catch (error) {
    if (error.code === 'NOT_FOUND') {
      return res.status(StatusCodes.NOT_FOUND).json({ error: { message: error.message } });
    }
    if (error.code === 'FORBIDDEN') {
      return res.status(StatusCodes.FORBIDDEN).json({ error: { message: error.message } });
    }
    console.error('[orgScript] patch script', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: 'Failed to save script' } });
  }
};

export const getScriptAuditLog = async (req, res) => {
  const { orgId } = req.params;
  if (!UUID_RE.test(String(orgId))) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: { message: 'Invalid organization id' } });
  }

  try {
    const rows = await scriptAuditService.listScriptAuditLog(orgId);
    return res.json({ data: rows });
  } catch (error) {
    console.error('[orgScript] audit log', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: { message: 'Failed to load audit log' } });
  }
};
