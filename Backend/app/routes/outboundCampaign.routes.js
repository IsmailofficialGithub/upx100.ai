import express from 'express'
import * as outboundCampaignController from '../controllers/outboundCampaign.controller.js'
import { auth } from '../middlewares/auth.js'
import { requireRole } from '../middlewares/rbac.js'
import { requireOutboundAccess } from '../middlewares/channelAccess.js'

const router = express.Router()

const writeRoles = ['gcc_admin', 'gcc_reviewer', 'client_admin', 'client_sub', 'sp_primary', 'sp_sub']

router.use(auth)
router.use(requireOutboundAccess)

router.get('/', outboundCampaignController.getOutboundCampaigns)
router.get('/:id', outboundCampaignController.getOutboundCampaign)

router.post('/', requireRole(writeRoles), outboundCampaignController.createOutboundCampaign)
router.post('/:id/targets', requireRole(writeRoles), outboundCampaignController.addTargetsToOutboundCampaign)
router.post('/:id/initiate', requireRole(writeRoles), outboundCampaignController.initiateOutboundCampaign)
router.patch('/:id', requireRole(writeRoles), outboundCampaignController.updateOutboundCampaign)
router.delete('/:id', requireRole(writeRoles), outboundCampaignController.deleteOutboundCampaign)

export default router
