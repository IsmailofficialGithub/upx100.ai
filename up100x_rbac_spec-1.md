# UP100X AI - Role-Based Access Control (RBAC)

# Specification

#### Developer Reference - ORM Platform (US + UK) | CONFIDENTIAL

##### Document: RBAC Specification v1.

##### Date: April 14, 2026

##### Author: Omair - Founder / Managing Member

##### Recipient: Development Team

##### Brand: UP100X AI (UK entity: UP100X AI LTD)

## 1. User Roles - Complete Taxonomy

#### There are 6 distinct user roles across the UP100X AI ORM platform. Each role operates within strict permission

#### boundaries. RBAC must be enforced at the API layer - no client-side permission checks.

#### UP100X AI Internal

- GCC Admin - Operations leadership. God mode. Full read/write across all tenants, all clients, all data. Can create

#### and destroy any entity in the system.

- GCC Reviewer - HITL operators. Review contacts before they enter the dialing pipeline, approve script change

#### requests, process target account CSV uploads, monitor compliance flags. Cannot configure billing or create clients.

#### Sales Partner (Reseller) Side

- Sales Partner (Primary) - Reseller who signed the Master Agency Agreement. Sees own client portfolio,

#### commissions, tasks. Can add/remove sub-users on their own team. Cannot see other SPs.

- Sales Partner Sub-user - Sales rep under a Primary SP. Sees only assigned deals/clients. Read-only commission.

#### Cannot submit script changes or manage sub-users.

#### Client Side

- Client Admin - Business owner/VP who signed the contract. Full campaign dashboard access. Can add sub-users,

#### pause/resume campaigns, submit script changes, upload target account CSVs, select voice personas, approve cloned

#### voice submissions from sub-users, request number ports.

- Client Sub-user - Sales manager, SDR lead, or team member needing visibility. Read-only dashboard. Can listen to

#### live calls, view transcripts, take over live calls for their assigned agent only, and submit their voice for cloning (requires

#### Client Admin approval). Cannot pause campaigns, submit script changes, or upload files.


## 2. Permission Matrix

#### Legend: YES = Full access | LIMITED (italic text) = Conditional | NO = No access. Enforce at API layer.

```
Capability GCC Admin GCC Reviewer SP Primary SP Sub Client Admin Client Sub
USER MANAGEMENT
Create Sales Partners YES NO NO NO NO NO
Create Clients YES NO NO NO NO NO
Add SP sub-users YES NO Own team NO NO NO
Add Client sub-users YES NO NO NO Own team NO
Remove/deactivate users YES NO Own subs NO Own subs NO
AI AGENT CONFIGURATION
Create agents from scratch YES NO NO NO NO NO
Select voice per campaign Override NO NO NO From list NO
Upload cloned voice sample Override NO NO NO Approve Submit to ClientAdmin
Submit script change Auto-approve NO Own clients NO Own campaign NO
Approve/deploy scripts YES YES NO NO NO NO
PHONE NUMBERS
Provision new numbers YES NO NO NO NO NO
Request number port Process NO NO NO Submit req NO
Assign voice to number Override NO NO NO Own numbers NO
10DLC / carrier reg YES YES NO NO NO NO
PIPELINE AND CONTACTS
Upload target accounts CSV Process Review NO NO Companies only NO
Approve/reject accounts YES YES NO NO NO NO
DNC/TPS compliance YES YES NO NO NO NO
View raw contact data YES YES NO NO NO NO
CAMPAIGN CONTROL
Pause/resume campaign Override NO NO NO With reason NO
Listen to live calls All NO NO NO Own Own
Take over live call All NO NO NO Own Assigned agentonly
ANALYTICS AND REPORTING
View recordings/transcripts All All Own clients NO Own Own
View pipeline/meetings All All Own clients Own deals Own Own
View health scores All All Own clients Own NO NO
Export board reports YES NO NO NO Own data NO
FINANCIAL
View all payments YES NO NO NO NO NO
View own commission NO NO YES Own NO NO
Manage billing YES NO NO NO NO NO
```

#### GOLDEN RULE: Clients configure intent. UP100X AI provisions infrastructure. Every client action touching

#### compliance, telephony, or contact data passes through the GCC gate.


## 3. Developer Questions - Detailed Answers

### Q1: Roles and permissions?

#### See Sections 1 and 2 above. Implement RBAC at the API middleware layer using JWT claims. Each endpoint checks

#### caller role. Do not rely on hiding UI elements.

### Q2: Commission model?

##### ORM model (US/UK). Do not confuse with OPE (China).

```
Component Percentage Rules
Client pays 100% of MRR Collected by UP100X AI directly. Client never pays the Sales Partner.
Base commission 20% of MRR Ongoing for the first 12 months of client tenure. Paid on the 15th for prior
month collections. Pricing is subject to change.
Month 1 bonus +10% of MRR (Month 1 only) One-time. 30% total in first month. First payment clearing only.
UP100X AI retains 80% of MRR (70% Month 1) Covers infrastructure, compliance, voice minutes, support.
Commission at risk Flagged in portal SP commission held if client invoice overdue. No payout until collection.
Post-12-month Subject to renewal terms Commission rate after initial 12 months renegotiated at renewal.
```
#### No commission flow between SP and Client. SP sells, UP100X AI collects, UP100X AI pays SP. Client never knows SP

#### earnings. All percentages are of client MRR - specific pricing is not included in this document as it is subject to change.

### Q3: Who can create users?

#### GCC Admin creates Sales Partners and Clients (top-level entities).

#### SP Primary can add/remove sub-users on their own team (sales reps needing their own login).

#### Client Admin can add/remove sub-users on their own team (sales managers, SDR leads needing dashboard visibility).

##### No other role can create users of any type.

### Q4: Number importing and agent creation?

#### Agent creation: GCC Admin only. This is the core managed service.

#### New numbers: GCC Admin provisions. Handles 10DLC (US), carrier reg (UK), STIR/SHAKEN.

#### Port (bring your own): Client Admin submits request. GCC processes port, verifies compliance, registers, assigns to

#### campaign. Client never touches Twilio.

#### Voice personas: Client Admin selects from approved list OR uploads cloned voice sample and approves it for

#### deployment. Client Sub-users can submit their own voice to the Client Admin for review - the Client Admin approves or

#### rejects. GCC Admin retains override capability.

### Q5: Should admins/resellers monitor client activity?

#### GCC Admin: Full visibility - live calls, recordings, transcripts, pipeline, health scores, payments, compliance logs. All

#### clients.

#### GCC Reviewer: Same operational data. No financial access.

#### SP Primary: Own client portfolio - meetings, health, commission, payments. Can drill into meeting log and transcripts.


#### SP Sub-user: Assigned deals/clients only. Read-only commission.

### Q6: Level of operational control?

- GCC Admin/Reviewer: Full control. Create, modify, delete any entity. Override any setting. Kill-switch any campaign.
- Sales Partners: Zero operational control. Sales and relationship layer only. Can submit script change requests but

#### cannot deploy.

- Client Admin: Six write actions: (1) pause/resume with reason, (2) submit script changes, (3) upload target account

#### CSVs (companies only), (4) select voice personas, (5) approve cloned voice submissions from sub-users, (6) request

#### number port. Everything else is read-only.

- Client Sub-user: Two write actions: (1) submit own voice for cloning (requires Client Admin approval), (2) take over a

#### live call for their assigned agent only. Everything else is read-only.

### Q7: Follow design exactly or use as reference?

#### The HTML files provided are the exact UI specification. Replicate pixel-for-pixel into React/TypeScript:

- Fonts: Inter (body) + JetBrains Mono (metrics/labels)
- Dark mode default: #000000 / #0a0a0a / #111111, accent #00ff
- Light mode: #f5f5f3 / #ffffff, accent #0088ff
- 240px fixed sidebar SPA, 5 nav sections
- All component patterns (cards, metrics, toggles, accordions, breadcrumbs) are final

#### IMPORTANT - Color contrast: The muted gray text (#555555 in dark mode, #999992 in light mode) must be updated to

#### higher-contrast values. Use #ffffff (white) for primary text on dark backgrounds and #d0d0d0 for secondary text. The

#### current gray values are too low-contrast for readability. Apply this across all dashboard files.

#### Production changes only: (1) mock data to live DB queries, (2) alert() to API calls, (3) auth/RBAC per this document.

UP100X AI LTD | CONFIDENTIAL | RBAC Specification v1.0 | April 14, 2026


