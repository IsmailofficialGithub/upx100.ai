import { StatusCodes } from 'http-status-codes';
import { getExportTargetOrgIds } from './admin.controller.js';
import * as exportService from '../services/export.service.js';

/**
 * JSON payload for a PDF (or other) client export for the last 30 days, scoped like admin/dashboard APIs.
 */
export const getMonthlyExport = async (req, res) => {
  try {
    const targetOrgIds = await getExportTargetOrgIds(req);
    if (Array.isArray(targetOrgIds) && targetOrgIds.length === 0) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: { message: 'Export is not available for your role or organization assignment.' },
      });
    }

    const days = Math.min(90, Math.max(1, parseInt(req.query.days, 10) || 30));
    const { from, to } = exportService.getDefaultPeriod(days);
    const includeAdminSnapshot = req.user.role === 'gcc_admin' || req.user.role === 'admin';

    const { data, error } = await exportService.buildMonthlyExport({
      targetOrgIds,
      fromIso: from,
      toIso: to,
      includeAdminSnapshot,
    });

    if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: { message: error.message || 'Failed to build export' },
      });
    }

    const orgName = req.user.profile?.organizations?.name || null;

    return res.status(StatusCodes.OK).json({
      data: {
        ...data,
        meta: {
          role: req.user.role,
          email: req.user.email,
          userId: req.user.userId,
          organizationName: orgName,
          includeAdminSnapshot,
        },
      },
    });
  } catch (e) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: { message: e.message },
    });
  }
};
